# DolaFlix - Modern Streaming Platform Clone

A production-quality, Netflix-style streaming platform frontend built with vanilla JavaScript, HTML, and CSS. Features a beautiful UI, smooth animations, and modern web development practices.

![dolaFlix](https://img.shields.io/badge/Status-Educational%20Project-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ⚠️ Educational Purpose Only

This project is created for educational purposes to demonstrate modern frontend development techniques. It does not include any copyrighted Netflix assets and uses The Movie Database (TMDB) API for content data.

## ✨ Features

### Core Features
- 🎬 **Dynamic Content**: Real-time movie and TV show data from TMDB API
- 🎯 **Hero Banner**: Auto-rotating featured content with smooth transitions
- 🔍 **Real-time Search**: Debounced search with instant results
- 💾 **Watchlist**: Persistent storage using localStorage
- 🎨 **Modal Details**: Full-screen modal with cast information
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🎭 **Client-Side Routing**: SPA navigation with hash routing

### Technical Features
- 📦 **ES6 Modules**: Modular, maintainable code structure
- 🎯 **Component-Based**: Reusable UI components
- 🎨 **CSS Variables**: Easy theming and customization
- ⚡ **Performance Optimized**: Lazy loading images, debounced inputs
- 🎬 **Smooth Animations**: Advanced CSS animations and transitions
- 🦴 **Skeleton Loaders**: Beautiful loading states
- 🍞 **Toast Notifications**: User feedback system
- 🎪 **Error Handling**: Graceful error states

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A free TMDB API key
- A local web server (or use the provided setup)

### Step 1: Get TMDB API Key

1. Visit [The Movie Database](https://www.themoviedb.org/signup)
2. Create a free account
3. Go to Settings → API
4. Request an API key (select "Developer")
5. Copy your API key (v3 auth)

### Step 2: Configure the Application

1. Open `js/services/api.js`
2. Find this line:
   ```javascript
   const API_KEY = 'YOUR_TMDB_API_KEY_HERE';
   ```
3. Replace `YOUR_TMDB_API_KEY_HERE` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

### Step 3: Run the Application

#### Option A: Using Python (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option B: Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```

#### Option C: Using PHP
```bash
php -S localhost:8000
```

#### Option D: Using VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## 📁 Project Structure

```
streamflix/
├── index.html                 # Main HTML file
├── css/
│   ├── variables.css          # CSS custom properties
│   ├── base.css               # Base styles and reset
│   ├── components.css         # Component styles
│   └── animations.css         # Animation definitions
├── js/
│   ├── app.js                 # Application entry point
│   ├── router.js              # Client-side routing
│   ├── components/
│   │   ├── hero.js            # Hero banner component
│   │   ├── movieCard.js       # Movie card component
│   │   ├── movieRow.js        # Movie row component
│   │   ├── modal.js           # Modal component
│   │   ├── search.js          # Search component
│   │   └── toast.js           # Toast notifications
│   ├── pages/
│   │   ├── home.js            # Home page
│   │   ├── movies.js          # Movies page
│   │   ├── series.js          # TV series page
│   │   └── watchlist.js       # Watchlist page
│   ├── services/
│   │   ├── api.js             # TMDB API service
│   │   └── storage.js         # localStorage service
│   └── utils/
│       └── helpers.js         # Utility functions
└── README.md                  # This file
```

## 🎯 Features in Detail

### Hero Banner
- Auto-rotates through 5 featured items every 5 seconds
- Smooth fade transitions between slides
- Manual navigation via indicators
- Pauses on hover
- Responsive content display

### Movie Rows
- Horizontal scrolling with custom navigation
- Smooth scroll behavior
- Hover effects with scale and overlay
- Lazy loading for images
- Mouse wheel support

### Search
- Real-time search with 300ms debounce
- Displays top 8 results
- Filters out people, shows only movies/TV
- Click to open detailed modal
- Escape key to close

### Modal
- Full-screen content details
- Cast information with photos
- Backdrop image with gradient
- Add/remove from watchlist
- Genre tags
- Close on backdrop click or ESC key

### Watchlist
- Persistent storage using localStorage
- Add/remove items with animations
- Visual feedback via toast notifications
- Badge counter in navbar
- Grid layout display
- Clear all functionality
- Empty state handling

## 🎨 Customization

### Theming
All colors, spacing, and styles are defined in `css/variables.css`:

```css
:root {
    --color-primary: #FF4757;
    --color-background: #0A0E14;
    /* ... more variables */
}
```

### Fonts
The project uses:
- **Syne** - Display font (headings, titles)
- **DM Sans** - Body font (paragraphs, UI)

To change fonts, update the Google Fonts import in `index.html` and the CSS variables in `css/variables.css`.

### Layout
Adjust responsive breakpoints and card sizes in `css/variables.css`:

```css
@media (max-width: 768px) {
    :root {
        --card-width: 180px;
        --card-height: 102px;
    }
}
```

## 🔧 Development

### Adding New Features

#### 1. Create a New Component
```javascript
// js/components/myComponent.js
export function createMyComponent(data) {
    const element = document.createElement('div');
    element.className = 'my-component';
    // ... component logic
    return element;
}
```

#### 2. Add Component Styles
```css
/* css/components.css */
.my-component {
    /* styles here */
}
```

#### 3. Import and Use
```javascript
import { createMyComponent } from './components/myComponent.js';

const component = createMyComponent(data);
container.appendChild(component);
```

### Debugging

Enable verbose logging by adding to `js/app.js`:
```javascript
window.DEBUG = true;
```

### Browser DevTools
- Use React DevTools or browser inspector
- Check Network tab for API calls
- Monitor Console for errors
- Use Application tab to inspect localStorage

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## ⚡ Performance Tips

1. **Image Optimization**: Images are lazy-loaded by default
2. **Debouncing**: Search input is debounced to reduce API calls
3. **Caching**: Consider implementing service worker for offline support
4. **Code Splitting**: Already modular with ES6 modules
5. **Minimize Reflows**: Animations use transform and opacity

## 🐛 Troubleshooting

### Issue: "API key not configured" error
**Solution**: Make sure you've added your TMDB API key to `js/services/api.js`

### Issue: CORS errors
**Solution**: Must run on a web server, not file:// protocol

### Issue: Images not loading
**Solution**: Check TMDB API key and internet connection

### Issue: Blank page
**Solution**: 
- Check browser console for errors
- Ensure all files are in correct directories
- Verify JavaScript modules are loading

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) - For the API
- Google Fonts - For Syne and DM Sans fonts
- Modern CSS techniques and JavaScript patterns

## 📧 Contact

For questions or feedback about this educational project, please open an issue on the repository.

---

**Note**: This is an educational project demonstrating frontend development skills. It is not affiliated with or endorsed by Netflix or TMDB.
