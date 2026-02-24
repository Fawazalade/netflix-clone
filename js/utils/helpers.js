// Utility Functions

// ==================== DEBOUNCE & THROTTLE ====================

// Debounce function - delays execution until after wait time
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function - limits execution rate
export function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== DOM UTILITIES ====================

// Safely query selector
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

// Query all selectors
export function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

// Create element with attributes and children
export function createElement(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Append children
    children.forEach(child => {
        if (child) {
            element.append(typeof child === 'string' ? document.createTextNode(child) : child);
        }
    });
    
    return element;
}

// Check if element is in viewport
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
export function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// ==================== STRING UTILITIES ====================

// Truncate text with ellipsis
export function truncate(text, maxLength = 100, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + suffix;
}

// Capitalize first letter
export function capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Generate slug from text
export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

// ==================== NUMBER UTILITIES ====================

// Format number with commas
export function formatNumber(num) {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
}

// Format currency
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}

// Random number between min and max
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clamp number between min and max
export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

// ==================== ARRAY UTILITIES ====================

// Shuffle array
export function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get unique items from array
export function unique(array, key = null) {
    if (!key) {
        return [...new Set(array)];
    }
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

// Chunk array into smaller arrays
export function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

// ==================== ASYNC UTILITIES ====================

// Sleep/delay function
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry async function with exponential backoff
export async function retry(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await sleep(delay * Math.pow(2, i));
        }
    }
}

// ==================== IMAGE UTILITIES ====================

// Preload image
export function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Lazy load image
export function lazyLoadImage(img, src) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = src;
                    observer.unobserve(img);
                }
            });
        });
        observer.observe(img);
    } else {
        img.src = src;
    }
}

// ==================== URL UTILITIES ====================

// Get query parameters from URL
export function getQueryParams(url = window.location.href) {
    const params = {};
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

// Build URL with query parameters
export function buildUrl(base, params = {}) {
    const url = new URL(base);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            url.searchParams.append(key, value);
        }
    });
    return url.toString();
}

// ==================== DATE UTILITIES ====================

// Format relative time (e.g., "2 hours ago")
export function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    return past.toLocaleDateString();
}

// ==================== VALIDATION ====================

// Check if email is valid
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Check if URL is valid
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ==================== LOCAL STORAGE HELPERS ====================

// Safe JSON parse
export function safeJSONParse(str, fallback = null) {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

// ==================== ANIMATION HELPERS ====================

// Wait for animation to complete
export function waitForAnimation(element, animationName) {
    return new Promise(resolve => {
        const handleAnimationEnd = (event) => {
            if (event.animationName === animationName) {
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            }
        };
        element.addEventListener('animationend', handleAnimationEnd);
    });
}

// Wait for transition to complete
export function waitForTransition(element, property = null) {
    return new Promise(resolve => {
        const handleTransitionEnd = (event) => {
            if (!property || event.propertyName === property) {
                element.removeEventListener('transitionend', handleTransitionEnd);
                resolve();
            }
        };
        element.addEventListener('transitionend', handleTransitionEnd);
    });
}

// ==================== COPY TO CLIPBOARD ====================

export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    }
}

// ==================== RANDOM ID GENERATOR ====================

export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
