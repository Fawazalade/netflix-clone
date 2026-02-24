// Movie Row Component

import { createMovieCard, createSkeletonCards } from './movieCard.js';

// Create movie row
export function createMovieRow(title, items, showViewAll = false) {
    const row = document.createElement('div');
    row.className = 'movie-row';
    
    // Header
    const header = document.createElement('div');
    header.className = 'row-header';
    
    const titleElement = document.createElement('h2');
    titleElement.className = 'row-title';
    titleElement.textContent = title;
    header.appendChild(titleElement);
    
    if (showViewAll) {
        const link = document.createElement('a');
        link.className = 'row-link';
        link.href = '#';
        link.innerHTML = `
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        `;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Could navigate to a dedicated page for this category
        });
        header.appendChild(link);
    }
    
    row.appendChild(header);
    
    // Slider container
    const slider = document.createElement('div');
    slider.className = 'movie-slider';
    
    // Track (scrollable container)
    const track = document.createElement('div');
    track.className = 'movie-slider-track';
    
    // Add cards
    items.forEach(item => {
        const card = createMovieCard(item);
        track.appendChild(card);
    });
    
    slider.appendChild(track);
    
    // Navigation buttons
    const leftNav = createNavButton('left');
    const rightNav = createNavButton('right');
    
    slider.appendChild(leftNav);
    slider.appendChild(rightNav);
    
    row.appendChild(slider);
    
    // Setup scroll behavior
    setupScrollBehavior(track, leftNav, rightNav);
    
    return row;
}

// Create navigation button
function createNavButton(direction) {
    const nav = document.createElement('div');
    nav.className = `slider-nav ${direction}`;
    
    const btn = document.createElement('button');
    btn.className = 'slider-nav-btn';
    btn.setAttribute('aria-label', `Scroll ${direction}`);
    
    const icon = direction === 'left'
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
    
    btn.innerHTML = icon;
    nav.appendChild(btn);
    
    return nav;
}

// Setup scroll behavior
function setupScrollBehavior(track, leftNav, rightNav) {
    const scrollAmount = 800; // Pixels to scroll
    
    // Left navigation
    leftNav.addEventListener('click', () => {
        track.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Right navigation
    rightNav.addEventListener('click', () => {
        track.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Update navigation visibility on scroll
    function updateNavVisibility() {
        const { scrollLeft, scrollWidth, clientWidth } = track;
        
        leftNav.style.opacity = scrollLeft > 0 ? '1' : '0';
        rightNav.style.opacity = scrollLeft < scrollWidth - clientWidth - 10 ? '1' : '0';
    }
    
    track.addEventListener('scroll', updateNavVisibility);
    updateNavVisibility();
    
    // Mouse wheel scroll
    track.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            track.scrollBy({
                left: e.deltaY,
                behavior: 'auto'
            });
        }
    }, { passive: false });
}

// Create loading row with skeletons
export function createLoadingRow(title) {
    const row = document.createElement('div');
    row.className = 'movie-row';
    
    // Header
    const header = document.createElement('div');
    header.className = 'row-header';
    
    const titleElement = document.createElement('h2');
    titleElement.className = 'row-title';
    titleElement.textContent = title;
    header.appendChild(titleElement);
    
    row.appendChild(header);
    
    // Slider with skeleton cards
    const slider = document.createElement('div');
    slider.className = 'movie-slider';
    
    const track = document.createElement('div');
    track.className = 'movie-slider-track';
    
    createSkeletonCards(10).forEach(skeleton => {
        track.appendChild(skeleton);
    });
    
    slider.appendChild(track);
    row.appendChild(slider);
    
    return row;
}
