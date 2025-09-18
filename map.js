// Leaflet Map Module for Krishi Sakhi
let map = null;
let markersLayer = null;

// Sample agricultural data for demo markers
const sampleFarmData = [
    {
        lat: 28.6139, lng: 77.2090,
        title: "Delhi Agricultural Hub",
        status: "safe",
        groundwater: "85%",
        crops: ["Wheat", "Rice", "Mustard"],
        tip: "Optimal conditions for wheat cultivation. Consider drip irrigation for water efficiency."
    },
    {
        lat: 19.0760, lng: 72.8777,
        title: "Mumbai Urban Farming",
        status: "warning",
        groundwater: "65%",
        crops: ["Vegetables", "Herbs"],
        tip: "Urban farming showing good results. Monitor groundwater levels closely."
    },
    {
        lat: 13.0827, lng: 80.2707,
        title: "Chennai Coastal Agriculture",
        status: "warning",
        groundwater: "58%",
        crops: ["Rice", "Sugarcane", "Cotton"],
        tip: "Salt-water intrusion concerns. Consider salt-tolerant crop varieties."
    },
    {
        lat: 22.5726, lng: 88.3639,
        title: "Kolkata Agricultural Zone",
        status: "safe",
        groundwater: "78%",
        crops: ["Rice", "Jute", "Vegetables"],
        tip: "Excellent conditions for rice farming. Traditional flooding methods recommended."
    },
    {
        lat: 12.9716, lng: 77.5946,
        title: "Bangalore Tech-Farming",
        status: "safe",
        groundwater: "82%",
        crops: ["Millets", "Vegetables", "Flowers"],
        tip: "Perfect for tech-integrated farming. Smart irrigation systems performing well."
    },
    {
        lat: 26.9124, lng: 75.7873,
        title: "Jaipur Desert Agriculture",
        status: "critical",
        groundwater: "35%",
        crops: ["Bajra", "Gwar", "Desert Beans"],
        tip: "Critical water shortage. Implement water conservation techniques immediately."
    },
    {
        lat: 23.0225, lng: 72.5714,
        title: "Ahmedabad Cotton Belt",
        status: "warning",
        groundwater: "45%",
        crops: ["Cotton", "Groundnut", "Wheat"],
        tip: "Cotton belt facing water stress. Consider drought-resistant varieties."
    },
    {
        lat: 17.3850, lng: 78.4867,
        title: "Hyderabad Agricultural Research",
        status: "safe",
        groundwater: "88%",
        crops: ["Rice", "Cotton", "Chillies"],
        tip: "Research station showing excellent water management. Model for replication."
    },
    {
        lat: 30.7333, lng: 76.7794,
        title: "KVK Punjab - Ludhiana",
        status: "safe",
        groundwater: "92%",
        crops: ["Wheat", "Basmati Rice", "Potato"],
        tip: "Leading KVK center for wheat research. Zero-tillage technology showing excellent results.",
        type: "kvk",
        contact: "kvk.ludhiana@pau.edu"
    },
    {
        lat: 19.7515, lng: 75.7139,
        title: "KVK Maharashtra - Aurangabad",
        status: "warning",
        groundwater: "68%",
        crops: ["Cotton", "Sugarcane", "Soybean"],
        tip: "Promoting drip irrigation and sustainable cotton farming practices.",
        type: "kvk",
        contact: "kvk.aurangabad@mah.gov.in"
    },
    {
        lat: 11.1271, lng: 78.6569,
        title: "KVK Tamil Nadu - Coimbatore",
        status: "safe",
        groundwater: "85%",
        crops: ["Coconut", "Banana", "Turmeric"],
        tip: "Specialized in horticultural crops and organic farming techniques.",
        type: "kvk",
        contact: "kvk.coimbatore@tnau.ac.in"
    }
];

// Initialize the map
function initializeMap() {
    // Check if map already exists
    if (map) {
        return;
    }

    // Try both container IDs for flexibility
    const mapContainer = document.getElementById('map-container') || document.getElementById('interactiveMap');
    if (!mapContainer) {
        console.warn('Map container not found (looking for #map-container or #interactiveMap)');
        return;
    }
    
    const containerId = mapContainer.id;

    try {
        // Create the map centered on India
        map = L.map(containerId, {
            center: [20.5937, 78.9629], // Center of India
            zoom: 5,
            zoomControl: true,
            scrollWheelZoom: false, // Disable scroll zoom for better UX
            doubleClickZoom: true,
            dragging: true,
            attributionControl: false
        });

        // Add tile layer - using OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
        }).addTo(map);

        // Create a layer group for markers
        markersLayer = L.layerGroup().addTo(map);

        // Add sample markers
        addSampleMarkers();

        // Fit map to markers bounds
        setTimeout(() => {
            if (markersLayer.getLayers().length > 0) {
                const group = new L.featureGroup(markersLayer.getLayers());
                map.fitBounds(group.getBounds().pad(0.1));
            }
        }, 100);

        // Add custom controls
        addMapControls();

        // Handle theme changes
        handleThemeChange();

        console.log('🗺️ Interactive map initialized successfully');

    } catch (error) {
        console.error('Error initializing map:', error);
        showMapError();
    }
}

