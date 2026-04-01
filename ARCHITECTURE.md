# Rental Management System - Architecture Document

## 1. Project Overview
A web-based Rental Management System for landlords and tenants with role-based access control, property listings, lease management, payment tracking, and maintenance requests.

## 2. Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage:** LocalStorage (frontend persistence)
- **Architecture Pattern:** Component-Based MVC

## 3. User Roles & Features

### Landlord Features
- ✓ Register/Login
- ✓ Dashboard (overview of properties, earnings, maintenance)
- ✓ Property Management (CRUD operations)
- ✓ Tenant Management (view, edit, remove)
- ✓ Payment Tracking (view rent payments, ledger)
- ✓ Maintenance Requests (view, respond, mark resolved)
- ✓ Notifications (rent due alerts)

### Tenant Features
- ✓ Register/Login
- ✓ Dashboard (current rental, lease info, rent due)
- ✓ Property Browsing (search, filter, view details)
- ✓ Rental Application (apply for property)
- ✓ Lease Signing (digital lease agreement)
- ✓ Payment Module (make payments, view history)
- ✓ Maintenance Requests (report, track status)
- ✓ Notifications (rent due, maintenance updates)

## 4. Data Model

### User Entity
```
{
  id: string (UUID)
  role: 'landlord' | 'tenant'
  email: string
  password: string (hashed - simple hash for frontend demo)
  firstName: string
  lastName: string
  phone: string
  createdDate: Date
}
```

### Property Entity
```
{
  id: string
  landlordId: string
  name: string
  address: string
  description: string
  propertyType: 'apartment' | 'house' | 'condo'
  unitCount: number
  amenities: string[]
  imageUrl: string
  isActive: boolean
  createdDate: Date
}
```

### Unit Entity
```
{
  id: string
  propertyId: string
  unitNumber: string
  rentAmount: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  occupancyStatus: 'available' | 'occupied' | 'maintenance'
  currentTenantId: string | null
  createdDate: Date
}
```

### Lease Entity
```
{
  id: string
  tenantId: string
  unitId: string
  landlordId: string
  startDate: Date
  endDate: Date
  rentAmount: number
  depositAmount: number
  terms: string
  signedByTenant: boolean
  signedByLandlord: boolean
  createdDate: Date
}
```

### Payment Entity
```
{
  id: string
  leaseId: string
  tenantId: string
  landlordId: string
  amount: number
  dueDate: Date
  paidDate: Date | null
  paymentMethod: 'card' | 'bank_transfer' | 'check'
  status: 'pending' | 'paid' | 'overdue'
  createdDate: Date
}
```

### Maintenance Request Entity
```
{
  id: string
  unitId: string
  tenantId: string
  landlordId: string
  category: 'plumbing' | 'electrical' | 'hvac' | 'general'
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'resolved'
  createdDate: Date
  resolvedDate: Date | null
  notes: string
}
```

## 5. File Structure
```
PROJECT/
├── index.html                 # Main entry point
├── ARCHITECTURE.md            # This file
├── css/
│   ├── style.css             # Main stylesheets
│   ├── variables.css         # CSS variables (colors, spacing)
│   └── responsive.css        # Media queries
├── js/
│   ├── app.js               # Main app initialization
│   ├── router.js            # Routing & navigation
│   ├── auth/
│   │   ├── auth.js          # Authentication logic
│   │   └── user.js          # User management
│   ├── storage/
│   │   ├── localStorage.js  # LocalStorage wrapper
│   │   └── database.js      # In-memory data manager
│   ├── components/
│   │   ├── navbar.js        # Navigation component
│   │   ├── sidebar.js       # Sidebar component
│   │   ├── modal.js         # Modal/dialog component
│   │   └── forms.js         # Form utilities
│   ├── pages/
│   │   ├── login.js         # Login page
│   │   ├── register.js      # Registration page
│   │   ├── dashboard/
│   │   │   ├── landlord-dashboard.js
│   │   │   └── tenant-dashboard.js
│   │   ├── properties/
│   │   │   ├── property-list.js
│   │   │   ├── property-detail.js
│   │   │   └── property-form.js
│   │   ├── tenants/
│   │   │   ├── tenant-list.js
│   │   │   └── tenant-detail.js
│   │   ├── leases/
│   │   │   ├── lease-list.js
│   │   │   ├── lease-detail.js
│   │   │   └── lease-form.js
│   │   ├── payments/
│   │   │   ├── payment-list.js
│   │   │   ├── payment-form.js
│   │   │   └── ledger.js
│   │   ├── maintenance/
│   │   │   ├── maintenance-list.js
│   │   │   ├── maintenance-detail.js
│   │   │   └── maintenance-form.js
│   │   └── browse-properties.js  # Tenant property browser
│   └── utils/
│       ├── helpers.js          # Utility functions
│       ├── validation.js       # Form validation
│       └── formatters.js       # Data formatting
└── data/
    └── seed-data.js         # Sample data for testing
```

## 6. Core Workflows

### Authentication Flow
1. User opens app
2. Router checks session token in localStorage
3. If token exists, load user dashboard
4. If no token, show login/register page

### Landlord Property Management Flow
1. Landlord navigates to Properties
2. View list of their properties
3. Click to edit, delete, or view details
4. Edit property information and units
5. Changes saved to localStorage

### Tenant Application & Lease Flow
1. Tenant browses available properties
2. Applies for a unit
3. Landlord reviews applications
4. Landlord creates lease agreement
5. Tenant reviews and signs lease
6. Both parties sign digitally
7. Lease becomes active

### Payment & Ledger Flow
1. System generates monthly rent bills
2. Tenant sees payment due in dashboard
3. Tenant makes payment
4. Payment recorded in ledger
5. Landlord views payment history and earnings report

### Maintenance Request Flow
1. Tenant reports maintenance issue
2. Creates maintenance request with details
3. Landlord reviews open requests
4. Landlord updates status to 'in_progress'
5. Updates again to 'resolved' with notes
6. Tenant can view resolution status

## 7. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Project structure & base HTML
- [ ] CSS styling & responsive design
- [ ] Authentication system (login/register)
- [ ] LocalStorage database wrapper
- [ ] Basic routing

### Phase 2: Core Features (Week 2-3)
- [ ] Property management (CRUD)
- [ ] Tenant management
- [ ] Lease creation & signing
- [ ] Payment module
- [ ] Landlord dashboard

### Phase 3: Advanced Features (Week 3-4)
- [ ] Maintenance request system
- [ ] Notifications system
- [ ] Search & filtering
- [ ] Financial reports & analytics
- [ ] Tenant dashboard

### Phase 4: Polish & Testing (Week 4)
- [ ] UI/UX refinement
- [ ] Cross-browser testing
- [ ] Data validation
- [ ] Sample data & seed scripts
- [ ] Documentation

## 8. Security Considerations (Frontend)
- Simple password hashing with SHA-256 for demo purposes
- SessionStorage/LocalStorage for auth tokens
- Role-based access control checks before rendering
- Input validation on all forms
- XSS prevention through DOM methods (not innerHTML)

## 9. Future Enhancements (Backend)
- Real authentication with JWT
- Database integration (MongoDB, PostgreSQL)
- File upload for documents
- Email notifications
- Virtual property tours
- Advanced analytics & reporting
- Mobile app version
