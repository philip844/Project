// UI Components

class Modal {
    constructor(options = {}) {
        this.id = generateId();
        this.title = options.title || 'Modal';
        this.content = options.content || '';
        this.buttons = options.buttons || [];
        this.onClose = options.onClose || null;
        this.size = options.size || 'medium'; // small, medium, large
    }

    /**
     * Open modal
     */
    open() {
        const container = document.getElementById('modal-container');
        if (!container) return;

        const modal = createElement('div', {
            className: 'modal-overlay',
            attributes: { id: this.id }
        });

        const sizeClass = `modal-${this.size}`;
        const content = createElement('div', {
            className: `modal-content ${sizeClass}`
        });

        // Add header
        const header = createElement('div', {
            className: 'modal-header flex-between'
        });
        
        const title = createElement('h2', {
            text: this.title,
            styles: { margin: '0' }
        });
        
        const closeBtn = createElement('button', {
            text: '×',
            className: 'modal-close-btn',
            attributes: { 'aria-label': 'Close' }
        });
        
        closeBtn.addEventListener('click', () => this.close());
        header.appendChild(title);
        header.appendChild(closeBtn);

        // Add body
        const body = createElement('div', {
            className: 'modal-body'
        });
        
        if (typeof this.content === 'string') {
            body.innerHTML = this.content;
        } else if (this.content instanceof Node) {
            body.appendChild(this.content);
        }

        // Add footer with buttons
        const footer = createElement('div', {
            className: 'modal-footer'
        });

        this.buttons.forEach(btn => {
            const button = createElement('button', {
                className: `btn ${btn.className || 'btn-primary'}`,
                text: btn.text
            });
            button.addEventListener('click', () => {
                if (btn.onClick) btn.onClick();
                if (btn.closeOnClick !== false) this.close();
            });
            footer.appendChild(button);
        });

        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);
        modal.appendChild(content);

        container.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        // Close on ESC key
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') this.close();
        };
        document.addEventListener('keydown', this.escapeHandler);
    }

    /**
     * Close modal
     */
    close() {
        const modal = document.getElementById(this.id);
        if (modal) {
            modal.remove();
        }
        document.removeEventListener('keydown', this.escapeHandler);
        if (this.onClose) this.onClose();
    }
}

/**
 * Add modal styles
 */
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal-header {
            background-color: var(--bg-secondary);
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--border-color);
            margin-bottom: var(--spacing-lg);
        }

        .modal-header h2 {
            margin: 0;
        }

        .modal-close-btn {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-close-btn:hover {
            color: var(--text-primary);
        }

        .modal-body {
            padding: 0 var(--spacing-lg) var(--spacing-lg);
        }

        .modal-footer {
            padding-top: var(--spacing-lg);
            border-top: 1px solid var(--border-color);
            margin-top: var(--spacing-lg);
            display: flex;
            gap: var(--spacing-md);
            justify-content: flex-end;
        }

        .modal-small {
            max-width: 400px;
        }

        .modal-medium {
            max-width: 600px;
        }

        .modal-large {
            max-width: 900px;
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', addModalStyles);

/**
 * Show confirmation dialog
 */
function showConfirmDialog(message, onConfirm, onCancel) {
    const modal = new Modal({
        title: 'Confirm',
        content: message,
        buttons: [
            {
                text: 'Cancel',
                className: 'btn btn-outline',
                onClick: onCancel
            },
            {
                text: 'Confirm',
                className: 'btn btn-danger',
                onClick: onConfirm
            }
        ]
    });
    modal.open();
}

/**
 * Show alert dialog
 */
function showAlertDialog(message, onClose) {
    const modal = new Modal({
        title: 'Alert',
        content: message,
        buttons: [
            {
                text: 'OK',
                className: 'btn btn-primary',
                onClick: onClose
            }
        ]
    });
    modal.open();
}
