// Home Page

import { 
    getTrending,
    getPopularMovies,
    getTopRatedMovies,
    getPopularTV,
    getTopRatedTV,
    getNowPlayingMovies
} from '../services/api.js';
import { createHero, destroyHero } from '../components/hero.js';
import { createMovieRow, createLoadingRow } from '../components/movieRow.js';

export async function renderHome(container) {
    // Clean up any existing hero
    destroyHero();
    
    try {
        // Fetch all data in parallel
        const [
            trendingData,
            popularMoviesData,
            topRatedMoviesData,
            nowPlayingData,
            popularTVData,
            topRatedTVData
        ] = await Promise.all([
            getTrending(1),
            getPopularMovies(1),
            getTopRatedMovies(1),
            getNowPlayingMovies(1),
            getPopularTV(1),
            getTopRatedTV(1)
        ]);
        
        // Extract results
        const trending = trendingData.results || [];
        const popularMovies = popularMoviesData.results || [];
        const topRatedMovies = topRatedMoviesData.results || [];
        const nowPlaying = nowPlayingData.results || [];
        const popularTV = popularTVData.results || [];
        const topRatedTV = topRatedTVData.results || [];
        
        // Create hero banner with trending content
        if (trending.length > 0) {
            const hero = createHero(trending);
            container.appendChild(hero);
        }
        
        // Create movie rows
        const rows = [
            { title: 'Now Playing in Theaters', items: nowPlaying },
            { title: 'Popular Movies', items: popularMovies },
            { title: 'Top Rated Movies', items: topRatedMovies },
            { title: 'Popular TV Shows', items: popularTV },
            { title: 'Top Rated TV Shows', items: topRatedTV }
        ];
        
        rows.forEach(({ title, items }) => {
            if (items.length > 0) {
                const row = createMovieRow(title, items, true);
                container.appendChild(row);
            }
        });
        
    } catch (error) {
        console.error('Error loading home page:', error);
        
        // Check if it's an API key error
        if (error.message && error.message.includes('API key')) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">🔑</div>
                    <h2>API Key Required</h2>
                    <p>To use this application, you need a free API key from The Movie Database (TMDB).</p>
                    <ol style="text-align: left; max-width: 500px; margin: 2rem auto; line-height: 1.8;">
                        <li>Visit <a href="https://www.themoviedb.org/signup" target="_blank" style="color: var(--color-primary);">TMDB Sign Up</a></li>
                        <li>Create a free account</li>
                        <li>Go to Settings → API</li>
                        <li>Request an API key (choose "Developer")</li>
                        <li>Copy your API key</li>
                        <li>Open <code>js/services/api.js</code></li>
                        <li>Replace <code>YOUR_TMDB_API_KEY_HERE</code> with your key</li>
                        <li>Refresh this page</li>
                    </ol>
                </div>
            `;
        } else {
            throw error;
        }
    }
}
