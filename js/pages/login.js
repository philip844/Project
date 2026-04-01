// Login Page

function renderLoginPage() {
    const html = `
        <div class="login-container">
            <div class="login-card">
                <h1>RENTIFY</h1>
                <h2>Login</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block">Login</button>
                </form>

                <div class="login-footer">
                    <p>Don't have an account? <a href="#register">Register here</a></p>
                </div>


                <!--<div class="demo-credentials">
                    <h4>Demo Credentials</h4>
                    <p><strong>Landlord:</strong> john@example.com / Password123</p>
                    <p><strong>Tenant:</strong> jane@example.com / Password123</p>
                </div>
                -->
            </div>
        </div>
    `;

    // Create element
    const element = createElement('div');
    element.innerHTML = html;
    
    // Setup form handler after element is added to DOM
    setTimeout(() => {
        setupLoginForm();
    }, 0);

    return element;
}

// Add login page styles
function addLoginPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            padding: var(--spacing-lg);
        }

        .login-card {
            background-color: var(--bg-primary);
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-xl);
            padding: var(--spacing-3xl);
            max-width: 400px;
            width: 100%;
        }

        .login-card h1 {
            text-align: center;
            color: var(--primary-color);
            font-size: var(--font-size-2xl);
            margin-bottom: var(--spacing-sm);
        }

        .login-card h2 {
            text-align: center;
            margin-bottom: var(--spacing-xl);
            font-size: var(--font-size-xl);
        }

        .btn-block {
            width: 100%;
            margin-top: var(--spacing-lg);
        }

        .login-footer {
            text-align: center;
            margin-top: var(--spacing-lg);
            padding-top: var(--spacing-lg);
            border-top: 1px solid var(--border-color);
        }

        .demo-credentials {
            background-color: var(--bg-secondary);
            padding: var(--spacing-md);
            border-radius: var(--radius-lg);
            margin-top: var(--spacing-lg);
            font-size: var(--font-size-sm);
        }

        .demo-credentials h4 {
            margin-top: 0;
            margin-bottom: var(--spacing-sm);
        }

        .demo-credentials p {
            margin: var(--spacing-xs) 0;
        }

        @media (max-width: 480px) {
            .login-card {
                padding: var(--spacing-lg);
            }

            .login-card h1 {
                font-size: var(--font-size-xl);
            }

            .demo-credentials {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Setup login form
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.email.value;
        const password = form.password.value;

        try {
            const result = await authService.login(email, password);
            app.showNotification('Login successful!', 'success');
            
            setTimeout(() => {
                redirectToDashboard();
            }, 1000);
        } catch (error) {
            app.showNotification(error.message, 'error');
        }
    });
}

document.addEventListener('DOMContentLoaded', addLoginPageStyles);
