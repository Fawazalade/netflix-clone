// Simple Client-Side Router

import { renderHome } from './pages/home.js';
import { renderMovies } from './pages/movies.js';
import { renderSeries } from './pages/series.js';
import { renderWatchlist } from './pages/watchlist.js';

const routes = {
    '/': renderHome,
    '/movies': renderMovies,
    '/series': renderSeries,
    '/watchlist': renderWatchlist
};

let currentRoute = '/';

// Initialize router
export function initRouter() {
    // Handle initial route
    const path = window.location.hash.slice(1) || '/';
    navigateTo(path, false);
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const path = window.location.hash.slice(1) || '/';
        navigateTo(path, false);
    });
    
    // Handle link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-route]');
        if (link) {
            e.preventDefault();
            const route = link.dataset.route;
            navigateTo(route);
        }
    });
}

// Navigate to route
export function navigateTo(path, addToHistory = true) {
    // Normalize path
    path = path || '/';
    
    // Check if route exists
    const handler = routes[path];
    if (!handler) {
        console.error(`Route not found: ${path}`);
        navigateTo('/');
        return;
    }
    
    // Update current route
    currentRoute = path;
    
    // Update URL
    if (addToHistory) {
        window.location.hash = path;
    }
    
    // Update active nav link
    updateActiveNavLink(path);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Render page
    renderPage(handler);
}

// Render page
async function renderPage(handler) {
    const app = document.getElementById('app');
    if (!app) return;
    
    // Show loading overlay
    showLoadingOverlay();
    
    try {
        // Clear current content
        app.innerHTML = '';
        
        // Render new page
        await handler(app);
        
        // Hide loading overlay
        hideLoadingOverlay();
        
    } catch (error) {
        console.error('Error rendering page:', error);
        
        // Show error state
        app.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h2>Oops! Something went wrong</h2>
                <p>${error.message || 'Failed to load content. Please try again.'}</p>
                <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
            </div>
        `;
        
        hideLoadingOverlay();
    }
}

// Update active nav link
function updateActiveNavLink(path) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const route = link.dataset.route;
        if (route === path) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Show loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        // Small delay for smooth transition
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 300);
    }
}

// Get current route
export function getCurrentRoute() {
    return currentRoute;
}
