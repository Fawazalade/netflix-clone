// TV Series Page

import { 
    getPopularTV,
    getTopRatedTV
} from '../services/api.js';
import { createMovieRow } from '../components/movieRow.js';

export async function renderSeries(container) {
    // Page header
    const header = document.createElement('div');
    header.style.cssText = 'padding: 8rem 2rem 3rem; text-align: center;';
    header.innerHTML = `
        <h1 style="font-size: 3rem; margin-bottom: 1rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">TV Series</h1>
        <p style="color: var(--color-text-secondary); font-size: 1.125rem;">Binge-worthy shows and series</p>
    `;
    container.appendChild(header);
    
    try {
        // Fetch TV data
        const [
            popularData,
            topRatedData
        ] = await Promise.all([
            getPopularTV(1),
            getTopRatedTV(1)
        ]);
        
        const popular = popularData.results || [];
        const topRated = topRatedData.results || [];
        
        // Create TV rows
        const rows = [
            { title: 'Popular TV Shows', items: popular },
            { title: 'Top Rated TV Shows', items: topRated }
        ];
        
        rows.forEach(({ title, items }) => {
            if (items.length > 0) {
                const row = createMovieRow(title, items, true);
                container.appendChild(row);
            }
        });
        
    } catch (error) {
        console.error('Error loading series page:', error);
        throw error;
    }
}
