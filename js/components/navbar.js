// Navbar Component (handled in app.js - this is just for reference)

function renderNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    if (!authService.isAuthenticated()) {
        navbar.innerHTML = getPublicNavbar();
    } else {
        navbar.innerHTML = getAuthenticatedNavbar();
    }
}

function getPublicNavbar() {
    return `
        <div class="container flex-between">
            <div class="navbar-brand">
                <h2 style="margin: 0;">RENTIFY</h2>
            </div>
            <div class="navbar-menu">
                <a href="#home" class="navbar-link">Home</a>
                <a href="#login" class="navbar-link">Login</a>
                <a href="#register" class="navbar-link">Register</a>
            </div>
        </div>
    `;
}

function getAuthenticatedNavbar() {
    const user = authService.getCurrentUser();
    return `
        <div class="container flex-between">
            <div class="navbar-brand">
                <h2 style="margin: 0;">RENTIFY</h2>
            </div>
            <div class="navbar-menu">
                <!-- Menu items based on role -->
            </div>
            <div class="navbar-user">
                <span>${user.firstName} ${user.lastName}</span>
                <button class="btn btn-outline" onclick="authService.logout()">Logout</button>
            </div>
        </div>
    `;
}
