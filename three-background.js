// Three.js Background Animation for Krishi Sakhi
let scene, camera, renderer, particles = [];
let animationId;
let isAnimationPaused = false;
let particleGeometry, particleMaterial, particleSystem;

// Configuration
const config = {
    particleCount: 50,
    particleSize: 2,
    animationSpeed: 0.5,
    rotationSpeed: 0.01,
    moveRange: 50,
    colors: [
        0x2E8B57, // Primary green
        0x4ECDC4, // Teal
        0x45B7D1, // Blue
        0xF59E0B, // Accent gold
        0x10B981, // Success green
        0x8DD0AB, // Light green
    ],
    particleTypes: [
        'leaf',
        'seed', 
        'grain',
        'flower'
    ]
};

// Initialize Three.js scene
function initThreeJS() {
    const container = document.querySelector('.hero-background');
    if (!container || !window.THREE) {
        console.warn('Three.js or container not available, showing fallback');
        showFallbackBackground();
        return;
    }

    try {
        // Scene setup
        scene = new THREE.Scene();
        
        // Camera setup
        camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        camera.position.z = 100;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "low-power"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        
        container.appendChild(renderer.domElement);

        // Create agricultural particles
        createParticleSystem();
        
        // Start animation
        animate();
        
        // Event listeners
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', pauseAnimation);
        window.addEventListener('focus', resumeAnimation);
        
        console.log('🌿 Three.js agricultural background initialized');

    } catch (error) {
        console.error('Error initializing Three.js:', error);
        showFallbackBackground();
    }
}

// Create particle system with agricultural shapes
function createParticleSystem() {
    const positions = [];
    const colors = [];
    const sizes = [];
    const velocities = [];
    
    for (let i = 0; i < config.particleCount; i++) {
        // Position
        positions.push(
            (Math.random() - 0.5) * 200, // x
            (Math.random() - 0.5) * 200, // y
            (Math.random() - 0.5) * 200  // z
        );
        
        // Color
        const color = new THREE.Color(config.colors[Math.floor(Math.random() * config.colors.length)]);
        colors.push(color.r, color.g, color.b);
        
        // Size
        sizes.push(Math.random() * config.particleSize + 1);
        
        // Velocity
        velocities.push(
            (Math.random() - 0.5) * 0.5, // vx
            (Math.random() - 0.5) * 0.3, // vy
            (Math.random() - 0.5) * 0.3  // vz
        );
    }
    
    // Geometry
    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    // Store velocities for animation
    particleGeometry.velocities = velocities;
    
    // Material
    particleMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Create leaf-like shape
                vec2 center = gl_PointCoord - vec2(0.5);
                float distance = length(center);
                
                // Leaf shape with some variation
                float leafShape = smoothstep(0.5, 0.3, distance) * 
                                 (1.0 + 0.3 * sin(atan(center.y, center.x) * 3.0));
                
                if (leafShape < 0.1) discard;
                
                gl_FragColor = vec4(vColor, leafShape * 0.8);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    // Particle system
    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
}

// Animation loop
function animate() {
    if (isAnimationPaused) return;
    
    animationId = requestAnimationFrame(animate);
    
    // Update particles
    updateParticles();
    
    // Render
    renderer.render(scene, camera);
}

// Update particle positions
function updateParticles() {
    if (!particleGeometry) return;
    
    const positions = particleGeometry.attributes.position.array;
    const velocities = particleGeometry.velocities;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < config.particleCount; i++) {
        const i3 = i * 3;
        
        // Apply velocity
        positions[i3] += velocities[i3] * config.animationSpeed;
        positions[i3 + 1] += velocities[i3 + 1] * config.animationSpeed;
        positions[i3 + 2] += velocities[i3 + 2] * config.animationSpeed;
        
        // Add some organic floating movement
        positions[i3] += Math.sin(time + i * 0.1) * 0.1;
        positions[i3 + 1] += Math.cos(time + i * 0.15) * 0.1;
        
        // Boundary checking and wrapping
        if (positions[i3] > 100) positions[i3] = -100;
        if (positions[i3] < -100) positions[i3] = 100;
        if (positions[i3 + 1] > 100) positions[i3 + 1] = -100;
        if (positions[i3 + 1] < -100) positions[i3 + 1] = 100;
        if (positions[i3 + 2] > 100) positions[i3 + 2] = -100;
        if (positions[i3 + 2] < -100) positions[i3 + 2] = 100;
    }
    
    particleGeometry.attributes.position.needsUpdate = true;
    
    // Rotate the entire system slowly
    if (particleSystem) {
        particleSystem.rotation.y += config.rotationSpeed;
        particleSystem.rotation.x += config.rotationSpeed * 0.5;
    }
}

// Handle window resize
function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle visibility change
function handleVisibilityChange() {
    if (document.hidden) {
        pauseAnimation();
    } else {
        resumeAnimation();
    }
}

