# Rental Management System

A web-based Rental Management System designed to simplify and digitize the management of rental properties for both landlords and tenants. This is a fully functional frontend application built with vanilla HTML, CSS, and JavaScript.

## Features

### For Landlords
- **Dashboard**: Overview of properties, earnings, maintenance requests, and occupancy
- **Property Management**: Create, read, update, and delete properties
- **Unit Management**: Manage rental units within properties
- **Tenant Management**: View and manage tenant information
- **Lease Management**: Create, review, and sign lease agreements digitally
- **Payment Tracking**: Monitor rent payments and view financial reports
- **Maintenance Requests**: Receive and respond to maintenance issues
- **Notifications**: Automated alerts for important events

### For Tenants
- **Dashboard**: View current lease, upcoming payments, and maintenance status
- **Property Browsing**: Search and filter available rental properties
- **Rental Applications**: Apply for available units
- **Digital Lease Signing**: Review and electronically sign lease agreements
- **Payment Management**: Make payments and view payment history
- **Maintenance Requests**: Report maintenance issues and track resolution
- **Notifications**: Get reminders for rent due dates and updates

## Project Structure

```
PROJECT/
├── index.html                 # Main HTML entry point
├── ARCHITECTURE.md            # Detailed architecture documentation
├── README.md                  # This file
│
├── css/
│   ├── variables.css         # CSS custom properties and design tokens
│   ├── style.css             # Main stylesheet with all component styles
│   └── responsive.css        # Media queries for mobile/tablet/desktop
│
├── js/
│   ├── app.js               # Main application initialization
│   ├── router.js            # Client-side routing and navigation
│   │
│   ├── auth/
│   │   ├── auth.js          # Authentication and session management
│   │   └── user.js          # User profile and dashboard data
│   │
│   ├── storage/
│   │   ├── localStorage.js  # LocalStorage wrapper service
│   │   └── database.js      # In-memory database with CRUD operations
│   │
│   ├── components/
│   │   ├── navbar.js        # Navigation component
│   │   ├── sidebar.js       # Sidebar navigation component
│   │   ├── modal.js         # Modal/dialog component
│   │   └── forms.js         # Form builder and validation utilities
│   │
│   ├── pages/
│   │   ├── login.js         # Login page
│   │   └── register.js      # Registration page
│   │   (Additional page files to be created)
│   │
│   └── utils/
│       ├── helpers.js       # Utility functions (149 functions)
│       ├── validation.js    # Form validation rules and utilities
│       └── formatters.js    # Data formatting functions
│
├── data/
│   └── seed-data.js         # Sample data for testing and development
```

## Getting Started

### Opening the Application
1. Open `index.html` in a web browser
2. The application will automatically load and initialize
3. Sample data will be seeded automatically on first load

### Demo Login Credentials
- **Landlord Account**
  - Email: `john@example.com`
  - Password: `Password123`
  
- **Tenant Account 1**
  - Email: `jane@example.com`
  - Password: `Password123`
  
- **Tenant Account 2**
  - Email: `bob@example.com`
  - Password: `Password123`

### Creating a New Account
1. Click "Register" in the navigation
2. Fill in your information (First Name, Last Name, Email, Phone)
3. Select your role (Tenant or Landlord)
4. Create a secure password (minimum 8 characters with uppercase, lowercase, and numbers)
5. Click "Create Account"
6. Login with your new credentials

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Data Storage**: LocalStorage (browser-based persistence)
- **Architecture**: Component-based MVC pattern
- **Authentication**: Client-side with session tokens
- **Validation**: Custom form validation with comprehensive rule set

## Core Systems

### Authentication System
The `AuthService` class handles:
- User registration with password hashing (SHA-256)
- Secure login with session management
- Password verification
- Session token generation and validation
- Role-based access control

```javascript
// Example: Login
await authService.login('john@example.com', 'Password123');

// Example: Register
await authService.register({
    email: 'newuser@example.com',
    password: 'SecurePass123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-1234',
    role: 'landlord'
});
```

### Database System
The `Database` class provides comprehensive data management:
- In-memory collections for users, properties, units, leases, payments, maintenance, applications
- CRUD operations for all entity types
- Query methods (by ID, by user, by status, etc.)
- Automatic persistence to LocalStorage
- Stats and analytics methods

```javascript
// Example: Create a property
const property = db.createProperty({
    landlordId: landlordId,
    name: 'Beautiful Apartment',
    address: '123 Main St',
    propertyType: 'apartment',
    // ... other fields
});

// Example: Query data
const myProperties = db.getPropertiesByLandlord(landlordId);
const availableUnits = db.getAvailableUnits();
```

### Storage System
The `LocalStorageService` class provides:
- Safe JSON serialization/deserialization
- Error handling and fallback values
- Data import/export capabilities
- Storage size monitoring

