// Data Formatters

/**
 * Format phone number
 */
function formatPhoneNumber(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

/**
 * Format credit card number
 */
function formatCreditCard(cardNumber) {
    if (!cardNumber) return '';
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Format zip code
 */
function formatZipCode(zipCode) {
    if (!zipCode) return '';
    const cleaned = zipCode.replace(/\D/g, '');
    
    if (cleaned.length === 5) {
        return cleaned;
    } else if (cleaned.length === 9) {
        return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return zipCode;
}

/**
 * Format percentage
 */
function formatPercentage(value, decimals = 2) {
    const num = parseFloat(value);
    if (isNaN(num)) return '0%';
    return `${num.toFixed(decimals)}%`;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format time duration
 */
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

/**
 * Format time to 12-hour format
 */
function formatTime(date, format = '12') {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    if (format === '24') {
        return `${hours}:${minutes}`;
    }
    
    const hour12 = d.getHours() % 12 || 12;
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    return `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
}

/**
 * Format full datetime
 */
function formatDateTime(date) {
    const d = new Date(date);
    return `${formatDate(d)} at ${formatTime(d)}`;
}

/**
 * Format name (capitalize each word)
 */
function formatName(name) {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}

/**
 * Format address
 */
function formatAddress(address) {
    if (typeof address === 'object') {
        const parts = [
            address.street,
            address.city,
            address.state,
            address.zipCode
        ].filter(Boolean);
        return parts.join(', ');
    }
    return address;
}

/**
 * Format status as badge HTML
 */
function formatStatusBadge(status) {
    const statusMap = {
        'active': { class: 'badge-success', text: 'Active' },
        'inactive': { class: 'badge-warning', text: 'Inactive' },
        'pending': { class: 'badge-pending', text: 'Pending' },
        'approved': { class: 'badge-success', text: 'Approved' },
        'rejected': { class: 'badge-danger', text: 'Rejected' },
        'completed': { class: 'badge-success', text: 'Completed' },
        'in_progress': { class: 'badge-info', text: 'In Progress' },
        'open': { class: 'badge-info', text: 'Open' },
        'resolved': { class: 'badge-success', text: 'Resolved' },
        'overdue': { class: 'badge-danger', text: 'Overdue' },
        'paid': { class: 'badge-success', text: 'Paid' },
        'unpaid': { class: 'badge-warning', text: 'Unpaid' },
        'available': { class: 'badge-success', text: 'Available' },
        'occupied': { class: 'badge-warning', text: 'Occupied' },
        'maintenance': { class: 'badge-danger', text: 'Maintenance' },
    };

    const config = statusMap[status] || { class: 'badge-info', text: capitalize(status) };
    return `<span class="badge ${config.class}">${config.text}</span>`;
}

/**
 * Format priority as badge
 */
function formatPriorityBadge(priority) {
    const priorityMap = {
        'low': { class: 'badge-info', text: 'Low' },
        'medium': { class: 'badge-warning', text: 'Medium' },
        'high': { class: 'badge-danger', text: 'High' },
        'critical': { class: 'badge-danger', text: 'Critical' },
    };

    const config = priorityMap[priority] || { class: 'badge-info', text: capitalize(priority) };
    return `<span class="badge ${config.class}">${config.text}</span>`;
}

/**
 * Format template string with variables
 */
function formatTemplate(template, variables) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return variables[key] || match;
    });
}

/**
 * Format rent payment status text
 */
function formatPaymentStatus(status) {
    const statusMap = {
        'pending': 'Due',
        'paid': 'Paid',
        'overdue': 'Overdue',
        'partially_paid': 'Partially Paid'
    };
    return statusMap[status] || capitalize(status);
}

/**
 * Format occupancy status
 */
function formatOccupancyStatus(status) {
    const statusMap = {
        'available': 'Available for Rent',
        'occupied': 'Occupied',
        'maintenance': 'Under Maintenance'
    };
    return statusMap[status] || capitalize(status);
}

/**
 * Format lease status
 */
function formatLeaseStatus(signedByTenant, signedByLandlord) {
    if (signedByTenant && signedByLandlord) return 'Signed';
    if (signedByTenant && !signedByLandlord) return 'Pending Landlord';
    if (!signedByTenant && signedByLandlord) return 'Pending Tenant';
    return 'Unsigned';
}

/**
 * Format property type
 */
function formatPropertyType(type) {
    const typeMap = {
        'apartment': 'Apartment',
        'house': 'House',
        'condo': 'Condo',
        'townhouse': 'Town House',
        'studio': 'Studio'
    };
    return typeMap[type] || capitalize(type);
}

/**
 * Format maintenance category
 */
function formatMaintenanceCategory(category) {
    const categoryMap = {
        'plumbing': 'Plumbing',
        'electrical': 'Electrical',
        'hvac': 'HVAC',
        'general': 'General',
        'appliances': 'Appliances',
        'flooring': 'Flooring'
    };
    return categoryMap[category] || capitalize(category);
}

/**
 * Format table data for display
 */
function formatTableData(data, columns) {
    return {
        headers: columns.map(col => col.label),
        rows: data.map(item => 
            columns.map(col => {
                const value = getNestedProperty(item, col.key);
                return col.format ? col.format(value, item) : value;
            })
        )
    };
}
