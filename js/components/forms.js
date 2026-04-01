// Form Utilities and Components

class FormBuilder {
    constructor(formId, validationSchema = {}) {
        this.formId = formId;
        this.validationSchema = validationSchema;
        this.formData = {};
        this.errors = {};
    }

    /**
     * Build form HTML
     */
    build(fields) {
        const form = createElement('form', {
            attributes: { id: this.formId }
        });

        fields.forEach(field => {
            const formGroup = this.buildFormField(field);
            form.appendChild(formGroup);
        });

        // Add submit button
        const submitBtn = createElement('button', {
            className: 'btn btn-primary',
            text: 'Submit',
            attributes: { type: 'submit' }
        });

        form.appendChild(submitBtn);

        // Add event listener
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        return form;
    }

    /**
     * Build individual form field
     */
    buildFormField(fieldConfig) {
        const formGroup = createElement('div', {
            className: 'form-group'
        });

        const label = createElement('label', {
            text: fieldConfig.label,
            attributes: { for: fieldConfig.name }
        });
        formGroup.appendChild(label);

        let input;

        switch (fieldConfig.type) {
            case 'textarea':
                input = createElement('textarea', {
                    attributes: { name: fieldConfig.name, id: fieldConfig.name }
                });
                break;
            case 'select':
                input = createElement('select', {
                    attributes: { name: fieldConfig.name, id: fieldConfig.name }
                });
                if (fieldConfig.options) {
                    fieldConfig.options.forEach(option => {
                        const opt = createElement('option', {
                            text: option.label,
                            attributes: { value: option.value }
                        });
                        input.appendChild(opt);
                    });
                }
                break;
            default:
                input = createElement('input', {
                    attributes: { 
                        type: fieldConfig.type || 'text',
                        name: fieldConfig.name,
                        id: fieldConfig.name,
                        placeholder: fieldConfig.placeholder || ''
                    }
                });
        }

        if (fieldConfig.required) {
            input.setAttribute('required', 'required');
        }

        formGroup.appendChild(input);
        return formGroup;
    }

    /**
     * Get form data
     */
    getFormData() {
        const form = document.getElementById(this.formId);
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    /**
     * Validate form
     */
    validate() {
        this.formData = this.getFormData();
        this.errors = validateForm(this.formData, this.validationSchema);
        
        const form = document.getElementById(this.formId);
        if (form) {
            displayFormErrors(this.errors, form);
        }

        return isFormValid(this.errors);
    }

    /**
     * Handle form submission
     */
    handleSubmit() {
        if (this.validate()) {
            console.log('Form is valid:', this.formData);
            // Handle valid form submission
        } else {
            console.log('Form has errors:', this.errors);
        }
    }

    /**
     * Reset form
     */
    resetForm() {
        const form = document.getElementById(this.formId);
        if (form) {
            form.reset();
            clearFormErrors(form);
            this.errors = {};
        }
    }

    /**
     * Populate form with data
     */
    populate(data) {
        const form = document.getElementById(this.formId);
        if (!form) return;

        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

/**
 * Quick form builder helper
 */
function buildQuickForm(formId, fields, validationSchema = {}) {
    const builder = new FormBuilder(formId, validationSchema);
    return builder.build(fields);
}

/**
 * Create form group with error handling
 */
function createFormGroup(label, name, type = 'text', options = {}) {
    return {
        label,
        name,
        type,
        placeholder: options.placeholder || '',
        required: options.required || false,
        ...options
    };
}