```javascript
// Example: Save data
LocalStorageService.set('myKey', { name: 'John', age: 30 });

// Example: Load data
const data = LocalStorageService.get('myKey', defaultValue);
```

### Router System
The `Router` class handles:
- Hash-based client-side routing
- Route registration and navigation
- Authentication checks before route access
- Role-based route protection

```javascript
// Example: Register a protected route
router.register('/landlord-dashboard', {
    component: renderLandlordDashboard,
    requireAuth: true,
    requireRole: 'landlord'
});

// Example: Navigate
router.navigate('/properties');
```

## Utility Functions (149 Total)

### Helpers (40+ functions)
- `generateId()` - UUID generation
- `formatDate()`, `formatCurrency()` - Data formatting
- `debounce()`, `throttle()` - Function utilities
- `createElement()` - DOM manipulation
- And many more...

### Validation (15+ functions)
- Email, password, phone validation
- Custom validation rules
- Form validation with error display
- Password matching, age verification
- Input sanitization

### Formatters (40+ functions)
- Currency, phone number, credit card formatting
- Date/time formatting (relative, absolute)
- Status badge generation
- Data type conversions
- And more...

## Data Models

### User
```javascript
{
    id: string,
    role: 'landlord' | 'tenant',
    email: string,
    password: string (hashed),
    firstName: string,
    lastName: string,
    phone: string,
    createdDate: Date
}
```

### Property
```javascript
{
    id: string,
    landlordId: string,
    name: string,
    address: string,
    propertyType: 'apartment' | 'house' | 'condo',
    amenities: string[],
    isActive: boolean,
    createdDate: Date
}
```

### Unit
```javascript
{
    id: string,
    propertyId: string,
    unitNumber: string,
    rentAmount: number,
    bedrooms: number,
    bathrooms: number,
    occupancyStatus: 'available' | 'occupied' | 'maintenance',
    currentTenantId: string | null
}
```

### Lease
```javascript
{
    id: string,
    tenantId: string,
    unitId: string,
    landlordId: string,
    startDate: Date,
    endDate: Date,
    rentAmount: number,
    terms: string,
    signedByTenant: boolean,
    signedByLandlord: boolean
}
```

### Payment
```javascript
{
    id: string,
    leaseId: string,
    tenantId: string,
    amount: number,
    dueDate: Date,
    paidDate: Date | null,
    status: 'pending' | 'paid' | 'overdue'
}
```

### Maintenance Request
```javascript
{
    id: string,
    unitId: string,
    tenantId: string,
    landlordId: string,
    category: 'plumbing' | 'electrical' | 'hvac' | 'general',
    description: string,
    priority: 'low' | 'medium' | 'high',
    status: 'open' | 'in_progress' | 'resolved'
}
```

## Development Guide

### Adding a New Page

1. Create a new file in `js/pages/mypage.js`:
```javascript
function renderMyPage() {
    return `
        <div class="container">
            <h1>My Page</h1>
            <p>Content here</p>
        </div>
    `;
}
```

2. Register the route in `js/router.js`:
```javascript
router.register('/my-page', {
    component: renderMyPage,
    requireAuth: true,
    requireRole: 'tenant'
});
```

3. Add navigation link in navbar or menu

### Adding Form Validation

```javascript
const schema = {
    email: {
        required: true,
        type: 'email',
        label: 'Email Address'
    },
    phone: {
        type: 'phone',
        label: 'Phone'
    }
};

const errors = validateForm(formData, schema);
displayFormErrors(errors, formElement);
```

### Working with Database

```javascript
// Create
const user = db.createUser({ email, password, firstName, lastName });

// Read
const user = db.getUserById(id);
const users = db.getCollection('users');

// Update
const updated = db.updateUser(id, { firstName: 'New Name' });

// Delete
db.deleteUser(id);

// Query
const tenants = db.getUsersByRole('tenant');
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

- **Desktop**: Full features, multi-column layouts
- **Tablet** (768px and below): Adjusted spacing and fonts
- **Mobile** (480px and below): Single-column, optimized touch targets

## Security Considerations

**Frontend-Only Implementation Notes:**
- Passwords are hashed using SHA-256 (suitable for demo only)
- Session tokens are stored in localStorage
- Role-based access control is enforced on the frontend
- XSS prevention through DOM methods (not innerHTML where possible)

**Production Recommendations:**
- Implement real backend authentication with JWT
- Use HTTPS for all communications
- Hash passwords with bcrypt on the server
- Implement CSRF tokens
- Use secure, httpOnly cookies for sessions
- Add rate limiting and input validation on server

## Console Commands

While app is running, you can use these commands in browser console:

```javascript
// View database stats
logDatabaseStats();

// Export all data
exportDatabase();

// Reset and reseed database
resetAndSeedDatabase();

// View app info
app.getInfo();

// Show notification
app.showNotification('Hello!', 'success');

// Navigate
router.navigate('/properties');

// Check authentication
authService.isAuthenticated();
authService.getCurrentUser();
```
