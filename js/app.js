// Main Application Entry Point

import { initRouter } from './router.js';
import { initSearch } from './components/search.js';
import { getWatchlistCount } from './services/storage.js';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 StreamFlix initializing...');
    
    // Initialize components
    initNavbar();
    initSearch();
    initRouter();
    updateWatchlistCount();
    
    // Listen for watchlist updates
    window.addEventListener('watchlistUpdated', updateWatchlistCount);
    
    console.log('✅ StreamFlix ready!');
});

// Initialize navbar behavior
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let scrollTimeout = null;
    
    // Navbar scroll behavior
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background when scrolled
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                navbar.classList.add('hidden');
            } else {
                // Scrolling up
                navbar.classList.remove('hidden');
            }
            lastScrollTop = scrollTop;
        }, 100);
    }, { passive: true });
}

// Update watchlist count badge
function updateWatchlistCount() {
    const countElement = document.getElementById('watchlistCount');
    if (!countElement) return;
    
    const count = getWatchlistCount();
    
    if (count > 0) {
        countElement.textContent = count > 99 ? '99+' : count;
        countElement.classList.add('active');
    } else {
        countElement.classList.remove('active');
    }
}

// Handle errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Service Worker (optional - for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered', reg))
        //     .catch(err => console.log('Service Worker registration failed', err));
    });
}
