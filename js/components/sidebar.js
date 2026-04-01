// Sidebar Component

class Sidebar {
    constructor(containerId = 'sidebar') {
        this.containerId = containerId;
        this.items = [];
    }

    /**
     * Add sidebar item
     */
    addItem(item) {
        this.items.push(item);
    }

    /**
     * Add sidebar section
     */
    addSection(title, items) {
        this.items.push({
            type: 'section',
            title,
            items
        });
    }

    /**
     * Render sidebar
     */
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const sidebar = createElement('div', {
            className: 'sidebar'
        });

        const nav = createElement('nav', {
            className: 'sidebar-nav'
        });

        this.items.forEach(item => {
            if (item.type === 'section') {
                // Create section
                const sectionTitle = createElement('h3', {
                    className: 'sidebar-section-title',
                    text: item.title
                });
                nav.appendChild(sectionTitle);

                // Add section items
                item.items.forEach(subItem => {
                    nav.appendChild(this.createNavItem(subItem));
                });
            } else {
                nav.appendChild(this.createNavItem(item));
            }
        });

        sidebar.appendChild(nav);
        container.appendChild(sidebar);
    }

    /**
     * Create navigation item
     */
    createNavItem(item) {
        const li = createElement('li', {
            className: 'sidebar-nav-item'
        });

        const link = createElement('a', {
            className: 'sidebar-nav-link',
            text: item.label,
            attributes: { href: item.href || '#' }
        });

        if (item.icon) {
            link.innerHTML = `<span class="sidebar-icon">${item.icon}</span> ${item.label}`;
        }

        li.appendChild(link);
        return li;
    }

    /**
     * Clear sidebar
     */
    clear() {
        this.items = [];
        const container = document.getElementById(this.containerId);
        if (container) {
            clearElement(container);
        }
    }

    /**
     * Set active item
     */
    setActive(href) {
        document.querySelectorAll('.sidebar-nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === href);
        });
    }
}

/**
 * Add sidebar styles
 */
function addSidebarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .sidebar-section-title {
            font-size: var(--font-size-sm);
            text-transform: uppercase;
            color: var(--text-secondary);
            margin-top: var(--spacing-lg);
            margin-bottom: var(--spacing-md);
            font-weight: var(--font-weight-semibold);
        }

        .sidebar-section-title:first-child {
            margin-top: 0;
        }

        .sidebar-icon {
            margin-right: var(--spacing-sm);
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', addSidebarStyles);
