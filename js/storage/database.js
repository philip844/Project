// In-Memory Database Management System

class Database {
    constructor() {
        this.collections = {
            users: [],
            properties: [],
            units: [],
            leases: [],
            payments: [],
            maintenance: [],
            applications: []
        };
        this.loadFromStorage();
    }

    /**
     * Load data from localStorage
     */
    loadFromStorage() {
        this.collections.users = LocalStorageService.get(StorageKeys.USERS, []);
        this.collections.properties = LocalStorageService.get(StorageKeys.PROPERTIES, []);
        this.collections.units = LocalStorageService.get(StorageKeys.UNITS, []);
        this.collections.leases = LocalStorageService.get(StorageKeys.LEASES, []);
        this.collections.payments = LocalStorageService.get(StorageKeys.PAYMENTS, []);
        this.collections.maintenance = LocalStorageService.get(StorageKeys.MAINTENANCE, []);
        this.collections.applications = LocalStorageService.get(StorageKeys.APPLICATIONS, []);
    }

    /**
     * Save all collections to localStorage
     */
    saveToStorage() {
        LocalStorageService.set(StorageKeys.USERS, this.collections.users);
        LocalStorageService.set(StorageKeys.PROPERTIES, this.collections.properties);
        LocalStorageService.set(StorageKeys.UNITS, this.collections.units);
        LocalStorageService.set(StorageKeys.LEASES, this.collections.leases);
        LocalStorageService.set(StorageKeys.PAYMENTS, this.collections.payments);
        LocalStorageService.set(StorageKeys.MAINTENANCE, this.collections.maintenance);
        LocalStorageService.set(StorageKeys.APPLICATIONS, this.collections.applications);
    }

    /**
     * Get collection by name
     */
    getCollection(collectionName) {
        return this.collections[collectionName] || [];
    }

    // ==================== USERS ====================

    /**
     * Create a new user
     */
    createUser(userData) {
        const user = {
            id: generateId(),
            ...userData,
            createdDate: new Date().toISOString()
        };
        this.collections.users.push(user);
        this.saveToStorage();
        return user;
    }

    /**
     * Get user by ID
     */
    getUserById(id) {
        return this.collections.users.find(user => user.id === id);
    }

    /**
     * Get user by email
     */
    getUserByEmail(email) {
        return this.collections.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    /**
     * Update user
     */
    updateUser(id, userData) {
        const index = this.collections.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.collections.users[index] = { ...this.collections.users[index], ...userData };
            this.saveToStorage();
            return this.collections.users[index];
        }
        return null;
    }

