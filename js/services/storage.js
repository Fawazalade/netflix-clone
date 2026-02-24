// Storage Service - Manages localStorage operations

const STORAGE_KEYS = {
    WATCHLIST: 'streamflix_watchlist',
    PREFERENCES: 'streamflix_preferences',
    SEARCH_HISTORY: 'streamflix_search_history'
};

// Helper function to safely parse JSON from localStorage
function parseJSON(value, defaultValue = null) {
    try {
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return defaultValue;
    }
}

// Helper function to safely stringify and save to localStorage
function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

// ==================== WATCHLIST ====================

// Get all items in watchlist
export function getWatchlist() {
    return parseJSON(localStorage.getItem(STORAGE_KEYS.WATCHLIST), []);
}

// Add item to watchlist
export function addToWatchlist(item) {
    const watchlist = getWatchlist();
    
    // Check if item already exists
    const exists = watchlist.some(i => i.id === item.id && i.media_type === item.media_type);
    
    if (exists) {
        return false;
    }
    
    // Add timestamp
    const itemWithTimestamp = {
        ...item,
        addedAt: new Date().toISOString()
    };
    
    watchlist.unshift(itemWithTimestamp);
    return saveJSON(STORAGE_KEYS.WATCHLIST, watchlist);
}

// Remove item from watchlist
export function removeFromWatchlist(id, mediaType) {
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(item => !(item.id === id && item.media_type === mediaType));
    return saveJSON(STORAGE_KEYS.WATCHLIST, filtered);
}

// Check if item is in watchlist
export function isInWatchlist(id, mediaType) {
    const watchlist = getWatchlist();
    return watchlist.some(item => item.id === id && item.media_type === mediaType);
}

// Toggle item in watchlist
export function toggleWatchlist(item) {
    if (isInWatchlist(item.id, item.media_type)) {
        removeFromWatchlist(item.id, item.media_type);
        return false;
    } else {
        addToWatchlist(item);
        return true;
    }
}

// Get watchlist count
export function getWatchlistCount() {
    return getWatchlist().length;
}

// Clear watchlist
export function clearWatchlist() {
    return saveJSON(STORAGE_KEYS.WATCHLIST, []);
}

// ==================== SEARCH HISTORY ====================

const MAX_SEARCH_HISTORY = 10;

// Get search history
export function getSearchHistory() {
    return parseJSON(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY), []);
}

// Add to search history
export function addToSearchHistory(query) {
    if (!query || query.trim().length === 0) return;
    
    const history = getSearchHistory();
    
    // Remove if already exists
    const filtered = history.filter(q => q.toLowerCase() !== query.toLowerCase());
    
    // Add to beginning
    filtered.unshift(query.trim());
    
    // Limit size
    const limited = filtered.slice(0, MAX_SEARCH_HISTORY);
    
    saveJSON(STORAGE_KEYS.SEARCH_HISTORY, limited);
}

// Clear search history
export function clearSearchHistory() {
    return saveJSON(STORAGE_KEYS.SEARCH_HISTORY, []);
}

// ==================== PREFERENCES ====================

// Default preferences
const DEFAULT_PREFERENCES = {
    theme: 'dark',
    autoplay: true,
    quality: 'auto',
    language: 'en'
};

// Get preferences
export function getPreferences() {
    const saved = parseJSON(localStorage.getItem(STORAGE_KEYS.PREFERENCES), {});
    return { ...DEFAULT_PREFERENCES, ...saved };
}

// Save preferences
export function savePreferences(preferences) {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    return saveJSON(STORAGE_KEYS.PREFERENCES, updated);
}

// Get single preference
export function getPreference(key) {
    const preferences = getPreferences();
    return preferences[key];
}

// Set single preference
export function setPreference(key, value) {
    return savePreferences({ [key]: value });
}

// ==================== UTILITY ====================

// Check if localStorage is available
export function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        return false;
    }
}

// Get storage size (approximate)
export function getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return (total / 1024).toFixed(2); // KB
}

// Clear all app data
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

// Export data (for backup)
export function exportData() {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        data[name] = parseJSON(localStorage.getItem(key), null);
    });
    return data;
}

// Import data (from backup)
export function importData(data) {
    try {
        Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
            if (data[name]) {
                saveJSON(key, data[name]);
            }
        });
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

// Listen for storage changes (sync across tabs)
export function onStorageChange(callback) {
    window.addEventListener('storage', (event) => {
        if (Object.values(STORAGE_KEYS).includes(event.key)) {
            callback({
                key: event.key,
                oldValue: parseJSON(event.oldValue),
                newValue: parseJSON(event.newValue)
            });
        }
    });
}
