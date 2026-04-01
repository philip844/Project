// Authentication System

/**
 * Simple SHA-256 hash implementation for demo purposes
 * Note: For production, use bcrypt or similar
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against hash
 */
async function verifyPassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

class AuthService {
    constructor() {
        this.currentUser = this.loadCurrentUser();
        this.sessionToken = this.loadSessionToken();
    }

    /**
     * Register a new user
     */
    async register(userData) {
        // Validate email doesn't exist
        const existingUser = db.getUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Validate required fields
        if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
            throw new Error('Missing required fields');
        }

        // Hash password
        const hashedPassword = await hashPassword(userData.password);

        // Create user
        const user = db.createUser({
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone || '',
            role: userData.role || 'tenant'
        });

        // Remove password from returned user object
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        return userWithoutPassword;
    }

    /**
     * Login user
     */
    async login(email, password) {
        // Find user by email
        const user = db.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Create session token
        const token = this.generateToken();
        this.setCurrentUser(user, token);

        // Remove password from returned user object
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        return { user: userWithoutPassword, token };
    }

    /**
     * Logout user
     */
    logout() {
        this.clearSession();
        window.location.hash = '#login';
    }

    /**
     * Generate session token
     */
    generateToken() {
        return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Set current user and token
     */
    setCurrentUser(user, token) {
        this.currentUser = user;
        this.sessionToken = token;
        LocalStorageService.set(StorageKeys.CURRENT_USER, user);
        LocalStorageService.set(StorageKeys.SESSION_TOKEN, token);
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get session token
     */
    getSessionToken() {
        return this.sessionToken;
    }

    /**
     * Load current user from storage
     */
    loadCurrentUser() {
        return LocalStorageService.get(StorageKeys.CURRENT_USER, null);
    }

    /**
     * Load session token from storage
     */
    loadSessionToken() {
        return LocalStorageService.get(StorageKeys.SESSION_TOKEN, null);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null && this.sessionToken !== null;
    }

    /**
     * Clear session
     */
    clearSession() {
        this.currentUser = null;
        this.sessionToken = null;
        LocalStorageService.remove(StorageKeys.CURRENT_USER);
        LocalStorageService.remove(StorageKeys.SESSION_TOKEN);
    }

    /**
     * Check if current user has role
     */
    hasRole(role) {
        if (!this.currentUser) return false;
        if (typeof role === 'string') {
            return this.currentUser.role === role;
        }
        return role.includes(this.currentUser.role);
    }

    /**
     * Get current user ID
     */
    getCurrentUserId() {
        return this.currentUser?.id || null;
    }

    /**
     * Update current user
     */
    updateCurrentUser(userData) {
        const updatedUser = db.updateUser(this.currentUser.id, userData);
        this.setCurrentUser(updatedUser, this.sessionToken);
        return updatedUser;
    }

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        const user = this.currentUser;
        if (!user) {
            throw new Error('Not authenticated');
        }

        // Verify current password
        const isValid = await verifyPassword(currentPassword, user.password);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update user
        const updatedUser = db.updateUser(user.id, { password: hashedPassword });
        this.setCurrentUser(updatedUser, this.sessionToken);

        return true;
    }

    /**
     * Validate session
     */
    validateSession() {
        // In a real app, validate against server
        // For now, just check if token exists
        return this.isAuthenticated();
    }
}

// Create global auth service instance
const authService = new AuthService();

/**
 * Middleware to check if user is authenticated
 * Redirect to login if not
 */
function requireAuth(callback) {
    if (!authService.isAuthenticated()) {
        window.location.hash = '#login';
        return;
    }
    callback();
}

/**
 * Middleware to check if user has required role
 */
function requireRole(role, callback) {
    if (!authService.isAuthenticated()) {
        window.location.hash = '#login';
        return;
    }
    if (!authService.hasRole(role)) {
        console.error('Insufficient permissions');
        window.location.hash = '#forbidden';
        return;
    }
    callback();
}
