// Register Page

function renderRegisterPage() {
    const html = `
        <div class="register-container">
            <div class="register-card">
                <h1>Create Account</h1>
                <h2>Join Rental Management System</h2>
                
                <form id="register-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="first-name">First Name</label>
                            <input type="text" id="first-name" name="firstName" required>
                        </div>
                        <div class="form-group">
                            <label for="last-name">Last Name</label>
                            <input type="text" id="last-name" name="lastName" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required>
                    </div>

                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone">
                    </div>

                    <div class="form-group">
                        <label for="role">I am a:</label>
                        <select id="role" name="role" required>
                            <option value="">Select your role</option>
                            <option value="tenant">Tenant</option>
                            <option value="landlord">Landlord</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                        <small>At least 8 characters with uppercase, lowercase, and numbers</small>
                    </div>

                    <div class="form-group">
                        <label for="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" name="confirmPassword" required>
                    </div>

                    <div class="form-group checkbox">
                        <input type="checkbox" id="terms" name="terms" required>
                        <label for="terms">I agree to the Terms and Conditions</label>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block">Create Account</button>
                </form>

                <div class="register-footer">
                    <p>Already have an account? <a href="#login">Login here</a></p>
                </div>
            </div>
        </div>
    `;

    // Create element
    const element = createElement('div');
    element.innerHTML = html;
    
    // Setup form handler after element is added to DOM
    setTimeout(() => {
        setupRegisterForm();
    }, 0);

    return element;
}

// Add register page styles
function addRegisterPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .register-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            padding: var(--spacing-lg);
        }

        .register-card {
            background-color: var(--bg-primary);
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-xl);
            padding: var(--spacing-3xl);
            max-width: 500px;
            width: 100%;
        }

        .register-card h1 {
            text-align: center;
            color: var(--primary-color);
            font-size: var(--font-size-2xl);
            margin-bottom: var(--spacing-sm);
        }

        .register-card h2 {
            text-align: center;
            margin-bottom: var(--spacing-xl);
            font-size: var(--font-size-lg);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-md);
        }

        .form-group small {
            display: block;
            font-size: var(--font-size-xs);
            color: var(--text-secondary);
            margin-top: var(--spacing-xs);
        }

        .form-group.checkbox {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }

        .form-group.checkbox input {
            width: auto;
            margin: 0;
        }

        .form-group.checkbox label {
            margin: 0;
            font-weight: normal;
            cursor: pointer;
        }

        .btn-block {
            width: 100%;
            margin-top: var(--spacing-lg);
        }

        .register-footer {
            text-align: center;
            margin-top: var(--spacing-lg);
            padding-top: var(--spacing-lg);
            border-top: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }

            .register-card {
                padding: var(--spacing-xl);
            }
        }

        @media (max-width: 480px) {
            .register-container {
                padding: var(--spacing-md);
            }

            .register-card {
                padding: var(--spacing-lg);
            }

            .register-card h1 {
                font-size: var(--font-size-xl);
            }

            .register-card h2 {
                font-size: var(--font-size-base);
            }
        }
    `;
    document.head.appendChild(style);
}

// Setup register form
function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            phone: form.phone.value,
            password: form.password.value,
            role: form.role.value
        };

        // Validate password match
        if (formData.password !== form.confirmPassword.value) {
            app.showNotification('Passwords do not match', 'error');
            return;
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            app.showNotification('Password must be at least 8 characters with uppercase, lowercase, and numbers', 'error');
            return;
        }

        try {
            await authService.register(formData);
            app.showNotification('Registration successful! Please login.', 'success');
            
            setTimeout(() => {
                router.navigate('/login');
            }, 1500);
        } catch (error) {
            app.showNotification(error.message, 'error');
        }
    });
}

document.addEventListener('DOMContentLoaded', addRegisterPageStyles);