// Add sample markers to the map
function addSampleMarkers() {
    if (!markersLayer) return;

    sampleFarmData.forEach(farm => {
        const marker = createCustomMarker(farm);
        marker.addTo(markersLayer);
    });
}

// Create custom marker with popup
function createCustomMarker(farm) {
    // Define marker colors based on status
    const statusColors = {
        safe: '#10b981',
        warning: '#f59e0b', 
        critical: '#ef4444'
    };

    const color = statusColors[farm.status] || '#6b7280';
    
    // Choose icon based on type
    const isKVK = farm.type === 'kvk';
    const iconClass = isKVK ? 'fa-university' : 'fa-seedling';
    const markerSize = isKVK ? 35 : 30;
    const borderColor = isKVK ? '#2563eb' : 'white';

    // Create custom icon
    const customIcon = L.divIcon({
        html: `
            <div class="custom-marker ${farm.status} ${isKVK ? 'kvk-marker' : 'farm-marker'}" style="
                background: ${color};
                width: ${markerSize}px;
                height: ${markerSize}px;
                border-radius: 50%;
                border: 3px solid ${borderColor};
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${isKVK ? '14px' : '12px'};
                color: white;
                font-weight: bold;
                position: relative;
            ">
                <i class="fas ${iconClass}"></i>
                <div class="marker-pulse" style="
                    position: absolute;
                    top: -3px;
                    left: -3px;
                    right: -3px;
                    bottom: -3px;
                    border-radius: 50%;
                    border: 2px solid ${color};
                    animation: pulse 2s infinite;
                    opacity: 0.6;
                "></div>
            </div>
        `,
        className: 'custom-div-icon',
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize/2, markerSize/2]
    });

    // Create marker
    const marker = L.marker([farm.lat, farm.lng], { icon: customIcon });

    // Create popup content
    const popupContent = createPopupContent(farm);
    
    // Bind popup
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });

    // Add hover effects
    marker.on('mouseover', function() {
        this.openPopup();
    });

    return marker;
}

