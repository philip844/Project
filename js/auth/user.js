// User Management Utilities

class UserService {
    /**
     * Get user profile
     */
    static getUserProfile(userId) {
        const user = db.getUserById(userId);
        if (!user) return null;
        
        // Remove sensitive data
        const profile = { ...user };
        delete profile.password;
        return profile;
    }

    /**
     * Update user profile
     */
    static updateUserProfile(userId, updateData) {
        const allowedFields = ['firstName', 'lastName', 'phone'];
        const filteredData = {};
        
        allowedFields.forEach(field => {
            if (updateData.hasOwnProperty(field)) {
                filteredData[field] = updateData[field];
            }
        });

        const updated = db.updateUser(userId, filteredData);
        
        // If updating current user, update auth service
        if (authService.getCurrentUserId() === userId) {
            authService.updateCurrentUser(filteredData);
        }

        const profile = { ...updated };
        delete profile.password;
        return profile;
    }

    /**
     * Get landlord dashboard data
     */
    static getLandlordDashboard(landlordId) {
        const properties = db.getPropertiesByLandlord(landlordId);
        const leases = db.getLeasesByLandlord(landlordId);
        const payments = db.getPaymentsByLandlord(landlordId);
        const maintenance = db.getMaintenanceByLandlord(landlordId);

        // Calculate statistics
        const totalUnits = properties.reduce((sum, prop) => {
            const units = db.getUnitsByProperty(prop.id);
            return sum + units.length;
        }, 0);

        const occupiedUnits = properties.reduce((sum, prop) => {
            const units = db.getUnitsByProperty(prop.id);
            return sum + units.filter(u => u.occupancyStatus === 'occupied').length;
        }, 0);

        const totalRevenue = payments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingPayments = payments
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0);

        const activeLeases = leases.filter(l => {
            const start = new Date(l.startDate);
            const end = new Date(l.endDate);
            const now = new Date();
            return start <= now && now <= end;
        }).length;

        const openMaintenance = maintenance.filter(m => m.status === 'open').length;

        return {
            properties: properties.length,
            totalUnits,
            occupiedUnits,
            occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits * 100).toFixed(1) : 0,
            activeLeases,
            totalRevenue,
            pendingPayments,
            overduPayments: payments
                .filter(p => p.status === 'overdue')
                .reduce((sum, p) => sum + p.amount, 0),
            openMaintenance,
            recentPayments: payments.slice(-5),
            recentMaintenance: maintenance.slice(-5)
        };
    }

    /**
     * Get tenant dashboard data
     */
    static getTenantDashboard(tenantId) {
        const leases = db.getLeasesByTenant(tenantId);
        const payments = db.getPaymentsByTenant(tenantId);
        const maintenance = db.getMaintenanceByTenant(tenantId);

        // Get current lease
        const today = new Date();
        const currentLease = leases.find(l => {
            const start = new Date(l.startDate);
            const end = new Date(l.endDate);
            return start <= today && today <= end;
        });

        // Get next payment due
        const nextPayment = payments
            .filter(p => p.status !== 'paid')
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

        // Get open maintenance requests
        const openRequests = maintenance.filter(m => m.status !== 'resolved');

        // Calculate rent paid this year
        const currentYear = today.getFullYear();
        const rentPaidThisYear = payments
            .filter(p => p.status === 'paid' && new Date(p.paidDate).getFullYear() === currentYear)
            .reduce((sum, p) => sum + p.amount, 0);

        return {
            currentLease,
            currentUnit: currentLease ? db.getUnitById(currentLease.unitId) : null,
            nextPaymentDue: nextPayment,
            nextPaymentDays: nextPayment ? Math.ceil((new Date(nextPayment.dueDate) - today) / (1000 * 60 * 60 * 24)) : null,
            rentPaidThisYear,
            totalRentPaid: payments
                .filter(p => p.status === 'paid')
                .reduce((sum, p) => sum + p.amount, 0),
            openMaintenanceRequests: openRequests.length,
            allMaintenance: maintenance,
            recentPayments: payments.slice(-5),
            totalPayments: payments.length
        };
    }

    /**
     * Get tenant applications
     */
    static getTenantApplications(tenantId) {
        return db.getApplicationsByTenant(tenantId);
    }

    /**
     * Get landlord tenants
     */
    static getLandlordTenants(landlordId) {
        const leases = db.getLeasesByLandlord(landlordId);
        const tenantIds = [...new Set(leases.map(l => l.tenantId))];
        return tenantIds.map(id => db.getUserById(id)).filter(Boolean);
    }

    /**
     * Get property tenants
     */
    static getPropertyTenants(propertyId) {
        const units = db.getUnitsByProperty(propertyId);
        const leases = units.flatMap(u => db.getLeasesByUnit(u.id));
        const tenantIds = [...new Set(leases.map(l => l.tenantId))];
        return tenantIds.map(id => db.getUserById(id)).filter(Boolean);
    }

    /**
     * Get user statistics
     */
    static getUserStats(userId) {
        const user = db.getUserById(userId);
        if (!user) return null;

        if (user.role === 'landlord') {
            return this.getLandlordDashboard(userId);
        } else if (user.role === 'tenant') {
            return this.getTenantDashboard(userId);
        }
    }

    /**
     * Get all users (admin function)
     */
    static getAllUsers() {
        return db.getCollection('users').map(user => {
            const profile = { ...user };
            delete profile.password;
            return profile;
        });
    }

    /**
     * Get all landlords
     */
    static getAllLandlords() {
        return db.getUsersByRole('landlord').map(user => {
            const profile = { ...user };
            delete profile.password;
            return profile;
        });
    }

    /**
     * Get all tenants
     */
    static getAllTenants() {
        return db.getUsersByRole('tenant').map(user => {
            const profile = { ...user };
            delete profile.password;
            return profile;
        });
    }

    /**
     * Deactivate user account
     */
    static deactivateUser(userId) {
        return db.updateUser(userId, { isActive: false });
    }

    /**
     * Reactivate user account
     */
    static reactivateUser(userId) {
        return db.updateUser(userId, { isActive: true });
    }
}

// Export UserService
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserService;
}
