// Utility Functions

/**
 * Generate a unique ID using timestamp and random number
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Safely parse JSON with fallback
 */
function safeJsonParse(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('JSON Parse Error:', e);
        return fallback;
    }
}

/**
 * Deep clone an object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const clonedObj = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * Format date to readable string
 */
function formatDate(date, format = 'MMM DD, YYYY') {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[d.getMonth()];
    
    if (format === 'MMM DD, YYYY') {
        return `${monthName} ${parseInt(day)}, ${year}`;
    } else if (format === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    } else if (format === 'MM/DD/YYYY') {
        return `${month}/${day}/${year}`;
    }
    return d.toLocaleDateString();
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    });
    return formatter.format(amount);
}

/**
 * Capitalize first letter of string
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert snake_case to Title Case
 */
function snakeToTitle(str) {
    return str
        .split('_')
        .map(word => capitalize(word))
        .join(' ');
}

/**
 * Check if object is empty
 */
function isEmpty(obj) {
    if (obj === null || obj === undefined) return true;
    if (typeof obj === 'string') return obj.trim() === '';
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
}

/**
 * Debounce function
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Create URL query string from object
 */
function createQueryString(params) {
    return Object.keys(params)
        .filter(key => params[key] !== null && params[key] !== undefined)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
}

/**
 * Get URL parameters
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (let [key, value] of params) {
        result[key] = value;
    }
    return result;
}

/**
 * Scroll to element smoothly
 */
function scrollToElement(elementOrSelector) {
    const element = typeof elementOrSelector === 'string' 
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;
    
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Get element or throw error
 */
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
    return element;
}

/**
 * Get all elements
 */
function getElements(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Create element with attributes and classes
 */
function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.className) {
        element.className = options.className;
    }
    
    if (options.text) {
        element.textContent = options.text;
    }
    
    if (options.html) {
        element.innerHTML = options.html;
    }
    
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    
    if (options.styles) {
        Object.entries(options.styles).forEach(([key, value]) => {
            element.style[key] = value;
        });
    }
    
    return element;
}

/**
 * Add event listeners to multiple elements
 */
function addEventListeners(elements, event, handler) {
    elements.forEach(element => {
        if (element) {
            element.addEventListener(event, handler);
        }
    });
}

/**
 * Remove all children from element
 */
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Check if element has class
 */
function hasClass(element, className) {
    return element.classList.contains(className);
}

/**
 * Toggle class on element
 */
function toggleClass(element, className) {
    element.classList.toggle(className);
}

/**
 * Add class to element
 */
function addClass(element, className) {
    element.classList.add(className);
}

/**
 * Remove class from element
 */
function removeClass(element, className) {
    element.classList.remove(className);
}

/**
 * Delay execution
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Log with timestamp
 */
function logWithTime(message, level = 'log') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
}

/**
 * Get nested object property safely
 */
function getNestedProperty(obj, path) {
    const keys = path.split('.');
    let result = obj;
    for (let key of keys) {
        result = result?.[key];
        if (result === undefined) break;
    }
    return result;
}

/**
 * Filter array of objects by property
 */
function filterByProperty(array, property, value) {
    return array.filter(item => item[property] === value);
}

/**
 * Sort array of objects by property
 */
function sortByProperty(array, property, ascending = true) {
    return [...array].sort((a, b) => {
        if (ascending) {
            return a[property] > b[property] ? 1 : -1;
        }
        return a[property] < b[property] ? 1 : -1;
    });
}

/**
 * Get page dimensions
 */
function getPageDimensions() {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        scroll: {
            x: window.scrollX,
            y: window.scrollY
        }
    };
}

/**
 * Check if mobile device
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Check if online
 */
function isOnline() {
    return navigator.onLine;
}
