// Sample Data - Seed Database

/**
 * Populate database with sample data for testing
 * This will only run if database is empty
 */
async function seedDatabase() {
    // Check if data already exists
    if (db.getCollection('users').length > 0) {
        console.log('Database already seeded');
        return;
    }

    console.log('Seeding database with sample data...');

    try {
        // Create sample users
        await createSampleUsers();
        
        // Create sample properties and units
        createSampleProperties();
        
        // Create sample leases
        createSampleLeases();
        
        // Create sample payments
        createSamplePayments();
        
        // Create sample maintenance requests
        createSampleMaintenance();
        
        // Create sample applications
        createSampleApplications();

        console.log('Database seeded successfully');
        console.log('Sample login credentials:');
        console.log('Landlord: john@example.com / Password123');
        console.log('Tenant: jane@example.com / Password123');
        console.log('Database stats:', db.getStats());
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

/**
 * Create sample users
 */
async function createSampleUsers() {
    const landlord = await authService.register({
        email: 'john@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Smith',
        phone: '555-0101',
        role: 'landlord'
    });

    const tenant = await authService.register({
        email: 'jane@example.com',
        password: 'Password123',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '555-0102',
        role: 'tenant'
    });

    const tenant2 = await authService.register({
        email: 'bob@example.com',
        password: 'Password123',
        firstName: 'Bob',
        lastName: 'Johnson',
        phone: '555-0103',
        role: 'tenant'
    });

    console.log('Created sample users');
    return { landlord, tenant, tenant2 };
}

/**
 * Create sample properties and units
 */
function createSampleProperties() {
    // Get landlord
    const landlord = db.getUserByEmail('john@example.com');
    if (!landlord) return;

    // Create property 1
    const property1 = db.createProperty({
        landlordId: landlord.id,
        name: 'Sunset Apartments',
        address: '123 Main St, Springfield',
        description: 'Modern 3-unit apartment complex with excellent amenities',
        propertyType: 'apartment',
        unitCount: 3,
        amenities: ['Parking', 'Gym', 'Pool', 'Laundry Room', 'Security'],
        imageUrl: './images/sunset-apartments.png',
        isActive: true
    });

    // Create units for property 1
    const unit1 = db.createUnit({
        propertyId: property1.id,
        unitNumber: '101',
        rentAmount: 1500,
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 950,
        occupancyStatus: 'occupied',
        currentTenantId: db.getUserByEmail('jane@example.com').id
    });

    const unit2 = db.createUnit({
        propertyId: property1.id,
        unitNumber: '102',
        rentAmount: 1600,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1050,
        occupancyStatus: 'available'
    });

    const unit3 = db.createUnit({
        propertyId: property1.id,
        unitNumber: '103',
        rentAmount: 1800,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1250,
        occupancyStatus: 'available'
    });

    // Create property 2
    const property2 = db.createProperty({
        landlordId: landlord.id,
        name: 'Riverside Houses',
        address: '456 Oak Ave, Springfield',
        description: 'Beautiful detached houses near river with spacious yards',
        propertyType: 'house',
        unitCount: 2,
        amenities: ['Spacious Yard', 'Garage', 'Patio', 'Garden Space'],
        imageUrl: './images/riverside-houses.png',
        isActive: true
    });

    // Create units for property 2
    const unit4 = db.createUnit({
        propertyId: property2.id,
        unitNumber: 'A',
        rentAmount: 2500,
        bedrooms: 4,
        bathrooms: 2,
        squareFeet: 2000,
        occupancyStatus: 'occupied',
        currentTenantId: db.getUserByEmail('bob@example.com').id
    });

    const unit5 = db.createUnit({
        propertyId: property2.id,
        unitNumber: 'B',
        rentAmount: 2300,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800,
        occupancyStatus: 'available'
    });

    // Create property 3 - Downtown Condos
    const property3 = db.createProperty({
        landlordId: landlord.id,
        name: 'Downtown Condos',
        address: '789 Central Plaza, Springfield',
        description: 'Luxury condominiums in the heart of downtown with urban lifestyle',
        propertyType: 'condo',
        unitCount: 4,
        amenities: ['Rooftop Terrace', 'Concierge', 'Fitness Center', 'Parking Garage', 'Central Location'],
        imageUrl: 'https://via.placeholder.com/400x300?text=Downtown+Condos',
        isActive: true
    });

    // Create units for property 3
    db.createUnit({
        propertyId: property3.id,
        unitNumber: '2001',
        rentAmount: 2200,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        occupancyStatus: 'occupied'
    });

    db.createUnit({
        propertyId: property3.id,
        unitNumber: '2002',
        rentAmount: 1900,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 850,
        occupancyStatus: 'available'
    });

    db.createUnit({
        propertyId: property3.id,
        unitNumber: '2003',
        rentAmount: 3000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1500,
        occupancyStatus: 'available'
    });

    db.createUnit({
        propertyId: property3.id,
        unitNumber: '2004',
        rentAmount: 1850,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 800,
        occupancyStatus: 'available'
    });

    // Create property 4 - Garden Villas
    const property4 = db.createProperty({
        landlordId: landlord.id,
        name: 'Garden Villas',
        address: '321 Elm Street, Springfield',
        description: 'Charming townhouses with private gardens and modern amenities',
        propertyType: 'townhouse',
        unitCount: 3,
        amenities: ['Private Garden', 'Garage', 'Washer/Dryer', 'Patio'],
        imageUrl: 'https://via.placeholder.com/400x300?text=Garden+Villas',
        isActive: true
    });

    // Create units for property 4
    db.createUnit({
        propertyId: property4.id,
        unitNumber: '1',
        rentAmount: 1950,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1100,
        occupancyStatus: 'available'
    });

    db.createUnit({
        propertyId: property4.id,
        unitNumber: '2',
        rentAmount: 2100,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1300,
        occupancyStatus: 'available'
    });

    db.createUnit({
        propertyId: property4.id,
        unitNumber: '3',
        rentAmount: 1800,
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 950,
        occupancyStatus: 'occupied'
    });

    // Create property 5 - Lakeside Retreat
    const property5 = db.createProperty({
        landlordId: landlord.id,
        name: 'Lakeside Retreat',
        address: '555 Lake View Drive, Springfield',
        description: 'Premium waterfront properties with stunning lake views',
        propertyType: 'house',
        unitCount: 2,
        amenities: ['Lake View', 'Private Dock', 'Beach Access', 'Hot Tub', 'Fireplace'],
        imageUrl: 'https://via.placeholder.com/400x300?text=Lakeside+Retreat',
        isActive: true
    });

    // Create units for property 5
    db.createUnit({
        propertyId: property5.id,
        unitNumber: '1',
        rentAmount: 3500,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2500,
        occupancyStatus: 'available'
    });

    db.createUnit({
        propertyId: property5.id,
        unitNumber: '2',
        rentAmount: 3000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2000,
        occupancyStatus: 'occupied'
    });

    // Create property 6 - Hillside Studios
    const property6 = db.createProperty({
        landlordId: landlord.id,
        name: 'Hillside Studios',
        address: '999 Tech Park Road, Springfield',
        description: 'Modern studio apartments perfect for professionals and students',
        propertyType: 'apartment',
        unitCount: 5,
        amenities: ['WiFi Ready', 'Kitchenette', 'Lounge Area', 'Parking'],
        imageUrl: 'https://via.placeholder.com/400x300?text=Hillside+Studios',
        isActive: true
    });

    // Create units for property 6
    db.createUnit({
        propertyId: property6.id,
        unitNumber: '101',
        rentAmount: 900,
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 450,
        occupancyStatus: 'available'
    });

    db.createUnit({
        propertyId: property6.id,
        unitNumber: '102',
        rentAmount: 920,
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 475,
        occupancyStatus: 'available'
    });

    db.createUnit({
        propertyId: property6.id,
        unitNumber: '103',
        rentAmount: 900,
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 450,
        occupancyStatus: 'occupied'
    });

    db.createUnit({
        propertyId: property6.id,
        unitNumber: '104',
        rentAmount: 950,
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 500,
        occupancyStatus: 'available'
    });

    db.createUnit({
        propertyId: property6.id,
        unitNumber: '105',
        rentAmount: 920,
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 475,
        occupancyStatus: 'available'
    });

    console.log('Created sample properties and units');
}

/**
 * Create sample leases
 */
function createSampleLeases() {
    const landlord = db.getUserByEmail('john@example.com');
    const tenant1 = db.getUserByEmail('jane@example.com');
    const tenant2 = db.getUserByEmail('bob@example.com');
    const unit1 = db.getCollection('units')[0];
    const unit4 = db.getCollection('units')[3];

    if (!landlord || !tenant1 || !tenant2 || !unit1 || !unit4) return;

    // Lease 1
    const lease1 = db.createLease({
        tenantId: tenant1.id,
        unitId: unit1.id,
        landlordId: landlord.id,
        startDate: new Date(2024, 0, 1).toISOString(),
        endDate: new Date(2025, 11, 31).toISOString(),
        rentAmount: 1500,
        depositAmount: 3000,
        terms: 'Monthly rent due on the 1st of each month. 30-day notice required for termination.',
        signedByTenant: true,
        signedByLandlord: true
    });

    // Lease 2
    const lease2 = db.createLease({
        tenantId: tenant2.id,
        unitId: unit4.id,
        landlordId: landlord.id,
        startDate: new Date(2024, 3, 15).toISOString(),
        endDate: new Date(2026, 3, 14).toISOString(),
        rentAmount: 2500,
        depositAmount: 5000,
        terms: 'Monthly rent due on the 15th of each month. 60-day notice required for termination.',
        signedByTenant: true,
        signedByLandlord: true
    });

    console.log('Created sample leases');
}

/**
 * Create sample payments
 */
function createSamplePayments() {
    const landlord = db.getUserByEmail('john@example.com');
    const tenant1 = db.getUserByEmail('jane@example.com');
    const tenant2 = db.getUserByEmail('bob@example.com');
    const leases = db.getCollection('leases');

    if (!landlord || !tenant1 || !tenant2 || leases.length === 0) return;

    const lease1 = leases[0];
    const lease2 = leases[1];

    // Create multiple payments
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    for (let i = 0; i < 6; i++) {
        const month = (currentMonth - i + 12) % 12;
        const year = currentYear - Math.floor((currentMonth - i) / 12);
        
        // Payment for lease 1
        db.createPayment({
            leaseId: lease1.id,
            tenantId: tenant1.id,
            landlordId: landlord.id,
            amount: 1500,
            dueDate: new Date(year, month, 1).toISOString(),
            paidDate: i <= 1 ? null : new Date(year, month, 5).toISOString(),
            paymentMethod: 'bank_transfer',
            status: i <= 1 ? (i === 0 ? 'pending' : 'overdue') : 'paid'
        });

        // Payment for lease 2
        db.createPayment({
            leaseId: lease2.id,
            tenantId: tenant2.id,
            landlordId: landlord.id,
            amount: 2500,
            dueDate: new Date(year, month, 15).toISOString(),
            paidDate: i <= 1 ? null : new Date(year, month, 20).toISOString(),
            paymentMethod: 'bank_transfer',
            status: i <= 1 ? 'paid' : 'paid'
        });
    }

    console.log('Created sample payments');
}

/**
 * Create sample maintenance requests
 */
function createSampleMaintenance() {
    const tenant1 = db.getUserByEmail('jane@example.com');
    const tenant2 = db.getUserByEmail('bob@example.com');
    const landlord = db.getUserByEmail('john@example.com');
    const units = db.getCollection('units');

    if (!tenant1 || !tenant2 || !landlord || units.length === 0) return;

    // Maintenance request 1
    db.createMaintenance({
        unitId: units[0].id,
        tenantId: tenant1.id,
        landlordId: landlord.id,
        category: 'plumbing',
        description: 'Leaky faucet in kitchen sink',
        priority: 'medium',
        status: 'resolved',
        resolvedDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        notes: 'Faucet replaced successfully'
    });

    // Maintenance request 2
    db.createMaintenance({
        unitId: units[0].id,
        tenantId: tenant1.id,
        landlordId: landlord.id,
        category: 'general',
        description: 'Light bulb out in hallway',
        priority: 'low',
        status: 'open',
        notes: 'Pending scheduling'
    });

    // Maintenance request 3
    db.createMaintenance({
        unitId: units[3].id,
        tenantId: tenant2.id,
        landlordId: landlord.id,
        category: 'hvac',
        description: 'Air conditioning not cooling properly',
        priority: 'high',
        status: 'in_progress',
        notes: 'HVAC technician scheduled for next week'
    });

    console.log('Created sample maintenance requests');
}

/**
 * Create sample applications
 */
function createSampleApplications() {
    const tenant2 = db.getUserByEmail('bob@example.com');
    const landlord = db.getUserByEmail('john@example.com');
    const units = db.getCollection('units');

    if (!tenant2 || !landlord || units.length < 2) return;

    db.createApplication({
        tenantId: tenant2.id,
        unitId: units[1].id,
        landlordId: landlord.id,
        status: 'pending',
        applicationText: 'I am very interested in renting this unit. I have stable employment and excellent rental history.'
    });

    db.createApplication({
        tenantId: db.getUserByEmail('jane@example.com').id,
        unitId: units[2].id,
        landlordId: landlord.id,
        status: 'approved',
        applicationText: 'Would like to move to a larger unit'
    });

    console.log('Created sample applications');
}

// Database will be seeded by app.js during initialization

/**
 * Manual seed function (can be called from console)
 * Usage: resetAndSeedDatabase()
 */
async function resetAndSeedDatabase() {
    console.log('Clearing database...');
    db.clearAll();
    await seedDatabase();
}

/**
 * Log database stats
 * Usage: logDatabaseStats()
 */
function logDatabaseStats() {
    const stats = db.getStats();
    console.table(stats);
}

/**
 * Export database data
 * Usage: exportDatabase()
 */
function exportDatabase() {
    const data = LocalStorageService.exportAll();
    console.log('Database Export:', JSON.stringify(data, null, 2));
    return data;
}
