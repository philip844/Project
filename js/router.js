// Application Router

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.setupHashListener();
    }

    /**
     * Register a route
     */
    register(path, component) {
        this.routes[path] = component;
    }

    /**
     * Navigate to a route
     */
    navigate(path) {
        window.location.hash = path.startsWith('#') ? path : `#${path}`;
    }

    /**
     * Get current path
     */
    getCurrentPath() {
        const hash = window.location.hash.slice(1) || 'home';
        return '/' + hash;
    }

    /**
     * Setup hash change listener
     */
    setupHashListener() {
        window.addEventListener('hashchange', () => this.loadRoute());
        // Don't load route here - let app.js handle initial load
    }

    /**
     * Load route
     */
    loadRoute() {
        const path = this.getCurrentPath();
        const route = this.routes[path] || this.routes['*'];

        if (!route) {
            console.error(`Route not found: ${path}`);
            this.render404();
            return;
        }

        // Check authentication if needed
        if (route.requireAuth && !authService.isAuthenticated()) {
            this.navigate('/login');
            return;
        }

        // Check role if needed
        if (route.requireRole && !authService.hasRole(route.requireRole)) {
            this.navigate('/forbidden');
            return;
        }

        // Call route handler
        if (route.component && typeof route.component === 'function') {
            this.renderComponent(route.component);
        } else {
            this.renderComponent(route);
        }

        this.currentRoute = path;
    }

    /**
     * Render component
     */
    renderComponent(component) {
        const pageContainer = document.getElementById('page-container');
        if (!pageContainer) {
            console.error('Page container not found');
            return;
        }

        // Clear container
        clearElement(pageContainer);

        // Render component
        if (typeof component === 'function') {
            const html = component();
            if (typeof html === 'string') {
                pageContainer.innerHTML = html;
            } else if (html instanceof Node) {
                pageContainer.appendChild(html);
            }
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    /**
     * Render 404 page
     */
    render404() {
        const pageContainer = document.getElementById('page-container');
        if (!pageContainer) return;

        clearElement(pageContainer);
        pageContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"></div>
                <h2 class="empty-state-title">Page Not Found</h2>
                <p class="empty-state-text">The page you're looking for doesn't exist.</p>
                <button class="btn btn-primary" onclick="router.navigate('/')">
                    Go Home
                </button>
            </div>
        `;
    }

    /**
     * Get all registered routes
     */
    getRoutes() {
        return Object.keys(this.routes);
    }

    /**
     * Check if route exists
     */
    routeExists(path) {
        return this.routes.hasOwnProperty(path);
    }
}

// Create global router instance
const router = new Router();

/**
 * Register all application routes
 */
function registerRoutes() {
    // Public routes
    router.register('/login', {
        component: renderLoginPage,
        requireAuth: false
    });

    router.register('/register', {
        component: renderRegisterPage,
        requireAuth: false
    });

    router.register('/', {
        component: renderHomePage,
        requireAuth: false
    });

    router.register('/home', {
        component: renderHomePage,
        requireAuth: false
    });

    // Protected routes - Landlord
    router.register('/landlord-dashboard', {
        component: renderLandlordDashboard,
        requireAuth: true,
        requireRole: 'landlord'
    });

    router.register('/properties', {
        component: renderPropertiesPage,
        requireAuth: true,
        requireRole: 'landlord'
    });

    router.register('/tenants', {
        component: renderTenantsPage,
        requireAuth: true,
        requireRole: 'landlord'
    });

    router.register('/leases', {
        component: renderLeasesPage,
        requireAuth: true,
        requireRole: 'landlord'
    });

    router.register('/payments', {
        component: renderPaymentsPage,
        requireAuth: true,
        requireRole: 'landlord'
    });

    router.register('/maintenance', {
        component: renderMaintenancePage,
        requireAuth: true,
        requireRole: 'landlord'
    });

    // Protected routes - Tenant
    router.register('/tenant-dashboard', {
        component: renderTenantDashboard,
        requireAuth: true,
        requireRole: 'tenant'
    });

    router.register('/browse-properties', {
        component: renderBrowsePropertiesPage,
        requireAuth: true,
        requireRole: 'tenant'
    });

    router.register('/my-lease', {
        component: renderMyLeasePage,
        requireAuth: true,
        requireRole: 'tenant'
    });

    router.register('/my-payments', {
        component: renderMyPaymentsPage,
        requireAuth: true,
        requireRole: 'tenant'
    });

    router.register('/my-maintenance', {
        component: renderMyMaintenancePage,
        requireAuth: true,
        requireRole: 'tenant'
    });

    // Error routes
    router.register('/forbidden', {
        component: renderForbiddenPage,
        requireAuth: false
    });

    router.register('/404', {
        component: () => router.render404(),
        requireAuth: false
    });

    // Wildcard route
    router.register('*', {
        component: renderHomePage,
        requireAuth: false
    });
}

/**
 * Redirect based on user role on login
 */
function redirectToDashboard() {
    if (!authService.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const user = authService.getCurrentUser();
    if (user.role === 'landlord') {
        router.navigate('/landlord-dashboard');
    } else if (user.role === 'tenant') {
        router.navigate('/tenant-dashboard');
    } else {
        router.navigate('/home');
    }
}

/**
 * Home Page
 */
function renderHomePage() {
    return `
        <div class="home-page">
            <div class="hero">
                <div class="container">
                    <h1>Welcome to Rentify</h1>
                    <p>Your complete solution for managing rental properties and tenant relationships</p>
                    <div class="hero-buttons">
                        <a href="#login" class="btn btn-primary">Login</a>
                        <a href="#register" class="btn btn-secondary">Create Account</a>
                    </div>
                </div>
            </div>

            <div class="container features">
                <h2>Why Choose Rentify?</h2>
                <div class="grid grid-cols-3">
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Property Management</h3>
                        <p>Easily manage multiple properties and units in one centralized system</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Digital Leases</h3>
                        <p>Create, review, and sign lease agreements electronically</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Payment Tracking</h3>
                        <p>Monitor payments, track balances, and manage financial reports</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Maintenance Requests</h3>
                        <p>Report and track maintenance issues with real-time updates</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Tenant Management</h3>
                        <p>Manage tenant information and applications effortlessly</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Analytics</h3>
                        <p>Get insights with dashboards and financial analytics</p>
                    </div>
                </div>
            </div>

        <!--    <div class="demo-section">
                <footer style="text-align:center; padding:15px; font-size:14px; color:#555;">
                            © 2026 B.K. <br> Empowering ideas through code
                </footer>
            </div>
            -->
        </div>
    `;
}

/**
 * Login Page - Now linked from login.js
 */
function renderLoginPageRouter() {
    return '<div id="login-page"></div>';
}

/**
 * Register Page - Now linked from register.js
 */
function renderRegisterPageRouter() {
    return '<div id="register-page"></div>';
}

function renderLandlordDashboard() {
    if (!authService.isAuthenticated()) return '<div class="container"><p>Loading...</p></div>';
    const stats = UserService.getLandlordDashboard(authService.getCurrentUserId());
    return `
        <div class="container">
            <h1>Landlord Dashboard</h1>
            <div class="grid grid-cols-4 mt-lg">
                <div class="card">
                    <h4>Properties</h4>
                    <p class="text-3xl" style="font-size: 2.25rem; margin: 0;">${stats.properties}</p>
                </div>
                <div class="card">
                    <h4>Occupancy Rate</h4>
                    <p class="text-3xl" style="font-size: 2.25rem; margin: 0;">${stats.occupancyRate}%</p>
                </div>
                <div class="card">
                    <h4>Total Revenue</h4>
                    <p class="text-3xl" style="font-size: 2.25rem; margin: 0;">${formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div class="card">
                    <h4>Open Maintenance</h4>
                    <p class="text-3xl" style="font-size: 2.25rem; margin: 0;">${stats.openMaintenance}</p>
                </div>
            </div>
        </div>
    `;
}

function renderPropertiesPage() {
    if (!authService.isAuthenticated()) return '<div class="container"><p>Loading...</p></div>';
    const landlordId = authService.getCurrentUserId();
    const properties = db.getPropertiesByLandlord(landlordId);
    
    let html = `
        <div class="container">
            <h1>My Properties</h1>
            ${properties.length === 0 ? '<p class="text-center mt-lg">No properties yet</p>' : ''}
            <div class="grid grid-cols-2 gap-lg mt-lg">
    `;
    
    properties.forEach(prop => {
        const units = db.getCollection('units').filter(u => u.propertyId === prop.id);
        const occupiedUnits = units.filter(u => u.occupancyStatus === 'occupied').length;
        html += `
            <div class="card">
                <img src="${prop.imageUrl}" alt="${prop.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
                <h3>${prop.name}</h3>
                <p style="color: var(--text-secondary); font-size: var(--font-size-sm);"><strong>${prop.address}</strong></p>
                <p>${prop.description}</p>
                <div style="margin: 16px 0;">
                    <small><strong>Type:</strong> ${capitalizeFirst(prop.propertyType)} | <strong>Units:</strong> ${units.length}</small><br>
                    <small style="color: var(--success-color);"><strong>Occupied:</strong> ${occupiedUnits}/${units.length}</small>
                </div>
                <div style="margin: 16px 0;">
                    <strong>Amenities:</strong> ${prop.amenities.join(', ')}
                </div>
                <button class="btn btn-sm btn-primary" onclick="router.navigate('/properties/${prop.id}')">View Details</button>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    return html;
}

function renderTenantsPage() {
    const tenants = db.getCollection('users').filter(u => u.role === 'tenant');
    const leases = db.getCollection('leases');
    
    let html = `
        <div class="container">
            <h1>All Tenants</h1>
            ${tenants.length === 0 ? '<p class="text-center mt-lg">No tenants in the system</p>' : ''}
            <div class="table-responsive mt-lg">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--bg-secondary); border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Name</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Email</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Phone</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Active Leases</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    tenants.forEach(tenant => {
        const activeLease = leases.find(l => l.tenantId === tenant.id && l.status === 'active');
        html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${tenant.firstName} ${tenant.lastName}</td>
                <td style="padding: 12px;">${tenant.email}</td>
                <td style="padding: 12px;">${tenant.phone || '-'}</td>
                <td style="padding: 12px;">${activeLease ? 'Yes' : 'No'}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

function renderLeasesPage() {
    if (!authService.isAuthenticated()) return '<div class="container"><p>Loading...</p></div>';
    const leases = db.getCollection('leases');
    const users = db.getCollection('users');
    
    let html = `
        <div class="container">
            <h1>Leases</h1>
            ${leases.length === 0 ? '<p class="text-center mt-lg">No leases in the system</p>' : ''}
            <div class="table-responsive mt-lg">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--bg-secondary); border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Tenant</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Start Date</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">End Date</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Rent Amount</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    leases.forEach(lease => {
        const tenant = users.find(u => u.id === lease.tenantId);
        html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${tenant ? tenant.firstName + ' ' + tenant.lastName : 'Unknown'}</td>
                <td style="padding: 12px;">${formatDate(lease.startDate)}</td>
                <td style="padding: 12px;">${formatDate(lease.endDate)}</td>
                <td style="padding: 12px;">$${lease.rentAmount.toFixed(2)}</td>
                <td style="padding: 12px;"><span class="badge badge-${lease.status === 'active' ? 'success' : 'secondary'}">${capitalizeFirst(lease.status || 'pending')}</span></td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

function renderPaymentsPage() {
    const payments = db.getCollection('payments');
    const users = db.getCollection('users');
    
    let html = `
        <div class="container">
            <h1>Payment History</h1>
            ${payments.length === 0 ? '<p class="text-center mt-lg">No payments recorded</p>' : ''}
            <div class="table-responsive mt-lg">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--bg-secondary); border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Tenant</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Amount</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Date</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Status</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Method</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    payments.forEach(payment => {
        const user = users.find(u => u.id === payment.tenantId);
        html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${user ? user.firstName + ' ' + user.lastName : 'Unknown'}</td>
                <td style="padding: 12px;">$${payment.amount.toFixed(2)}</td>
                <td style="padding: 12px;">${formatDate(payment.paymentDate)}</td>
                <td style="padding: 12px;"><span class="badge badge-${payment.status === 'completed' ? 'success' : 'warning'}">${capitalizeFirst(payment.status || 'pending')}</span></td>
                <td style="padding: 12px;">${capitalizeFirst(payment.paymentMethod || 'unknown')}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

function renderMaintenancePage() {
    const maintenance = db.getCollection('maintenance');
    const users = db.getCollection('users');
    
    let html = `
        <div class="container">
            <h1>Maintenance Requests</h1>
            ${maintenance.length === 0 ? '<p class="text-center mt-lg">No maintenance requests</p>' : ''}
            <div class="table-responsive mt-lg">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--bg-secondary); border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Tenant</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Category</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Description</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Priority</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    maintenance.forEach(req => {
        const user = users.find(u => u.id === req.tenantId);
        html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${user ? user.firstName + ' ' + user.lastName : 'Unknown'}</td>
                <td style="padding: 12px;">${capitalizeFirst(req.category || 'general')}</td>
                <td style="padding: 12px;">${req.description || '-'}</td>
                <td style="padding: 12px;"><span class="badge badge-${req.priority === 'high' ? 'danger' : 'info'}">${capitalizeFirst(req.priority || 'medium')}</span></td>
                <td style="padding: 12px;"><span class="badge badge-${req.status === 'completed' ? 'success' : 'warning'}">${capitalizeFirst(req.status || 'open')}</span></td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

function renderTenantDashboard() {
    if (!authService.isAuthenticated()) return '<div class="container"><p>Loading...</p></div>';
    const stats = UserService.getTenantDashboard(authService.getCurrentUserId());
    return `
        <div class="container">
            <h1>Tenant Dashboard</h1>
            <div class="grid grid-cols-3 mt-lg">
                <div class="card">
                    <h4>Current Lease</h4>
                    <p>${stats.currentLease ? stats.currentLease.id.substring(0, 8) : 'No Active Lease'}</p>
                </div>
                <div class="card">
                    <h4>Next Payment Due</h4>
                    <p>${stats.nextPaymentDue ? formatDate(stats.nextPaymentDue.dueDate) : 'No Due Payments'}</p>
                </div>
                <div class="card">
                    <h4>Maintenance Requests</h4>
                    <p class="text-3xl" style="font-size: 2.25rem; margin: 0;">${stats.openMaintenanceRequests}</p>
                </div>
            </div>
        </div>
    `;
}

function renderBrowsePropertiesPage() {
    const properties = db.getActiveProperties();
    
    let html = `
        <div class="container">
            <h1>Browse Available Properties</h1>
            <p>Find your perfect rental property - ${properties.length} properties available</p>
            ${properties.length === 0 ? '<p class="text-center mt-lg">No properties available at this time</p>' : ''}
            <div class="grid grid-cols-2 gap-lg mt-lg">
    `;
    
    properties.forEach(prop => {
        const units = db.getCollection('units').filter(u => u.propertyId === prop.id && u.occupancyStatus === 'available');
        if (units.length > 0) {
            html += `
                <div class="card">
                    <img src="${prop.imageUrl}" alt="${prop.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
                    <h3>${prop.name}</h3>
                    <p style="color: var(--text-secondary); font-size: var(--font-size-sm);"><strong>${prop.address}</strong></p>
                    <p>${prop.description}</p>
                    <div style="margin: 16px 0;">
                        <small><strong>Available Units:</strong> ${units.length}</small><br>
                        <small><strong>Price Range:</strong> $${Math.min(...units.map(u => u.rentAmount))} - $${Math.max(...units.map(u => u.rentAmount))}/month</small>
                    </div>
                    <div style="margin: 16px 0;">
                        <strong>Amenities:</strong> ${prop.amenities.join(', ')}
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="router.navigate('/properties/${prop.id}')">View Available Units</button>
                </div>
            `;
        }
    });
    
    html += `
            </div>
        </div>
    `;
    return html;
}

function renderMyLeasePage() {
    if (!authService.isAuthenticated()) return '<div class="container"><p>Loading...</p></div>';
    const tenantId = authService.getCurrentUserId();
    const leases = db.getCollection('leases').filter(l => l.tenantId === tenantId);
    const activeLease = leases.find(l => l.status === 'active');
    
    if (!activeLease) {
        return `<div class="container"><h1>My Lease</h1><p class="text-center mt-lg">No active lease</p></div>`;
    }
    
    const unit = db.getUnitById(activeLease.unitId);
    const property = unit ? db.getPropertyById(unit.propertyId) : null;
    
    return `
        <div class="container">
            <h1>My Lease</h1>
            <div class="card mt-lg" style="max-width: 600px;">
                <h3>Lease Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <div><strong>Property:</strong><br>${property ? property.name : 'Unknown'}</div>
                    <div><strong>Unit:</strong><br>${unit ? unit.unitNumber : 'Unknown'}</div>
                    <div><strong>Start Date:</strong><br>${formatDate(activeLease.startDate)}</div>
                    <div><strong>End Date:</strong><br>${formatDate(activeLease.endDate)}</div>
                    <div><strong>Monthly Rent:</strong><br>$${activeLease.rentAmount.toFixed(2)}</div>
                    <div><strong>Security Deposit:</strong><br>$${activeLease.depositAmount.toFixed(2)}</div>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                    <strong>Terms:</strong>
                    <p>${activeLease.terms || 'No terms specified'}</p>
                </div>
            </div>
        </div>
    `;
}

function renderMyPaymentsPage() {
    if (!authService.isAuthenticated()) return '<div class="container"><p>Loading...</p></div>';
    const tenantId = authService.getCurrentUserId();
    const payments = db.getCollection('payments').filter(p => p.tenantId === tenantId);
    
    let html = `
        <div class="container">
            <h1>My Payments</h1>
            ${payments.length === 0 ? '<p class="text-center mt-lg">No payments recorded</p>' : ''}
            <div class="table-responsive mt-lg">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--bg-secondary); border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Date</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Amount</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Status</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Method</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    payments.forEach(payment => {
        html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${formatDate(payment.paymentDate)}</td>
                <td style="padding: 12px;">$${payment.amount.toFixed(2)}</td>
                <td style="padding: 12px;"><span class="badge badge-${payment.status === 'completed' ? 'success' : 'warning'}">${capitalizeFirst(payment.status || 'pending')}</span></td>
                <td style="padding: 12px;">${capitalizeFirst(payment.paymentMethod || 'unknown')}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

function renderMyMaintenancePage() {
    if (!authService.isAuthenticated()) return '<div class="container"><p>Loading...</p></div>';
    const tenantId = authService.getCurrentUserId();
    const maintenance = db.getCollection('maintenance').filter(m => m.tenantId === tenantId);
    
    let html = `
        <div class="container">
            <h1>My Maintenance Requests</h1>
            ${maintenance.length === 0 ? '<p class="text-center mt-lg">No maintenance requests</p>' : ''}
            <div class="table-responsive mt-lg">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--bg-secondary); border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Date</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Category</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Description</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Priority</th>
                            <th style="padding: 12px; text-align: left; font-weight: bold;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    maintenance.forEach(req => {
        html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${formatDate(req.createdDate)}</td>
                <td style="padding: 12px;">${capitalizeFirst(req.category || 'general')}</td>
                <td style="padding: 12px;">${req.description || '-'}</td>
                <td style="padding: 12px;"><span class="badge badge-${req.priority === 'high' ? 'danger' : 'info'}">${capitalizeFirst(req.priority || 'medium')}</span></td>
                <td style="padding: 12px;"><span class="badge badge-${req.status === 'completed' ? 'success' : 'warning'}">${capitalizeFirst(req.status || 'open')}</span></td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

function renderForbiddenPage() {
    return `
        <div class="container">
            <div class="empty-state">
                <div class="empty-state-icon">🚫</div>
                <h2>Access Forbidden</h2>
                <p>You do not have permission to access this page.</p>
                <a href="#home" class="btn btn-primary">Go Home</a>
            </div>
        </div>
    `;
}