// Create popup content
function createPopupContent(farm) {
    const statusLabels = {
        safe: 'Safe',
        warning: 'Caution',
        critical: 'Critical'
    };

    const statusIcons = {
        safe: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        critical: 'fa-times-circle'
    };
    
    const isKVK = farm.type === 'kvk';
    const headerIcon = isKVK ? 'fa-university' : 'fa-map-marker-alt';
    const typeLabel = isKVK ? 'KVK Center' : 'Agricultural Site';

    return `
        <div class="farm-popup">
            <div class="popup-header">
                <h4 style="margin: 0; color: var(--gray-800); font-size: 1rem; font-weight: 600;">
                    <i class="fas ${headerIcon}" style="color: var(--primary-500); margin-right: 0.5rem;"></i>
                    ${farm.title}
                </h4>
                ${isKVK ? `<div style="font-size: 0.75rem; color: var(--primary-600); margin-top: 0.25rem; font-weight: 500;">${typeLabel}</div>` : ''}
            </div>
            
            <div class="popup-content" style="margin-top: 0.75rem;">
                <div class="status-indicator" style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.5rem;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    background: var(--${farm.status === 'safe' ? 'success' : farm.status === 'warning' ? 'warning' : 'error'}-50, #f3f4f6);
                ">
                    <i class="fas ${statusIcons[farm.status]}" style="
                        color: var(--${farm.status === 'safe' ? 'success' : farm.status === 'warning' ? 'warning' : 'error'}-500);
                        margin-right: 0.5rem;
                    "></i>
                    <span style="font-weight: 500; font-size: 0.875rem;">
                        Groundwater: ${farm.groundwater} (${statusLabels[farm.status]})
                    </span>
                </div>
                
                <div class="crops-list" style="margin-bottom: 0.75rem;">
                    <strong style="font-size: 0.875rem; color: var(--gray-700);">Key Crops:</strong>
                    <div style="margin-top: 0.25rem;">
                        ${farm.crops.map(crop => `
                            <span style="
                                display: inline-block;
                                background: var(--primary-100);
                                color: var(--primary-700);
                                padding: 0.125rem 0.5rem;
                                border-radius: 0.75rem;
                                font-size: 0.75rem;
                                margin: 0.125rem 0.25rem 0.125rem 0;
                                font-weight: 500;
                            ">${crop}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="farm-tip" style="
                    padding: 0.75rem;
                    background: var(--primary-50);
                    border-left: 3px solid var(--primary-500);
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--gray-700);
                    line-height: 1.4;
                ">
                    <i class="fas fa-lightbulb" style="color: var(--accent-500); margin-right: 0.5rem;"></i>
                    <strong>Tip:</strong> ${farm.tip}
                </div>
                
                ${isKVK && farm.contact ? `
                    <div class="kvk-contact" style="
                        margin-top: 0.75rem;
                        padding: 0.5rem;
                        background: var(--success-50);
                        border-radius: 0.5rem;
                        border: 1px solid var(--success-200);
                        font-size: 0.875rem;
                    ">
                        <div style="font-weight: 500; color: var(--gray-700); margin-bottom: 0.25rem;">
                            <i class="fas fa-phone" style="color: var(--success-500); margin-right: 0.5rem;"></i>
                            Contact KVK
                        </div>
                        <a href="mailto:${farm.contact}" style="
                            color: var(--success-600);
                            text-decoration: none;
                            font-size: 0.8rem;
                        ">${farm.contact}</a>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Add custom map controls
function addMapControls() {
    if (!map) return;

    // Add zoom control in bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Add custom legend control
    const legend = L.control({ position: 'bottomleft' });
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'map-legend-control');
        div.innerHTML = `
            <div style="
                background: white;
                padding: 0.75rem;
                border-radius: 0.5rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                font-size: 0.75rem;
                border: 1px solid var(--gray-200);
            ">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--gray-800);">Groundwater Status</div>
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    <div style="display: flex; align-items: center;">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #10b981; margin-right: 0.5rem;"></div>
                        <span>Safe (>70%)</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #f59e0b; margin-right: 0.5rem;"></div>
                        <span>Caution (40-70%)</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; margin-right: 0.5rem;"></div>
                        <span>Critical (<40%)</span>
                    </div>
                </div>
            </div>
        `;
        return div;
    };
    
    legend.addTo(map);
}

// Handle theme changes
function handleThemeChange() {
    if (!map) return;

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const theme = document.documentElement.getAttribute('data-theme');
                updateMapTheme(theme);
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

// Update map theme
function updateMapTheme(theme) {
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer(function(layer) {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });

    // Add appropriate tile layer based on theme
    if (theme === 'dark') {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '',
            maxZoom: 18
        }).addTo(map);
    } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',
            maxZoom: 18
        }).addTo(map);
    }
}

// Update markers with new data
function updateMarkers(data) {
    if (!markersLayer) return;

    // Clear existing markers
    markersLayer.clearLayers();

    // Add new markers
    if (data && data.length > 0) {
        data.forEach(farm => {
            const marker = createCustomMarker(farm);
            marker.addTo(markersLayer);
        });

        // Fit map to new bounds
        setTimeout(() => {
            const group = new L.featureGroup(markersLayer.getLayers());
            map.fitBounds(group.getBounds().pad(0.1));
        }, 100);
    }
}

// Show map error
function showMapError() {
    const mapContainer = document.getElementById('interactiveMap');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: var(--gray-50);
                border-radius: 0.5rem;
                padding: 2rem;
                text-align: center;
                color: var(--gray-600);
            ">
                <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h4 style="margin: 0 0 0.5rem 0; color: var(--gray-700);">Map Loading Error</h4>
                <p style="margin: 0; font-size: 0.875rem;">
                    Unable to load the interactive map. Please check your internet connection and try again.
                </p>
                <button onclick="initializeMap()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: var(--primary-500);
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                ">
                    Retry
                </button>
            </div>
        `;
    }
}

// Resize map when container size changes
function resizeMap() {
    if (map) {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
}

// Add CSS for map animations
const mapStyles = document.createElement('style');
mapStyles.textContent = `
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.6;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.3;
        }
        100% {
            transform: scale(1);
            opacity: 0.6;
        }
    }

    .custom-popup .leaflet-popup-content {
        margin: 0;
        padding: 0;
        width: auto !important;
    }

    .custom-popup .leaflet-popup-content-wrapper {
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border: 1px solid var(--gray-200);
    }

    .custom-popup .leaflet-popup-tip {
        background: white;
        border: 1px solid var(--gray-200);
    }

    .farm-popup {
        padding: 0.75rem;
        min-width: 250px;
    }

    /* Map container responsive styles */
    .map-container {
        position: relative;
        overflow: hidden;
    }

    .map-container .leaflet-container {
        border-radius: 0.5rem;
    }

    .map-legend-control {
        pointer-events: auto;
    }

    /* Custom marker hover effects */
    .custom-div-icon:hover {
        z-index: 1000 !important;
    }

    /* Responsive map adjustments */
    @media (max-width: 768px) {
        .farm-popup {
            min-width: 200px;
        }
        
        .map-legend-control {
            font-size: 0.7rem;
        }
    }
`;

document.head.appendChild(mapStyles);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeMap, 250);
});

// Export functions for global use
window.initializeMap = initializeMap;
window.updateMarkers = updateMarkers;
window.resizeMap = resizeMap;

// Auto-initialize if map container is visible
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('map-container') || document.getElementById('interactiveMap');
    if (mapContainer && mapContainer.offsetParent !== null) {
        // Small delay to ensure container is properly sized
        setTimeout(initializeMap, 500);
    }
});
