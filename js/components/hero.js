// Hero Banner Component

import { getImageUrl } from '../services/api.js';
import { toggleWatchlist, isInWatchlist } from '../services/storage.js';
import { showToast } from './toast.js';
import { openModal } from './modal.js';
import { truncate } from '../utils/helpers.js';

const ROTATION_INTERVAL = 5000; // 5 seconds

let currentIndex = 0;
let rotationTimer = null;
let heroItems = [];

// Create hero banner
export function createHero(items) {
    heroItems = items.slice(0, 5); // Show top 5 items
    currentIndex = 0;
    
    const hero = document.createElement('section');
    hero.className = 'hero';
    hero.id = 'hero';
    
    // Background container
    const background = document.createElement('div');
    background.className = 'hero-background';
    
    // Create images for each item
    heroItems.forEach((item, index) => {
        const img = document.createElement('img');
        img.className = `hero-image ${index === 0 ? 'active' : ''}`;
        img.alt = item.title || item.name;
        img.src = getImageUrl(item.backdrop_path, 'original', 'backdrop') || '';
        background.appendChild(img);
    });
    
    hero.appendChild(background);
    
    // Gradient overlay
    const gradient = document.createElement('div');
    gradient.className = 'hero-gradient';
    hero.appendChild(gradient);
    
    // Content container
    const content = document.createElement('div');
    content.className = 'hero-content';
    content.id = 'heroContent';
    
    hero.appendChild(content);
    
    // Indicators
    const indicators = document.createElement('div');
    indicators.className = 'hero-indicators';
    indicators.id = 'heroIndicators';
    
    heroItems.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `hero-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
    
    hero.appendChild(indicators);
    
    // Update content for first item
    updateHeroContent(0);
    
    // Start auto-rotation
    startRotation();
    
    // Pause on hover
    hero.addEventListener('mouseenter', stopRotation);
    hero.addEventListener('mouseleave', startRotation);
    
    return hero;
}

// Update hero content
function updateHeroContent(index) {
    const item = heroItems[index];
    if (!item) return;
    
    const { id, title, name, overview, vote_average, release_date, first_air_date, media_type } = item;
    
    const displayTitle = title || name;
    const displayDate = release_date || first_air_date;
    const year = displayDate ? new Date(displayDate).getFullYear() : 'N/A';
    const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
    const inWatchlist = isInWatchlist(id, media_type);
    
    const content = document.getElementById('heroContent');
    if (!content) return;
    
    content.innerHTML = `
        <div class="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Featured
        </div>
        <h1 class="hero-title">${displayTitle}</h1>
        <div class="hero-meta">
            <span class="hero-rating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                ${rating}
            </span>
            <span class="hero-year">${year}</span>
            <span class="hero-duration">${media_type === 'movie' ? 'Movie' : 'TV Series'}</span>
        </div>
        <p class="hero-description">${truncate(overview, 200)}</p>
        <div class="hero-actions">
            <button class="btn btn-primary" id="heroPlayBtn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                More Info
            </button>
            <button class="btn btn-secondary" id="heroWatchlistBtn">
                ${inWatchlist 
                    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>In My List'
                    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Add to List'
                }
            </button>
        </div>
    `;
    
    // Add event listeners
    const playBtn = document.getElementById('heroPlayBtn');
    const watchlistBtn = document.getElementById('heroWatchlistBtn');
    
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            openModal(id, media_type);
        });
    }
    
    if (watchlistBtn) {
        watchlistBtn.addEventListener('click', () => {
            const added = toggleWatchlist(item);
            
            // Update button
            watchlistBtn.innerHTML = added
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>In My List'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Add to List';
            
            showToast(
                added ? 'Added to your list' : 'Removed from your list',
                added ? 'success' : 'error'
            );
            
            window.dispatchEvent(new CustomEvent('watchlistUpdated'));
        });
    }
}

// Go to specific slide
function goToSlide(index) {
    if (index === currentIndex || index < 0 || index >= heroItems.length) return;
    
    // Update images
    const images = document.querySelectorAll('.hero-image');
    images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    
    // Update indicators
    const indicators = document.querySelectorAll('.hero-indicator');
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    // Update content
    currentIndex = index;
    updateHeroContent(index);
    
    // Restart rotation
    if (rotationTimer) {
        stopRotation();
        startRotation();
    }
}

// Next slide
function nextSlide() {
    const nextIndex = (currentIndex + 1) % heroItems.length;
    goToSlide(nextIndex);
}

// Start auto-rotation
function startRotation() {
    stopRotation(); // Clear any existing timer
    rotationTimer = setInterval(nextSlide, ROTATION_INTERVAL);
}

// Stop auto-rotation
function stopRotation() {
    if (rotationTimer) {
        clearInterval(rotationTimer);
        rotationTimer = null;
    }
}

// Cleanup
export function destroyHero() {
    stopRotation();
    heroItems = [];
    currentIndex = 0;
}