// Pause animation
function pauseAnimation() {
    isAnimationPaused = true;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

// Resume animation
function resumeAnimation() {
    if (isAnimationPaused) {
        isAnimationPaused = false;
        animate();
    }
}

// Show fallback background
function showFallbackBackground() {
    const container = document.querySelector('.hero-background');
    if (!container) return;
    
    // Create SVG fallback
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 1200 800');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.opacity = '0.3';
    svg.style.zIndex = '-1';
    
    // Create leaf patterns
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const leafPattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    leafPattern.setAttribute('id', 'leafPattern');
    leafPattern.setAttribute('x', '0');
    leafPattern.setAttribute('y', '0');
    leafPattern.setAttribute('width', '100');
    leafPattern.setAttribute('height', '100');
    leafPattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    // Add some leaf shapes
    for (let i = 0; i < 10; i++) {
        const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        leaf.setAttribute('cx', Math.random() * 100);
        leaf.setAttribute('cy', Math.random() * 100);
        leaf.setAttribute('rx', Math.random() * 5 + 2);
        leaf.setAttribute('ry', Math.random() * 8 + 3);
        leaf.setAttribute('fill', config.colors[Math.floor(Math.random() * config.colors.length)]);
        leaf.setAttribute('opacity', '0.4');
        leaf.setAttribute('transform', `rotate(${Math.random() * 360})`);
        
        leafPattern.appendChild(leaf);
    }
    
    defs.appendChild(leafPattern);
    svg.appendChild(defs);
    
    // Background rect with pattern
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'url(#leafPattern)');
    
    svg.appendChild(rect);
    container.appendChild(svg);
    
    console.log('🍃 Fallback SVG background loaded');
}

// Clean up Three.js resources
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
        renderer.dispose();
    }
    
    if (particleGeometry) {
        particleGeometry.dispose();
    }
    
    if (particleMaterial) {
        particleMaterial.dispose();
    }
    
    // Remove event listeners
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', pauseAnimation);
    window.removeEventListener('focus', resumeAnimation);
}

// Performance monitoring
function checkPerformance() {
    if (!window.performance) return true;
    
    // Check if device is low-power
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && (connection.saveData || connection.effectiveType === 'slow-2g')) {
        return false;
    }
    
    // Check hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        return false;
    }
    
    // Check memory (if available)
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        return false;
    }
    
    return true;
}

// Initialize with performance check
function initBackgroundAnimation() {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        console.log('Reduced motion preferred, showing static background');
        showFallbackBackground();
        return;
    }
    
    // Check device performance
    if (!checkPerformance()) {
        console.log('Low-performance device detected, showing static background');
        showFallbackBackground();
        return;
    }
    
    // Try to load Three.js
    if (!window.THREE) {
        // Load Three.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
            setTimeout(initThreeJS, 100); // Small delay to ensure DOM is ready
        };
        script.onerror = () => {
            console.warn('Failed to load Three.js, using fallback');
            showFallbackBackground();
        };
        document.head.appendChild(script);
    } else {
        initThreeJS();
    }
}

// Mouse interaction
function addMouseInteraction() {
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        if (camera) {
            camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        }
    });
}

// Theme-aware color updates
function updateThemeColors() {
    const theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'dark') {
        config.colors = [
            0x4ECDC4, // Teal
            0x45B7D1, // Blue  
            0xF59E0B, // Gold
            0x10B981, // Green
            0x8DD0AB, // Light green
            0x60A5FA, // Light blue
        ];
    } else {
        config.colors = [
            0x2E8B57, // Primary green
            0x4ECDC4, // Teal
            0x45B7D1, // Blue
            0xF59E0B, // Accent gold
            0x10B981, // Success green
            0x8DD0AB, // Light green
        ];
    }
    
    // Update existing particles if they exist
    if (particleGeometry && particleGeometry.attributes.color) {
        const colors = particleGeometry.attributes.color.array;
        for (let i = 0; i < config.particleCount; i++) {
            const color = new THREE.Color(config.colors[Math.floor(Math.random() * config.colors.length)]);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        particleGeometry.attributes.color.needsUpdate = true;
    }
}

// Watch for theme changes
const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            updateThemeColors();
        }
    });
});

// Start observing theme changes
document.addEventListener('DOMContentLoaded', () => {
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
    
    // Initialize background animation
    setTimeout(initBackgroundAnimation, 1000); // Delay to let page load
    
    // Add mouse interaction
    addMouseInteraction();
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Export functions for external use
window.KrishiSakhiBackground = {
    pause: pauseAnimation,
    resume: resumeAnimation,
    cleanup: cleanup,
    updateTheme: updateThemeColors
};

console.log('🌾 Three.js Background Module Loaded');