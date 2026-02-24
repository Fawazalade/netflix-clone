// TMDB API Service
// Replace with your own API key from https://www.themoviedb.org/settings/api

const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; // Users need to replace this
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const IMAGE_SIZES = {
    poster: {
        small: 'w185',
        medium: 'w342',
        large: 'w500',
        original: 'original'
    },
    backdrop: {
        small: 'w300',
        medium: 'w780',
        large: 'w1280',
        original: 'original'
    },
    profile: {
        small: 'w45',
        medium: 'w185',
        large: 'h632',
        original: 'original'
    }
};

// API endpoints
const ENDPOINTS = {
    trending: '/trending/all/week',
    popularMovies: '/movie/popular',
    topRatedMovies: '/movie/top_rated',
    upcomingMovies: '/movie/upcoming',
    nowPlayingMovies: '/movie/now_playing',
    popularTV: '/tv/popular',
    topRatedTV: '/tv/top_rated',
    movieDetails: (id) => `/movie/${id}`,
    tvDetails: (id) => `/tv/${id}`,
    movieCredits: (id) => `/movie/${id}/credits`,
    tvCredits: (id) => `/tv/${id}/credits`,
    search: '/search/multi',
    discover: '/discover/movie',
    genres: '/genre/movie/list'
};

// Helper function to build image URL
export function getImageUrl(path, size = 'original', type = 'poster') {
    if (!path) return null;
    const sizeKey = IMAGE_SIZES[type]?.[size] || size;
    return `${IMAGE_BASE_URL}/${sizeKey}${path}`;
}

// Helper function to make API requests
async function fetchFromAPI(endpoint, params = {}) {
    // Check if API key is configured
    if (!API_KEY || API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        console.error('TMDB API key not configured. Please add your API key to js/services/api.js');
        throw new Error('API key not configured. Please get a free API key from https://www.themoviedb.org/settings/api');
    }

    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            url.searchParams.append(key, value);
        }
    });

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

// Get trending content
export async function getTrending(page = 1) {
    return fetchFromAPI(ENDPOINTS.trending, { page });
}

// Get popular movies
export async function getPopularMovies(page = 1) {
    return fetchFromAPI(ENDPOINTS.popularMovies, { page });
}

// Get top rated movies
export async function getTopRatedMovies(page = 1) {
    return fetchFromAPI(ENDPOINTS.topRatedMovies, { page });
}

// Get upcoming movies
export async function getUpcomingMovies(page = 1) {
    return fetchFromAPI(ENDPOINTS.upcomingMovies, { page });
}

// Get now playing movies
export async function getNowPlayingMovies(page = 1) {
    return fetchFromAPI(ENDPOINTS.nowPlayingMovies, { page });
}

// Get popular TV shows
export async function getPopularTV(page = 1) {
    return fetchFromAPI(ENDPOINTS.popularTV, { page });
}

// Get top rated TV shows
export async function getTopRatedTV(page = 1) {
    return fetchFromAPI(ENDPOINTS.topRatedTV, { page });
}

// Get movie details
export async function getMovieDetails(id) {
    return fetchFromAPI(ENDPOINTS.movieDetails(id), {
        append_to_response: 'videos,credits,similar'
    });
}

// Get TV show details
export async function getTVDetails(id) {
    return fetchFromAPI(ENDPOINTS.tvDetails(id), {
        append_to_response: 'videos,credits,similar'
    });
}

// Get movie credits
export async function getMovieCredits(id) {
    return fetchFromAPI(ENDPOINTS.movieCredits(id));
}

// Get TV credits
export async function getTVCredits(id) {
    return fetchFromAPI(ENDPOINTS.tvCredits(id));
}

// Search for movies, TV shows, and people
export async function search(query, page = 1) {
    if (!query || query.trim().length === 0) {
        return { results: [] };
    }
    
    return fetchFromAPI(ENDPOINTS.search, { 
        query: query.trim(),
        page 
    });
}

// Get genres
export async function getGenres() {
    return fetchFromAPI(ENDPOINTS.genres);
}

// Discover movies with filters
export async function discoverMovies(options = {}) {
    const {
        page = 1,
        sortBy = 'popularity.desc',
        withGenres = null,
        year = null,
        minRating = null
    } = options;

    const params = {
        page,
        sort_by: sortBy
    };

    if (withGenres) params.with_genres = withGenres;
    if (year) params.year = year;
    if (minRating) params['vote_average.gte'] = minRating;

    return fetchFromAPI(ENDPOINTS.discover, params);
}

// Helper function to get content details (auto-detect movie or TV)
export async function getContentDetails(id, mediaType) {
    if (mediaType === 'movie') {
        return getMovieDetails(id);
    } else if (mediaType === 'tv') {
        return getTVDetails(id);
    }
    throw new Error('Invalid media type');
}

// Format runtime (minutes to hours and minutes)
export function formatRuntime(minutes) {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Format release date
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Get year from date string
export function getYear(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
}

// Format rating
export function formatRating(rating) {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
}
