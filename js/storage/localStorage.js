// LocalStorage Wrapper

const StorageKeys = {
    USERS: 'rms_users',
    PROPERTIES: 'rms_properties',
    UNITS: 'rms_units',
    LEASES: 'rms_leases',
    PAYMENTS: 'rms_payments',
    MAINTENANCE: 'rms_maintenance',
    APPLICATIONS: 'rms_applications',
    CURRENT_USER: 'rms_current_user',
    SESSION_TOKEN: 'rms_session_token',
    NOTIFICATIONS: 'rms_notifications'
};

class LocalStorageService {
    /**
     * Save data to localStorage
     */
    static set(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('LocalStorage set error:', error);
            return false;
        }
    }

    /**
     * Get data from localStorage
     */
    static get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('LocalStorage get error:', error);
            return defaultValue;
        }
    }

    /**
     * Remove item from localStorage
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('LocalStorage remove error:', error);
            return false;
        }
    }

    /**
     * Clear all localStorage
     */
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('LocalStorage clear error:', error);
            return false;
        }
    }

    /**
     * Check if key exists
     */
    static has(key) {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Get all storage keys
     */
    static getAllKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        return keys;
    }

    /**
     * Get storage size in bytes
     */
    static getSize() {
        let size = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            size += key.length + value.length;
        }
        return size;
    }

    /**
     * Export all data
     */
    static exportAll() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = this.get(key);
        }
        return data;
    }

    /**
     * Import data
     */
    static importData(data) {
        try {
            Object.entries(data).forEach(([key, value]) => {
                this.set(key, value);
            });
            return true;
        } catch (error) {
            console.error('LocalStorage import error:', error);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LocalStorageService, StorageKeys };
}
