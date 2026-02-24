// Watchlist Page

import { getWatchlist, clearWatchlist } from '../services/storage.js';
import { createMovieCard } from '../components/movieCard.js';
import { showToast } from '../components/toast.js';

export async function renderWatchlist(container) {
    const watchlist = getWatchlist();
    
    // Page header
    const header = document.createElement('div');
    header.style.cssText = 'padding: 8rem 2rem 2rem;';
    
    const headerContent = document.createElement('div');
    headerContent.style.cssText = 'max-width: 1920px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;';
    
    const titleSection = document.createElement('div');
    titleSection.innerHTML = `
        <h1 style="font-size: 3rem; margin-bottom: 0.5rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">My List</h1>
        <p style="color: var(--color-text-secondary); font-size: 1.125rem;">${watchlist.length} ${watchlist.length === 1 ? 'item' : 'items'} saved</p>
    `;
    
    headerContent.appendChild(titleSection);
    
    // Clear all button (only show if there are items)
    if (watchlist.length > 0) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-secondary';
        clearBtn.textContent = 'Clear All';
        clearBtn.style.cssText = 'margin-left: auto;';
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your entire watchlist?')) {
                clearWatchlist();
                showToast('Watchlist cleared', 'success');
                window.dispatchEvent(new CustomEvent('watchlistUpdated'));
                // Re-render page
                container.innerHTML = '';
                renderWatchlist(container);
            }
        });
        headerContent.appendChild(clearBtn);
    }
    
    header.appendChild(headerContent);
    container.appendChild(header);
    
    // Watchlist content
    const content = document.createElement('div');
    content.style.cssText = 'max-width: 1920px; margin: 0 auto; padding: 0 2rem 4rem;';
    
    if (watchlist.length === 0) {
        // Empty state
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-icon">📚</div>
            <h2>Your list is empty</h2>
            <p>Start adding movies and shows to your list to watch them later!</p>
            <button class="btn btn-primary" data-route="/">Browse Content</button>
        `;
        content.appendChild(emptyState);
    } else {
        // Grid layout for watchlist items
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
            gap: var(--card-gap);
        `;
        
        // Sort by added date (newest first)
        const sortedWatchlist = [...watchlist].sort((a, b) => {
            return new Date(b.addedAt) - new Date(a.addedAt);
        });
        
        // Create cards
        sortedWatchlist.forEach(item => {
            const card = createMovieCard(item);
            grid.appendChild(card);
        });
        
        content.appendChild(grid);
    }
    
    container.appendChild(content);
}