    /**
     * Delete user
     */
    deleteUser(id) {
        const index = this.collections.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.collections.users.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Get all users by role
     */
    getUsersByRole(role) {
        return this.collections.users.filter(user => user.role === role);
    }

    // ==================== PROPERTIES ====================

    /**
     * Create a new property
     */
    createProperty(propertyData) {
        const property = {
            id: generateId(),
            ...propertyData,
            createdDate: new Date().toISOString()
        };
        this.collections.properties.push(property);
        this.saveToStorage();
        return property;
    }

    /**
     * Get property by ID
     */
    getPropertyById(id) {
        return this.collections.properties.find(prop => prop.id === id);
    }

    /**
     * Get properties by landlord ID
     */
    getPropertiesByLandlord(landlordId) {
        return this.collections.properties.filter(prop => prop.landlordId === landlordId);
    }

    /**
     * Update property
     */
    updateProperty(id, propertyData) {
        const index = this.collections.properties.findIndex(prop => prop.id === id);
        if (index !== -1) {
            this.collections.properties[index] = { ...this.collections.properties[index], ...propertyData };
            this.saveToStorage();
            return this.collections.properties[index];
        }
        return null;
    }

    /**
     * Delete property
     */
    deleteProperty(id) {
        const index = this.collections.properties.findIndex(prop => prop.id === id);
        if (index !== -1) {
            this.collections.properties.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Get all active properties
     */
    getActiveProperties() {
        return this.collections.properties.filter(prop => prop.isActive);
    }

    // ==================== UNITS ====================

    /**
     * Create a new unit
     */
    createUnit(unitData) {
        const unit = {
            id: generateId(),
            ...unitData,
            createdDate: new Date().toISOString()
        };
        this.collections.units.push(unit);
        this.saveToStorage();
        return unit;
    }

    /**
     * Get unit by ID
     */
    getUnitById(id) {
        return this.collections.units.find(unit => unit.id === id);
    }

    /**
     * Get units by property ID
     */
    getUnitsByProperty(propertyId) {
        return this.collections.units.filter(unit => unit.propertyId === propertyId);
    }

    /**
     * Update unit
     */
    updateUnit(id, unitData) {
        const index = this.collections.units.findIndex(unit => unit.id === id);
        if (index !== -1) {
            this.collections.units[index] = { ...this.collections.units[index], ...unitData };
            this.saveToStorage();
            return this.collections.units[index];
        }
        return null;
    }

    /**
     * Delete unit
     */
    deleteUnit(id) {
        const index = this.collections.units.findIndex(unit => unit.id === id);
        if (index !== -1) {
            this.collections.units.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Get available units
     */
    getAvailableUnits() {
        return this.collections.units.filter(unit => unit.occupancyStatus === 'available');
    }

    /**
     * Get occupied units
     */
    getOccupiedUnits() {
        return this.collections.units.filter(unit => unit.occupancyStatus === 'occupied');
    }

    // ==================== LEASES ====================

    /**
     * Create a new lease
     */
    createLease(leaseData) {
        const lease = {
            id: generateId(),
            ...leaseData,
            createdDate: new Date().toISOString()
        };
        this.collections.leases.push(lease);
        this.saveToStorage();
        return lease;
    }

    /**
     * Get lease by ID
     */
    getLeaseById(id) {
        return this.collections.leases.find(lease => lease.id === id);
    }

    /**
     * Get leases by tenant ID
     */
    getLeasesByTenant(tenantId) {
        return this.collections.leases.filter(lease => lease.tenantId === tenantId);
    }

    /**
     * Get leases by landlord ID
     */
    getLeasesByLandlord(landlordId) {
        return this.collections.leases.filter(lease => lease.landlordId === landlordId);
    }

    /**
     * Get leases by unit ID
     */
    getLeasesByUnit(unitId) {
        return this.collections.leases.filter(lease => lease.unitId === unitId);
    }

    /**
     * Update lease
     */
    updateLease(id, leaseData) {
        const index = this.collections.leases.findIndex(lease => lease.id === id);
        if (index !== -1) {
            this.collections.leases[index] = { ...this.collections.leases[index], ...leaseData };
            this.saveToStorage();
            return this.collections.leases[index];
        }
        return null;
    }

    /**
     * Delete lease
     */
    deleteLease(id) {
        const index = this.collections.leases.findIndex(lease => lease.id === id);
        if (index !== -1) {
            this.collections.leases.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Get active leases
     */
    getActiveLeases() {
        const today = new Date();
        return this.collections.leases.filter(lease => {
            const start = new Date(lease.startDate);
            const end = new Date(lease.endDate);
            return start <= today && today <= end;
        });
    }

    // ==================== PAYMENTS ====================

    /**
     * Create a new payment
     */
    createPayment(paymentData) {
        const payment = {
            id: generateId(),
            ...paymentData,
            createdDate: new Date().toISOString()
        };
        this.collections.payments.push(payment);
        this.saveToStorage();
        return payment;
    }

    /**
     * Get payment by ID
     */
    getPaymentById(id) {
        return this.collections.payments.find(payment => payment.id === id);
    }

    /**
     * Get payments by lease ID
     */
    getPaymentsByLease(leaseId) {
        return this.collections.payments.filter(payment => payment.leaseId === leaseId);
    }

    /**
     * Get payments by tenant ID
     */
    getPaymentsByTenant(tenantId) {
        return this.collections.payments.filter(payment => payment.tenantId === tenantId);
    }

    /**
     * Get payments by landlord ID
     */
    getPaymentsByLandlord(landlordId) {
        return this.collections.payments.filter(payment => payment.landlordId === landlordId);
    }

    /**
     * Update payment
     */
    updatePayment(id, paymentData) {
        const index = this.collections.payments.findIndex(payment => payment.id === id);
        if (index !== -1) {
            this.collections.payments[index] = { ...this.collections.payments[index], ...paymentData };
            this.saveToStorage();
            return this.collections.payments[index];
        }
        return null;
    }

    /**
     * Delete payment
     */
    deletePayment(id) {
        const index = this.collections.payments.findIndex(payment => payment.id === id);
        if (index !== -1) {
            this.collections.payments.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Get pending payments
     */
    getPendingPayments() {
        return this.collections.payments.filter(payment => payment.status === 'pending');
    }

    /**
     * Get overdue payments
     */
    getOverduePayments() {
        const today = new Date();
        return this.collections.payments.filter(payment => 
            payment.status !== 'paid' && new Date(payment.dueDate) < today
        );
    }

    // ==================== MAINTENANCE ====================

    /**
     * Create a new maintenance request
     */
    createMaintenance(maintenanceData) {
        const maintenance = {
            id: generateId(),
            ...maintenanceData,
            createdDate: new Date().toISOString()
        };
        this.collections.maintenance.push(maintenance);
        this.saveToStorage();
        return maintenance;
    }

    /**
     * Get maintenance by ID
     */
    getMaintenanceById(id) {
        return this.collections.maintenance.find(m => m.id === id);
    }

    /**
     * Get maintenance by unit ID
     */
    getMaintenanceByUnit(unitId) {
        return this.collections.maintenance.filter(m => m.unitId === unitId);
    }

    /**
     * Get maintenance by tenant ID
     */
    getMaintenanceByTenant(tenantId) {
        return this.collections.maintenance.filter(m => m.tenantId === tenantId);
    }

    /**
     * Get maintenance by landlord ID
     */
    getMaintenanceByLandlord(landlordId) {
        return this.collections.maintenance.filter(m => m.landlordId === landlordId);
    }

    /**
     * Update maintenance
     */
    updateMaintenance(id, maintenanceData) {
        const index = this.collections.maintenance.findIndex(m => m.id === id);
        if (index !== -1) {
            this.collections.maintenance[index] = { ...this.collections.maintenance[index], ...maintenanceData };
            this.saveToStorage();
            return this.collections.maintenance[index];
        }
        return null;
    }

    /**
     * Delete maintenance
     */
    deleteMaintenance(id) {
        const index = this.collections.maintenance.findIndex(m => m.id === id);
        if (index !== -1) {
            this.collections.maintenance.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Get open maintenance requests
     */
    getOpenMaintenance() {
        return this.collections.maintenance.filter(m => m.status === 'open');
    }

    // ==================== APPLICATIONS ====================

    /**
     * Create a new application
     */
    createApplication(applicationData) {
        const application = {
            id: generateId(),
            ...applicationData,
            createdDate: new Date().toISOString()
        };
        this.collections.applications.push(application);
        this.saveToStorage();
        return application;
    }

    /**
     * Get application by ID
     */
    getApplicationById(id) {
        return this.collections.applications.find(app => app.id === id);
    }

    /**
     * Get applications by unit ID
     */
    getApplicationsByUnit(unitId) {
        return this.collections.applications.filter(app => app.unitId === unitId);
    }

    /**
     * Get applications by tenant ID
     */
    getApplicationsByTenant(tenantId) {
        return this.collections.applications.filter(app => app.tenantId === tenantId);
    }

    /**
     * Update application
     */
    updateApplication(id, applicationData) {
        const index = this.collections.applications.findIndex(app => app.id === id);
        if (index !== -1) {
            this.collections.applications[index] = { ...this.collections.applications[index], ...applicationData };
            this.saveToStorage();
            return this.collections.applications[index];
        }
        return null;
    }

    /**
     * Delete application
     */
    deleteApplication(id) {
        const index = this.collections.applications.findIndex(app => app.id === id);
        if (index !== -1) {
            this.collections.applications.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Get pending applications
     */
    getPendingApplications() {
        return this.collections.applications.filter(app => app.status === 'pending');
    }

    // ==================== GENERAL OPERATIONS ====================

    /**
     * Clear all data
     */
    clearAll() {
        Object.keys(this.collections).forEach(key => {
            this.collections[key] = [];
        });
        this.saveToStorage();
    }

    /**
     * Get database stats
     */
    getStats() {
        return {
            users: this.collections.users.length,
            properties: this.collections.properties.length,
            units: this.collections.units.length,
            leases: this.collections.leases.length,
            payments: this.collections.payments.length,
            maintenance: this.collections.maintenance.length,
            applications: this.collections.applications.length
        };
    }
}

// Create global database instance
const db = new Database();
