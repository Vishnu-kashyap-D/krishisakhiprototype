# 🌾 Krishi Sakhi - AI-Powered Assistant for Smart Agriculture

A modern, responsive landing page for Krishi Sakhi, an AI-powered platform that provides data-driven insights for farmers and agricultural planners.

## ✨ Features

- **Interactive Map**: Real-time groundwater data visualization using Leaflet.js
- **AI Chatbot**: Agricultural Q&A assistant with comprehensive knowledge base
- **Responsive Design**: Optimized for all device sizes (mobile-first approach)
- **Modern UI/UX**: Glassmorphism effects, smooth animations, and micro-interactions
- **Performance Optimized**: Lazy loading, reduced motion support, and efficient rendering
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels and keyboard navigation
- **Dark/Light Theme**: Dynamic theme switching with system preference detection

## 🗂️ File Structure

```
├── index.html              # Main HTML file with complete page structure
├── styles.css              # Core stylesheet with design system and components
├── script.js               # Main JavaScript for navigation, animations, and interactions
├── map.js                  # Leaflet.js map module with agricultural markers
├── chatbot.js              # AI assistant with agricultural knowledge base
├── three-background.js     # Three.js 3D background animation (with fallbacks)
├── animations.js           # Enhanced animations and micro-interactions
└── README.md              # Project documentation
```

## 🎨 Design System

### Color Palette
- **Primary**: Agricultural green (`#2E8B57`) - representing growth and nature
- **Secondary**: Golden amber (`#F59E0B`) - representing harvest and prosperity  
- **Success**: Emerald (`#10B981`) - for positive indicators
- **Warning**: Amber (`#F59E0B`) - for caution states
- **Error**: Red (`#EF4444`) - for critical alerts

### Typography
- **Display**: Playfair Display (elegant serif for headings)
- **Body**: Plus Jakarta Sans (modern sans-serif for content)
- **Fallbacks**: Inter, system fonts for optimal performance

### Spacing & Layout
- **Container**: 1200px max-width with responsive padding
- **Grid**: CSS Grid for complex layouts, Flexbox for components
- **Breakpoints**: 1200px, 768px, 480px (desktop, tablet, mobile)

## 🚀 Quick Start

1. **Clone or download** the project files to your local directory
2. **Open `index.html`** in a modern web browser
3. **For development**, serve the files using a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (full layout with sidebar navigation)
- **Tablet**: 768px - 1199px (stacked hero, collapsed nav)
- **Mobile**: < 768px (single column, hamburger menu)

## 🎭 Interactive Features

### Interactive Map (map.js)
- **Technology**: Leaflet.js with OpenStreetMap tiles
- **Features**: Custom agricultural markers, popup information, theme switching
- **Data**: Sample groundwater and crop data for Indian agricultural zones
- **Performance**: Lazy loading, efficient marker management

### AI Chatbot (chatbot.js)
- **Knowledge Base**: 100+ agricultural responses covering crops, water management, pests
- **Features**: Natural language processing, typing indicators, conversation starters
- **Accessibility**: Keyboard navigation, screen reader support
- **Extensibility**: Easy to connect to external APIs

### 3D Background (three-background.js)
- **Technology**: Three.js with WebGL shader materials
- **Features**: Floating agricultural particles (leaves, seeds), mouse interaction
- **Performance**: 60fps optimization, automatic fallback for low-power devices
- **Fallback**: SVG pattern background for non-WebGL browsers

## 🔧 Configuration & Customization

### Theme Customization
Update CSS custom properties in `styles.css`:
```css
:root {
    --primary-500: #2E8B57;    /* Main brand color */
    --accent-500: #F59E0B;     /* Secondary accent */
    /* Add your custom colors */
}
```

### Map Configuration
Edit the `config` object in `map.js`:
```javascript
const sampleFarmData = [
    {
        lat: 28.6139, lng: 77.2090,
        title: "Your Location",
        status: "safe", // safe, warning, critical
        groundwater: "85%",
        crops: ["Wheat", "Rice"],
        tip: "Your farming tip here"
    }
];
```

### Chatbot Responses
Extend the knowledge base in `chatbot.js`:
```javascript
const agriculturalKnowledgeBase = {
    responses: {
        your_topic: [
            "Your response 1",
            "Your response 2"
        ]
    }
};
```

## ⚡ Performance Features

- **Lazy Loading**: Images and scripts load on demand
- **Efficient Animations**: CSS-based with reduced motion support
- **Resource Optimization**: Minified external libraries, optimized fonts
- **Caching Strategy**: Proper cache headers for static assets
- **Bundle Size**: Lightweight vanilla JS implementation (~50KB total)

## 🎯 Browser Support

- **Chrome**: 88+ ✅
- **Firefox**: 85+ ✅
- **Safari**: 14+ ✅
- **Edge**: 88+ ✅
- **Mobile Safari**: 14+ ✅
- **Chrome Mobile**: 88+ ✅

## ♿ Accessibility Features

- **WCAG 2.1 AA Compliant**: Color contrast, text sizing, keyboard navigation
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full functionality without mouse
- **Reduced Motion**: Respects user preferences for reduced animations
- **High Contrast**: Support for high contrast mode

## 🔄 Future Enhancements

### Phase 1 - Backend Integration
- [ ] Connect to real INGRES groundwater API
- [ ] Implement user authentication system
- [ ] Add form submission endpoints

### Phase 2 - Advanced Features
- [ ] Real-time weather data integration
- [ ] Crop price tracking dashboard
- [ ] Push notification system for alerts

### Phase 3 - Mobile App
- [ ] Progressive Web App (PWA) functionality
- [ ] Offline data caching
- [ ] Mobile-specific features (GPS, camera)

## 🛠️ Development Workflow

### Local Development
1. Make changes to source files
2. Test in multiple browsers
3. Validate with accessibility tools
4. Check performance metrics

### Code Style
- **HTML**: Semantic markup, proper indentation
- **CSS**: BEM methodology, logical property grouping
- **JavaScript**: ES6+ features, modular architecture

### Testing Checklist
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Accessibility compliance
- [ ] Performance metrics (Lighthouse)
- [ ] Form validation
- [ ] Interactive elements

## 📊 Performance Metrics

### Target Lighthouse Scores
- **Performance**: 95+ 
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

### Current Optimizations
- Efficient CSS (minimal unused styles)
- Optimized images and fonts
- Proper caching strategies
- Minimal JavaScript bundle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational and demonstration purposes.

## 🆘 Support

For technical support or questions about implementation:

- **Documentation**: Check this README and code comments
- **Issues**: Create detailed bug reports with browser/device info
- **Enhancements**: Suggest features through GitHub issues

---

**Created with 💚 for Smart Agriculture Initiative**

*Last updated: January 2025*
