/**
 * HERO.JS
 * Sets up the Three.js points cloud background, mouse parallax,
 * splits hero text lines into chars, and plays the hero entrance timeline.
 */

let heroScene, heroCamera, heroRenderer, particleSystem;
let targetX = 0, targetY = 0;
let mouseMoved = false;

// For floating interactive objects
const floatingObjects = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function initHeroCanvas() {
  const canvasContainer = document.getElementById('hero-canvas');
  if (!canvasContainer) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 300 : 1800;

  // 1. Create Scene & Camera
  heroScene = new THREE.Scene();
  heroCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  heroCamera.position.z = 800;

  // 2. Create Renderer
  heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  heroRenderer.setSize(window.innerWidth, window.innerHeight);
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(heroRenderer.domElement);

  // 3. Create Particle Geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  // Populate positions randomly in a 3D volume
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = THREE.MathUtils.randFloatSpread(1600);     // X
    positions[i + 1] = THREE.MathUtils.randFloatSpread(1600); // Y
    positions[i + 2] = THREE.MathUtils.randFloatSpread(1600); // Z
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // 4. Create Material & Particle System
  const material = new THREE.PointsMaterial({
    color: 0x00FF87, // Accent Green
    size: isMobile ? 2.5 : 1.5,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });

  particleSystem = new THREE.Points(geometry, material);
  heroScene.add(particleSystem);

  // 4b. Add 3 Floating Interactive SVG Logos
  const objMaterial = new THREE.MeshBasicMaterial({
    color: 0x00FF87,
    wireframe: true,
    transparent: true,
    opacity: 0.5
  });

  const svgLoader = new THREE.SVGLoader();
  
  function loadSVGLogo(url, position, rotSpeeds, scale = 0.3) {
    svgLoader.load(url, (data) => {
      const paths = data.paths;
      const group = new THREE.Group();
      
      // Invert Y and scale
      group.scale.set(scale, -scale, scale);

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const shapes = path.toShapes(true);
        
        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];
          const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 30, // thickness of logo
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelSegments: 2
          });
          
          geometry.computeBoundingBox();
          minX = Math.min(minX, geometry.boundingBox.min.x);
          minY = Math.min(minY, geometry.boundingBox.min.y);
          maxX = Math.max(maxX, geometry.boundingBox.max.x);
          maxY = Math.max(maxY, geometry.boundingBox.max.y);

          const mesh = new THREE.Mesh(geometry, objMaterial);
          group.add(mesh);
        }
      }

      // Center the group based on combined bounding box
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      group.children.forEach(mesh => {
        mesh.position.set(-cx, -cy, -15); // -15 to center the depth
      });

      // Wrap in a parent group so we can rotate the whole thing around its center
      const parentGroup = new THREE.Group();
      parentGroup.position.set(position.x, position.y, position.z);
      parentGroup.add(group);

      heroScene.add(parentGroup);
      floatingObjects.push({ 
        mesh: parentGroup, 
        rotSpeedX: rotSpeeds.x, 
        rotSpeedY: rotSpeeds.y, 
        baseY: position.y 
      });
    });
  }

  // 1. JS Logo (Left)
  loadSVGLogo('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/brands/js.svg', {x: -300, y: 50, z: 250}, {x: 0.005, y: 0.003}, 0.35);
  
  // 2. HTML5 Logo (Center Top)
  loadSVGLogo('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/brands/html5.svg', {x: 0, y: 200, z: 150}, {x: 0.002, y: 0.004}, 0.35);

  // 3. GitHub Logo (Right)
  loadSVGLogo('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/brands/github.svg', {x: 300, y: -50, z: 200}, {x: 0.004, y: 0.002}, 0.35);

  // 5. Mouse Parallax event
  window.addEventListener('mousemove', (e) => {
    mouseMoved = true;
    // Map mouse position to range [-1, 1]
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    
    // For raycaster
    mouse.x = targetX;
    mouse.y = targetY;
  });

  // 6. Animation Tick Loop
  function animateHero() {
    requestAnimationFrame(animateHero);

    // Subtle drift rotation
    if (particleSystem) {
      particleSystem.rotation.y += 0.0002;
      particleSystem.rotation.x += 0.0001;
    }

    // Animate floating objects
    const time = Date.now() * 0.001;
    floatingObjects.forEach((obj, index) => {
      // Rotation
      obj.mesh.rotation.x += obj.rotSpeedX;
      obj.mesh.rotation.y += obj.rotSpeedY;
      
      // Floating up and down
      obj.mesh.position.y = obj.baseY + Math.sin(time * 2 + index) * 20;
      
      // Smooth scale return (in case it was hovered)
      obj.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
    });

    // Check interactions with raycaster
    if (mouseMoved) {
      raycaster.setFromCamera(mouse, heroCamera);
      const intersects = raycaster.intersectObjects(floatingObjects.map(o => o.mesh), true);
      if (intersects.length > 0) {
        // find the parent group that is in floatingObjects
        let obj = intersects[0].object;
        while (obj.parent && obj.parent !== heroScene) {
          if (floatingObjects.find(f => f.mesh === obj)) break;
          obj = obj.parent;
        }
        
        // Hover effect - scale up the intersected object
        obj.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
        
        // Optionally rotate faster when hovered
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
      }
    }

    // Smooth mouse parallax lag (lerp)
    if (mouseMoved) {
      heroCamera.position.x += (targetX * 250 - heroCamera.position.x) * 0.05;
      heroCamera.position.y += (targetY * 250 - heroCamera.position.y) * 0.05;
    }
    
    heroCamera.lookAt(heroScene.position);
    heroRenderer.render(heroScene, heroCamera);
  }

  animateHero();

  // 7. Handle Resize
  window.addEventListener('resize', () => {
    heroCamera.aspect = window.innerWidth / window.innerHeight;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/**
 * Splits lines into individual character span elements for advanced GSAP stagger
 */
function prepareHeadlineCharacters() {
  const headline = document.getElementById('hero-headline');
  if (!headline) return;

  const lines = headline.querySelectorAll('.line .block');
  lines.forEach(line => {
    const text = line.textContent;
    line.innerHTML = '';
    
    // Split to character spans
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.className = 'char';
      line.appendChild(span);
    });
  });
}

