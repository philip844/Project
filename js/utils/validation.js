// Form Validation Utilities

const ValidationRules = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    password: (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    },

    phone: (phone) => {
        const regex = /^[\d\s\-\+\(\)]{10,}$/;
        return regex.test(phone.replace(/\D/g, ''));
    },

    url: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    number: (value) => {
        return !isNaN(value) && value !== '';
    },

    integer: (value) => {
        return Number.isInteger(Number(value));
    },

    positiveNumber: (value) => {
        return !isNaN(value) && Number(value) > 0;
    },

    date: (date) => {
        return !isNaN(Date.parse(date));
    },

    zipCode: (zipCode) => {
        const regex = /^\d{5}(-\d{4})?$/;
        return regex.test(zipCode);
    },

    username: (username) => {
        // 3-20 characters, alphanumeric and underscore only
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        return regex.test(username);
    },

    creditCard: (cardNumber) => {
        const regex = /^(\d{4}\s?){3}\d{4}$/;
        return regex.test(cardNumber.replace(/\s/g, ''));
    },

    currency: (value) => {
        const regex = /^\$?\d+(\.\d{2})?$/;
        return regex.test(value.replace(/,/g, ''));
    }
};

const ValidationMessages = {
    required: (fieldName) => `${fieldName} is required`,
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
    phone: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
    number: 'Please enter a valid number',
    integer: 'Please enter a whole number',
    positiveNumber: 'Please enter a positive number',
    date: 'Please enter a valid date',
    zipCode: 'Please enter a valid zip code (XXXXX or XXXXX-XXXX)',
    username: 'Username must be 3-20 characters, alphanumeric and underscore only',
    creditCard: 'Please enter a valid credit card number',
    currency: 'Please enter a valid amount',
    minLength: (fieldName, min) => `${fieldName} must be at least ${min} characters`,
    maxLength: (fieldName, max) => `${fieldName} must not exceed ${max} characters`,
    match: (fieldName, otherField) => `${fieldName} must match ${otherField}`,
};

/**
 * Validate single field
 */
function validateField(value, rules) {
    const errors = [];

    // Check required
    if (rules.required && isEmpty(value)) {
        errors.push(ValidationMessages.required(rules.label || 'This field'));
        return errors;
    }

    if (isEmpty(value)) {
        return errors;
    }

    // Check type validation
    if (rules.type) {
        const validator = ValidationRules[rules.type];
        if (validator && !validator(value)) {
            errors.push(ValidationMessages[rules.type]);
        }
    }

    // Check min length
    if (rules.minLength && value.length < rules.minLength) {
        errors.push(ValidationMessages.minLength(rules.label || 'This field', rules.minLength));
    }

    // Check max length
    if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(ValidationMessages.maxLength(rules.label || 'This field', rules.maxLength));
    }

    // Custom validation
    if (rules.custom) {
        const isValid = rules.custom(value);
        if (!isValid) {
            errors.push(rules.customMessage || 'Invalid input');
        }
    }

    return errors;
}

/**
 * Validate entire form
 */
function validateForm(formData, validationSchema) {
    const errors = {};

    for (let fieldName in validationSchema) {
        const rules = validationSchema[fieldName];
        const value = formData[fieldName];
        const fieldErrors = validateField(value, rules);

        if (fieldErrors.length > 0) {
            errors[fieldName] = fieldErrors;
        }
    }

    return errors;
}

/**
 * Check if form is valid
 */
function isFormValid(errors) {
    return Object.keys(errors).length === 0;
}

/**
 * Display form errors in UI
 */
function displayFormErrors(errors, formElement) {
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));

    // Add new errors
    for (let fieldName in errors) {
        const fieldElement = formElement.querySelector(`[name="${fieldName}"]`);
        if (fieldElement) {
            const formGroup = fieldElement.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('error');
                errors[fieldName].forEach(error => {
                    const errorElement = createElement('div', {
                        className: 'form-error',
                        text: error
                    });
                    formGroup.appendChild(errorElement);
                });
            }
        }
    }
}

/**
 * Clear form errors
 */
function clearFormErrors(formElement) {
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
}

/**
 * Validate password match
 */
function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

/**
 * Validate age
 */
function validateAge(birthDate, minAge = 18) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age >= minAge;
}

/**
 * Validate date range
 */
function validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
}

/**
 * Sanitize input (basic XSS prevention)
 */
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
}

/**
 * Validate uniqueness in array of objects
 */
function validateUnique(value, array, property) {
    return !array.some(item => item[property] === value);
}

/**
 * Add CSS for form validation errors
 */
function addFormValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group.error input,
        .form-group.error select,
        .form-group.error textarea {
            border-color: var(--danger);
            background-color: rgba(239, 68, 68, 0.05);
        }

        .form-error {
            color: var(--danger);
            font-size: var(--font-size-sm);
            margin-top: var(--spacing-xs);
            display: block;
        }

        .form-success input,
        .form-success select,
        .form-success textarea {
            border-color: var(--success);
        }

        .form-group.error label {
            color: var(--danger);
        }
    `;
    document.head.appendChild(style);
}

// Add styles on page load
document.addEventListener('DOMContentLoaded', addFormValidationStyles);
