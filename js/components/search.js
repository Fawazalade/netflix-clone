// Search Component

import { search as searchAPI, getImageUrl, formatRating, getYear } from '../services/api.js';
import { debounce, truncate } from '../utils/helpers.js';
import { openModal } from './modal.js';

let searchInput = null;
let searchContainer = null;
let searchResults = null;
let searchToggle = null;
let searchClose = null;

// Initialize search
export function initSearch() {
    searchInput = document.getElementById('searchInput');
    searchContainer = document.getElementById('searchContainer');
    searchResults = document.getElementById('searchResults');
    searchToggle = document.getElementById('searchToggle');
    searchClose = document.getElementById('searchClose');
    
    if (!searchInput || !searchContainer || !searchResults || !searchToggle || !searchClose) {
        console.error('Search elements not found');
        return;
    }
    
    // Toggle search box
    searchToggle.addEventListener('click', () => {
        searchContainer.classList.add('active');
        searchInput.focus();
    });
    
    // Close search
    searchClose.addEventListener('click', () => {
        closeSearch();
    });
    
    // Search input with debounce
    const debouncedSearch = debounce(handleSearch, 300);
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 0) {
            debouncedSearch(query);
        } else {
            hideSearchResults();
        }
    });
    
    // Close search on escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && 
            !searchResults.contains(e.target) && 
            e.target !== searchToggle) {
            closeSearch();
        }
    });
}

// Handle search
async function handleSearch(query) {
    if (!searchResults) return;
    
    // Show loading state
    searchResults.classList.add('active');
    searchResults.innerHTML = '<div class="search-loading">Searching...</div>';
    
    try {
        const data = await searchAPI(query, 1);
        const results = data.results || [];
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-empty">No results found</div>';
            return;
        }
        
        // Filter and limit results
        const filtered = results
            .filter(item => item.media_type !== 'person') // Remove people
            .slice(0, 8); // Limit to 8 results
        
        renderSearchResults(filtered);
        
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<div class="search-empty">Search failed. Please try again.</div>';
    }
}

// Render search results
function renderSearchResults(results) {
    if (!searchResults) return;
    
    searchResults.innerHTML = '';
    
    results.forEach(item => {
        const resultItem = createSearchResultItem(item);
        searchResults.appendChild(resultItem);
    });
}

// Create search result item
function createSearchResultItem(item) {
    const { id, title, name, poster_path, vote_average, release_date, first_air_date, media_type } = item;
    
    const displayTitle = title || name;
    const displayDate = release_date || first_air_date;
    const year = getYear(displayDate);
    const rating = formatRating(vote_average);
    const posterUrl = getImageUrl(poster_path, 'small', 'poster');
    
    const resultDiv = document.createElement('div');
    resultDiv.className = 'search-result-item';
    
    resultDiv.innerHTML = `
        <img 
            src="${posterUrl || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2290%22%3E%3Crect fill=%22%231F2937%22/%3E%3C/svg%3E'}" 
            alt="${displayTitle}"
            class="search-result-poster"
            onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2290%22%3E%3Crect fill=%22%231F2937%22/%3E%3C/svg%3E'"
        >
        <div class="search-result-info">
            <div class="search-result-title">${truncate(displayTitle, 50)}</div>
            <div class="search-result-meta">
                <span class="search-result-rating">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    ${rating}
                </span>
                <span>${year}</span>
                <span>${media_type === 'movie' ? 'Movie' : 'TV'}</span>
            </div>
        </div>
    `;
    
    // Click to open modal
    resultDiv.addEventListener('click', () => {
        openModal(id, media_type);
        closeSearch();
    });
    
    return resultDiv;
}

// Close search
function closeSearch() {
    if (searchContainer) {
        searchContainer.classList.remove('active');
    }
    if (searchInput) {
        searchInput.value = '';
    }
    hideSearchResults();
}

// Hide search results
function hideSearchResults() {
    if (searchResults) {
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
    }
}
