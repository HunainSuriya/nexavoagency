/* ============================================
   NEXAVO AGENCY - THREE.JS 3D BACKGROUND
   Interactive 3D Particle System & Rotating Cube
   ============================================ */

// Three.js 3D Background for Hero Section
(function() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded. 3D effects disabled.');
        return;
    }

    // Get hero section for 3D canvas
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Create canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.top = '0';
    canvasContainer.style.left = '0';
    canvasContainer.style.width = '100%';
    canvasContainer.style.height = '100%';
    canvasContainer.style.zIndex = '0';
    canvasContainer.style.pointerEvents = 'none';
    heroSection.insertBefore(canvasContainer, heroSection.firstChild);

    // Setup Scene
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x0A0C12, 0.0015);

    // Setup Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 5;

    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    canvasContainer.appendChild(renderer.domElement);

    // ========== PARTICLE SYSTEM ==========
    const particleCount = 1500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particleCount * 3);
    const particlesColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Position in a sphere
        const radius = 25 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particlesPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlesPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
        particlesPositions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Colors - gradient from blue to purple
        const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.2, 0.8, 0.6);
        particlesColors[i * 3] = color.r;
        particlesColors[i * 3 + 1] = color.g;
        particlesColors[i * 3 + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particlesColors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // ========== FLOATING SPHERES ==========
    const sphereGroup = [];
    const sphereColors = [0x3E64FF, 0x6B89FF, 0x00E5FF, 0xFF3E6C];
    
    for (let i = 0; i < 12; i++) {
        const geometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.4, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: sphereColors[Math.floor(Math.random() * sphereColors.length)],
            emissive: 0x1a2a4a,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.7
        });
        const sphere = new THREE.Mesh(geometry, material);
        
        // Random positions in a torus shape
        const angle = (i / 12) * Math.PI * 2;
        const radius = 18;
        sphere.position.x = Math.cos(angle) * radius + (Math.random() - 0.5) * 5;
        sphere.position.z = Math.sin(angle) * radius + (Math.random() - 0.5) * 5;
        sphere.position.y = (Math.random() - 0.5) * 12;
        
        sphere.userData = {
            speed: 0.002 + Math.random() * 0.003,
            radius: radius,
            angle: angle,
            ySpeed: 0.005 + Math.random() * 0.01,
            originalY: sphere.position.y
        };
        
        scene.add(sphere);
        sphereGroup.push(sphere);
    }

    // ========== ROTATING TORUS KNOT ==========
    const knotGeometry = new THREE.TorusKnotGeometry(3, 0.8, 128, 16, 3, 4);
    const knotMaterial = new THREE.MeshStandardMaterial({
        color: 0x3E64FF,
        emissive: 0x1a2a4a,
        emissiveIntensity: 0.3,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: false,
        transparent: true,
        opacity: 0.4
    });
    const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
    torusKnot.position.y = -2;
    scene.add(torusKnot);

    // ========== WIREFRAME GLOBE ==========
    const globeGeometry = new THREE.SphereGeometry(5, 32, 32);
    const globeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3E64FF,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const wireframeGlobe = new THREE.Mesh(globeGeometry, globeMaterial);
    wireframeGlobe.position.y = -1;
    scene.add(wireframeGlobe);

    // ========== LIGHTING ==========
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x111122);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Fill light from below
    const fillLight = new THREE.PointLight(0x3E64FF, 0.5);
    fillLight.position.set(0, -5, 0);
    scene.add(fillLight);
    
    // Back rim light
    const rimLight = new THREE.PointLight(0x00E5FF, 0.4);
    rimLight.position.set(0, 0, -10);
    scene.add(rimLight);
    
    // Colorful point lights
    const colorLights = [];
    for (let i = 0; i < 6; i++) {
        const color = [0x3E64FF, 0x6B89FF, 0x00E5FF, 0xFF3E6C][i % 4];
        const light = new THREE.PointLight(color, 0.3);
        const angle = (i / 6) * Math.PI * 2;
        light.position.x = Math.cos(angle) * 12;
        light.position.z = Math.sin(angle) * 12;
        light.position.y = 3;
        scene.add(light);
        colorLights.push(light);
    }

    // ========== ADDITIONAL FLOATING PARTICLES (STARS) ==========
    const starCount = 800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 200;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 40;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ========== ANIMATION LOOP ==========
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    // Mouse movement effect
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.005;
        
        // Rotate main particle system
        particleSystem.rotation.y = time * 0.1;
        particleSystem.rotation.x = Math.sin(time * 0.2) * 0.1;
        particleSystem.rotation.z = Math.cos(time * 0.15) * 0.05;
        
        // Rotate stars slowly
        stars.rotation.y += 0.0005;
        stars.rotation.x += 0.0003;
        
        // Animate torus knot
        torusKnot.rotation.x = time * 0.3;
        torusKnot.rotation.y = time * 0.5;
        torusKnot.rotation.z = time * 0.2;
        
        // Animate wireframe globe
        wireframeGlobe.rotation.y = time * 0.1;
        wireframeGlobe.rotation.x = Math.sin(time * 0.15) * 0.1;
        
        // Animate floating spheres
        sphereGroup.forEach((sphere, idx) => {
            const data = sphere.userData;
            data.angle += data.speed;
            const radius = data.radius + Math.sin(time * 0.5 + idx) * 1;
            sphere.position.x = Math.cos(data.angle) * radius;
            sphere.position.z = Math.sin(data.angle) * radius;
            sphere.position.y = data.originalY + Math.sin(time * 1.5 + idx) * 1.5;
            
            // Pulse scale
            const scale = 1 + Math.sin(time * 3 + idx) * 0.2;
            sphere.scale.set(scale, scale, scale);
        });
        
        // Animate color lights
        colorLights.forEach((light, idx) => {
            const angle = time * 0.5 + (idx / colorLights.length) * Math.PI * 2;
            light.position.x = Math.cos(angle) * 14;
            light.position.z = Math.sin(angle) * 14;
            light.intensity = 0.3 + Math.sin(time * 2 + idx) * 0.15;
        });
        
        // Mouse-responsive camera movement
        const targetX = mouseX * 2;
        const targetY = mouseY * 1;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        
        // Pulse fill light
        fillLight.intensity = 0.5 + Math.sin(time * 2) * 0.2;
        rimLight.intensity = 0.4 + Math.sin(time * 1.5) * 0.15;
        
        renderer.render(scene, camera);
    }
    
    animate();

    // ========== RESIZE HANDLER ==========
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Add CSS to ensure canvas is behind content
    const style = document.createElement('style');
    style.textContent = `
        .hero {
            position: relative;
            overflow: hidden;
        }
        .hero > * {
            position: relative;
            z-index: 2;
        }
        .hero .hero-bg-animation {
            z-index: 0;
        }
    `;
    document.head.appendChild(style);
})();