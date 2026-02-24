// Modal Component

import { getContentDetails, getImageUrl, formatRuntime, getYear, formatRating } from '../services/api.js';
import { isInWatchlist, toggleWatchlist } from '../services/storage.js';
import { showToast } from './toast.js';
import { truncate } from '../utils/helpers.js';

let currentModal = null;

// Open modal with content details
export async function openModal(id, mediaType) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;
    
    // Show modal with loading state
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    modalContent.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 400px;">
            <div class="loading-spinner">
                <div class="spinner-bar"></div>
                <div class="spinner-bar"></div>
                <div class="spinner-bar"></div>
                <div class="spinner-bar"></div>
            </div>
        </div>
    `;
    
    try {
        // Fetch content details
        const data = await getContentDetails(id, mediaType);
        currentModal = { ...data, media_type: mediaType };
        
        // Render modal content
        renderModalContent(data, mediaType);
        
    } catch (error) {
        console.error('Error loading content:', error);
        modalContent.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h2>Failed to Load Content</h2>
                <p>${error.message || 'Please try again later.'}</p>
                <button class="btn btn-primary" onclick="this.closest('.modal').classList.remove('active'); document.body.style.overflow = '';">Close</button>
            </div>
        `;
    }
}

// Render modal content
function renderModalContent(data, mediaType) {
    const modalContent = document.getElementById('modalContent');
    const inWatchlist = isInWatchlist(data.id, mediaType);
    
    const {
        id,
        title,
        name,
        overview,
        backdrop_path,
        poster_path,
        vote_average,
        release_date,
        first_air_date,
        runtime,
        episode_run_time,
        genres,
        credits
    } = data;
    
    const displayTitle = title || name;
    const displayDate = release_date || first_air_date;
    const year = getYear(displayDate);
    const rating = formatRating(vote_average);
    const duration = runtime ? formatRuntime(runtime) : (episode_run_time?.[0] ? formatRuntime(episode_run_time[0]) : 'N/A');
    const backdropUrl = getImageUrl(backdrop_path, 'original', 'backdrop');
    
    // Get top cast (first 6)
    const cast = credits?.cast?.slice(0, 6) || [];
    
    modalContent.innerHTML = `
        <button class="modal-close" id="modalClose" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
        
        <div class="modal-hero">
            <img src="${backdropUrl || ''}" alt="${displayTitle}" class="modal-hero-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22900%22 height=%22450%22%3E%3Crect fill=%22%231F2937%22/%3E%3C/svg%3E'">
            <div class="modal-hero-gradient"></div>
        </div>
        
        <div class="modal-body">
            <div class="modal-header">
                <h2 class="modal-title">${displayTitle}</h2>
                
                <div class="modal-meta">
                    <span class="modal-rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        ${rating}
                    </span>
                    <span class="modal-year">${year}</span>
                    <span class="modal-duration">${duration}</span>
                </div>
                
                ${genres && genres.length > 0 ? `
                    <div class="modal-genres">
                        ${genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="modal-actions">
                    <button class="btn btn-primary" id="modalPlayBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        Play
                    </button>
                    <button class="btn btn-secondary" id="modalWatchlistBtn">
                        ${inWatchlist 
                            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>In My List'
                            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Add to List'
                        }
                    </button>
                </div>
            </div>
            
            ${overview ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Overview</h3>
                    <p class="modal-overview">${overview}</p>
                </div>
            ` : ''}
            
            ${cast.length > 0 ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Cast</h3>
                    <div class="cast-grid">
                        ${cast.map(actor => `
                            <div class="cast-member">
                                <img 
                                    src="${getImageUrl(actor.profile_path, 'medium', 'profile') || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22150%22%3E%3Crect fill=%22%231F2937%22/%3E%3C/svg%3E'}" 
                                    alt="${actor.name}"
                                    class="cast-image"
                                    loading="lazy"
                                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22150%22%3E%3Crect fill=%22%231F2937%22/%3E%3C/svg%3E'"
                                >
                                <div class="cast-name">${truncate(actor.name, 20)}</div>
                                <div class="cast-character">${truncate(actor.character, 20)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    // Add event listeners
    setupModalEventListeners(data, mediaType);
}

// Setup modal event listeners
function setupModalEventListeners(data, mediaType) {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const playBtn = document.getElementById('modalPlayBtn');
    const watchlistBtn = document.getElementById('modalWatchlistBtn');
    
    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentModal = null;
    };
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }
    
    // Escape key to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Play button (placeholder - would integrate with video player)
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            showToast('Play functionality coming soon!', 'info');
        });
    }
    
    // Watchlist button
    if (watchlistBtn) {
        watchlistBtn.addEventListener('click', () => {
            const item = {
                ...data,
                media_type: mediaType
            };
            
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

// Close modal
export function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentModal = null;
    }
}

// Get current modal data
export function getCurrentModal() {
    return currentModal;
}
