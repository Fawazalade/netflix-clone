// Movie Card Component

import { getImageUrl } from '../services/api.js';
import { isInWatchlist, toggleWatchlist } from '../services/storage.js';
import { showToast } from './toast.js';
import { openModal } from './modal.js';
import { truncate } from '../utils/helpers.js';

// Create movie card element
export function createMovieCard(item) {
    const { id, title, name, poster_path, backdrop_path, vote_average, release_date, first_air_date, media_type } = item;
    
    const displayTitle = title || name;
    const displayDate = release_date || first_air_date;
    const year = displayDate ? new Date(displayDate).getFullYear() : 'N/A';
    const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
    const posterUrl = getImageUrl(poster_path || backdrop_path, 'medium', poster_path ? 'poster' : 'backdrop');
    const inWatchlist = isInWatchlist(id, media_type);
    
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = id;
    card.dataset.mediaType = media_type;
    
    // Create image with lazy loading
    const img = document.createElement('img');
    img.className = 'movie-card-image';
    img.alt = displayTitle;
    img.loading = 'lazy';
    
    // Use placeholder initially
    img.src = posterUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="160"%3E%3Crect fill="%231F2937"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236B7280" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';
    
    card.appendChild(img);
    
    // Overlay with title and metadata
    const overlay = document.createElement('div');
    overlay.className = 'movie-card-overlay';
    overlay.innerHTML = `
        <div class="movie-card-title">${truncate(displayTitle, 40)}</div>
        <div class="movie-card-meta">
            <span class="movie-card-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                ${rating}
            </span>
            <span class="movie-card-year">${year}</span>
        </div>
    `;
    card.appendChild(overlay);
    
    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'movie-card-actions';
    
    // Watchlist button
    const watchlistBtn = document.createElement('button');
    watchlistBtn.className = 'card-action-btn';
    watchlistBtn.setAttribute('aria-label', inWatchlist ? 'Remove from watchlist' : 'Add to watchlist');
    watchlistBtn.innerHTML = inWatchlist
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
    
    watchlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const added = toggleWatchlist(item);
        
        // Update button
        watchlistBtn.innerHTML = added
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
        
        watchlistBtn.setAttribute('aria-label', added ? 'Remove from watchlist' : 'Add to watchlist');
        
        // Show toast
        showToast(
            added ? 'Added to your list' : 'Removed from your list',
            added ? 'success' : 'error'
        );
        
        // Dispatch custom event for watchlist updates
        window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    });
    
    actions.appendChild(watchlistBtn);
    card.appendChild(actions);
    
    // Click to open modal
    card.addEventListener('click', () => {
        openModal(id, media_type);
    });
    
    return card;
}

// Create skeleton loading card
export function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'movie-card skeleton';
    return card;
}

// Create multiple skeleton cards
export function createSkeletonCards(count = 10) {
    return Array.from({ length: count }, () => createSkeletonCard());
}
