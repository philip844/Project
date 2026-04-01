// Main Application Initialization

class RentalManagementApp {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Rental Management System...');

        // Seed database first (if not already seeded)
        await seedDatabase();

        // Register all routes
        registerRoutes();

        // Setup event listeners
        this.setupEventListeners();

        // Render navbar
        this.renderNavbar();

        // Load initial route
        router.loadRoute();

        this.isInitialized = true;
        console.log('Application initialized successfully');
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Connection lost', 'warning');
        });

        // Handle window resize (for responsive design)
        window.addEventListener('resize', () => {
            this.updateResponsiveLayout();
        });

        // Prevent default link behavior for same-origin links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.includes('#')) {
                e.preventDefault();
                router.navigate(link.getAttribute('href'));
            }
        });
    }

    /**
     * Render navigation bar
     */
    renderNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        if (!authService.isAuthenticated()) {
            // Show public navbar
            navbar.innerHTML = this.renderPublicNavbar();
        } else {
            // Show authenticated navbar
            navbar.innerHTML = this.renderAuthenticatedNavbar();
        }
    }

    /**
     * Render public navbar
     */
    renderPublicNavbar() {
        return `
            <nav class="navbar-container">
                <div class="container flex-between">
                    <div class="navbar-brand">
                        <h2 style="margin: 0; color: var(--primary-color);">RENTIFY</h2>
                    </div>
                    <div class="navbar-menu">
                        <a href="#home" class="navbar-link">Home</a>
                        <a href="#login" class="navbar-link">Login</a>
                        <a href="#register" class="navbar-link">Register</a>
                    </div>
                </div>
            </nav>
        `;
    }

    /**
     * Render authenticated navbar
     */
    renderAuthenticatedNavbar() {
        const user = authService.getCurrentUser();
        const userName = `${user.firstName} ${user.lastName}`;
        const role = user.role === 'landlord' ? 'Landlord' : 'Tenant';

        return `
            <nav class="navbar-container">
                <div class="container flex-between">
                    <div class="navbar-brand">
                        <h2 style="margin: 0; color: var(--primary-color);">RENTIFY</h2>
                    </div>
                    <div class="navbar-menu">
                        ${this.getNavMenuLinks(user.role)}
                    </div>
                    <div class="navbar-user">
                        <span class="navbar-user-name">${userName}</span>
                        <span class="navbar-user-role">${role}</span>
                        <button class="btn btn-outline btn-sm" onclick="app.logout()">Logout</button>
                    </div>
                </div>
            </nav>
        `;
    }

    /**
     * Get navigation menu links based on user role
     */
    getNavMenuLinks(role) {
        if (role === 'landlord') {
            return `
                <a href="#landlord-dashboard" class="navbar-link">Dashboard</a>
                <a href="#properties" class="navbar-link">Properties</a>
                <a href="#tenants" class="navbar-link">Tenants</a>
                <a href="#leases" class="navbar-link">Leases</a>
                <a href="#payments" class="navbar-link">Payments</a>
                <a href="#maintenance" class="navbar-link">Maintenance</a>
            `;
        } else {
            return `
                <a href="#tenant-dashboard" class="navbar-link">Dashboard</a>
                <a href="#browse-properties" class="navbar-link">Find Property</a>
                <a href="#my-lease" class="navbar-link">My Lease</a>
                <a href="#my-payments" class="navbar-link">Payments</a>
                <a href="#my-maintenance" class="navbar-link">Maintenance</a>
            `;
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = createElement('div', {
            className: `notification notification-${type}`,
            text: message
        });

        container.appendChild(notification);

        // Auto-remove after duration
        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    /**
     * Logout user
     */
    logout() {
        const confirmed = confirm('Are you sure you want to logout?');
        if (confirmed) {
            authService.logout();
        }
    }

    /**
     * Update responsive layout
     */
    updateResponsiveLayout() {
        const width = window.innerWidth;
        const isSmallScreen = width <= 768;
        const isMobileScreen = width <= 480;

        // Update document classes
        document.body.classList.toggle('small-screen', isSmallScreen);
        document.body.classList.toggle('mobile-screen', isMobileScreen);
    }

    /**
     * Get app statistics
     */
    getStats() {
        return db.getStats();
    }

    /**
     * Get app info
     */
    getInfo() {
        return {
            name: 'Rental Management System',
            version: '1.0.0',
            initialized: this.isInitialized,
            currentRoute: router.currentRoute,
            user: authService.getCurrentUser(),
            stats: this.getStats()
        };
    }
}

// Create global app instance
const app = new RentalManagementApp();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init().catch(err => {
        console.error('Failed to initialize app:', err);
        alert('Error initializing application. Please refresh the page.');
    });
});

// Add CSS for navbar
function addNavbarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .navbar-container {
            background-color: var(--bg-primary);
            border-bottom: 1px solid var(--border-color);
            padding: var(--spacing-md) 0;
        }

        .navbar-menu {
            display: flex;
            gap: var(--spacing-lg);
            align-items: center;
        }

        .navbar-link {
            color: var(--text-primary);
            font-weight: var(--font-weight-medium);
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--radius-lg);
            transition: all var(--transition-fast);
        }

        .navbar-link:hover {
            background-color: var(--primary-light);
            color: white;
            text-decoration: none;
        }

        .navbar-user {
            display: flex;
            gap: var(--spacing-md);
            align-items: center;
            padding-left: var(--spacing-lg);
            border-left: 1px solid var(--border-color);
        }

        .navbar-user-name {
            font-weight: var(--font-weight-semibold);
            color: var(--text-primary);
        }

        .navbar-user-role {
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
        }

        .btn-sm {
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: var(--font-size-sm);
        }

        @media (max-width: 768px) {
            .container.flex-between {
                flex-direction: column;
                gap: var(--spacing-md);
                align-items: flex-start;
            }

            .navbar-menu {
                flex-wrap: wrap;
                gap: var(--spacing-sm);
                width: 100%;
            }

            .navbar-user {
                width: 100%;
                border-left: none;
                border-top: 1px solid var(--border-color);
                padding-left: 0;
                padding-top: var(--spacing-md);
            }

            .navbar-link {
                font-size: var(--font-size-sm);
                padding: var(--spacing-xs) var(--spacing-sm);
            }
        }

        @media (max-width: 480px) {
            .navbar-user-role {
                display: none;
            }

            .navbar-menu {
                gap: var(--spacing-xs);
            }
        }

        #notification-container {
            position: fixed;
            top: var(--spacing-lg);
            right: var(--spacing-lg);
            z-index: var(--z-tooltip);
            max-width: 400px;
        }

        @media (max-width: 768px) {
            #notification-container {
                left: var(--spacing-lg);
                right: var(--spacing-lg);
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add navbar styles when page loads
document.addEventListener('DOMContentLoaded', addNavbarStyles);