/**
 * Starts the logo path and hero content intro animations
 */
function playHeroIntro() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Set up SVG Monogram stroke properties
  const logoPath = document.getElementById('logo-path');
  if (logoPath) {
    const pathLength = logoPath.getTotalLength();
    gsap.set(logoPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });
  }

  if (prefersReduced) {
    // Reveal everything statically if reduced motion is enabled
    if (logoPath) gsap.set(logoPath, { strokeDashoffset: 0 });
    gsap.set('#hero-headline .line .block', { y: 0 });
    return;
  }

  const tl = gsap.timeline();

  // 1. Logo SVG path draw-on
  if (logoPath) {
    tl.to(logoPath, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: 'power2.inOut'
    });
  }

  // 2. Character stagger for the headline
  const chars = document.querySelectorAll('#hero-headline .line .block .char');
  if (chars.length > 0) {
    tl.from(chars, {
      y: 90,
      opacity: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: 'back.out(1.4)'
    }, logoPath ? '-=0.8' : '0');
  }

  // 3. Stagger labels and buttons
  const staggers = document.querySelectorAll('.reveal-stagger');
  if (staggers.length > 0) {
    tl.from(staggers, {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4');
  }

  // 4. Nav links animation
  const navLinks = document.querySelectorAll('header nav a, #resume-btn');
  if (navLinks.length > 0) {
    tl.from(navLinks, {
      y: -20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.6');
  }
}

/**
 * Initializes navbar magnetic actions
 */
function initMagneticHovers() {
  const magneticEls = document.querySelectorAll('.magnetic-hover, [data-magnetic]');
  
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      // Calculate local mouse position delta relative to center
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, { 
        x: x * 0.35, 
        y: y * 0.35, 
        duration: 0.3,
        overwrite: 'auto'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { 
        x: 0, 
        y: 0, 
        duration: 0.5, 
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto'
      });
    });
  });
}
