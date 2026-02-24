// Movies Page

import { 
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getNowPlayingMovies
} from '../services/api.js';
import { createMovieRow } from '../components/movieRow.js';

export async function renderMovies(container) {
    // Page header
    const header = document.createElement('div');
    header.style.cssText = 'padding: 8rem 2rem 3rem; text-align: center;';
    header.innerHTML = `
        <h1 style="font-size: 3rem; margin-bottom: 1rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Movies</h1>
        <p style="color: var(--color-text-secondary); font-size: 1.125rem;">Discover the latest and greatest films</p>
    `;
    container.appendChild(header);
    
    try {
        // Fetch movie data
        const [
            nowPlayingData,
            popularData,
            topRatedData,
            upcomingData
        ] = await Promise.all([
            getNowPlayingMovies(1),
            getPopularMovies(1),
            getTopRatedMovies(1),
            getUpcomingMovies(1)
        ]);
        
        const nowPlaying = nowPlayingData.results || [];
        const popular = popularData.results || [];
        const topRated = topRatedData.results || [];
        const upcoming = upcomingData.results || [];
        
        // Create movie rows
        const rows = [
            { title: 'Now Playing in Theaters', items: nowPlaying },
            { title: 'Popular Movies', items: popular },
            { title: 'Top Rated Movies', items: topRated },
            { title: 'Coming Soon', items: upcoming }
        ];
        
        rows.forEach(({ title, items }) => {
            if (items.length > 0) {
                const row = createMovieRow(title, items, true);
                container.appendChild(row);
            }
        });
        
    } catch (error) {
        console.error('Error loading movies page:', error);
        throw error;
    }
}
