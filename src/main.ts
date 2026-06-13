// @ts-nocheck
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from 'lenis';
import './style.css';

        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768;

        // Init GSAP
        gsap.registerPlugin(ScrollTrigger, TextPlugin);

        // Lenis Smooth Scroll
        const lenis = new Lenis();
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        // Split Text Helper for Hero Headline
        function splitHeroText() {
            const headline = document.getElementById('hero-headline');
            if (!headline) return;
            const lines = headline.innerHTML.split(/<br\s*\/?>/i);
            const newContent = lines.map(line => {
                const words = line.trim().split(/\s+/);
                const wrappedWords = words.map(word => {
                    return `<span class="inline-block overflow-hidden pb-1 mr-[0.2em]"><span class="hero-word inline-block translate-y-[110%]">${word}</span></span>`;
                }).join(' ');
                return `<div class="hero-line block">${wrappedWords}</div>`;
            }).join('');
            headline.innerHTML = newContent;
        }

        // Preloader Logic
        const counter = document.getElementById('load-counter');
        const loadBar = document.getElementById('load-bar');
        const preloader = document.getElementById('preloader');
        const ascii = document.getElementById('ascii-drift');
        const terminal = document.getElementById('preloader-terminal');
        const status = document.getElementById('load-status');
        
        let count = 0;
        const chars = "!<>-_\\/[]{}—=+*^?#________";

        // Cyberpunk terminal diagnostics log lines
        const logStrings = [
            "SYS_CORE: Initializing full-stack architect systems...",
            "SYS_ENV: Loading production config variables...",
            "GL_COMP: Fetching Three.js vertex and fragment shaders...",
            "GL_COMP: Shader materials compiled successfully.",
            "SCROLL_SYS: Initializing Lenis smooth scroll engine...",
            "SCROLL_SYS: Syncing GSAP ScrollTrigger module...",
            "DOM_ENG: Parsing selected work grid and assets...",
            "COMP_MOUNT: Preparing Expertise canvas and Skill items...",
            "UI_SEC: Resolving contact forms and mail channels...",
            "NETWORK_OK: Syncing uplink (104.2 MB/s)...",
            "SYSTEM_INIT: Deploying animations and physics layers..."
        ];
        
        let lastLoggedPercent = 0;

        const updateLoader = () => {
            count += Math.floor(Math.random() * 5) + 1; // Ensure it always increments at least by 1
            if(count > 100) count = 100;
            counter.innerText = count;
            loadBar.style.width = count + '%';
            
            // Drift ASCII
            let str = "";
            for(let i=0; i<500; i++) str += chars[Math.floor(Math.random() * chars.length)];
            ascii.innerText = str;

            // Diagnostic Console Log Trigger
            const logStep = Math.floor(100 / logStrings.length);
            if (count >= lastLoggedPercent + logStep && lastLoggedPercent < 100) {
                const logIndex = Math.floor(lastLoggedPercent / logStep);
                if (logIndex < logStrings.length) {
                    const logLine = document.createElement('div');
                    logLine.className = 'opacity-0 transition-opacity duration-300';
                    logLine.innerHTML = `<span class="text-[#00FF87]">[ OK ]</span> ${logStrings[logIndex]}`;
                    terminal.appendChild(logLine);
                    // Force repaint then fade-in
                    setTimeout(() => logLine.classList.remove('opacity-0'), 10);
                    // Auto-scroll terminal to bottom
                    terminal.scrollTop = terminal.scrollHeight;
                }
                lastLoggedPercent += logStep;
            }

            if(count < 100) {
                setTimeout(updateLoader, 40 + Math.random() * 30);
            } else {
                // Done loading
                status.innerText = "SYSTEM ONLINE";
                status.classList.add("text-[#00FF87]", "animate-pulse");

                // Append final launch success log
                const finalLine = document.createElement('div');
                finalLine.className = 'font-semibold text-[#00FF87]';
                finalLine.innerText = "[ LAUNCH ] System core operational. Redirecting to terminal view...";
                terminal.appendChild(finalLine);
                terminal.scrollTop = terminal.scrollHeight;

                // Split text of hero title so it's ready in background
                splitHeroText();

                // Split-Gate GSAP Timeline Reveal
                const revealTl = gsap.timeline({ delay: 0.8 });
                
                // 1. Fade out the centered loader content and progress bar
                revealTl.to(['#preloader-content', '#load-bar'], {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // 2. Slide open the split gates in opposite directions
                revealTl.to('#preloader-left', {
                    xPercent: -100,
                    duration: 1.4,
                    ease: 'expo.inOut'
                }, '-=0.2');
                
                revealTl.to('#preloader-right', {
                    xPercent: 100,
                    duration: 1.4,
                    ease: 'expo.inOut',
                    onComplete: () => {
                        preloader.remove(); // Clean up preloader from DOM
                        initAnimations();
                        initProjectCardTilt();
                    }
                }, '-=1.4'); // run concurrently with left gate
            }
        };
        updateLoader();

        // ── Text Scrambler Class ──────────────────────────────────────
        class TextScrambler {
            constructor(el) {
                this.el = el;
                this.chars = '!<>-_\\/[]{}—=+*^?#________';
                this.update = this.update.bind(this);
            }
            setText(newText) {
                const oldText = this.el.innerText;
                const length = Math.max(oldText.length, newText.length);
                const promise = new Promise((resolve) => this.resolve = resolve);
                this.queue = [];
                for (let i = 0; i < length; i++) {
                    const start = Math.floor(Math.random() * 20);
                    const end = start + Math.floor(Math.random() * 20);
                    this.queue.push({
                        from: oldText[i] || '',
                        to: newText[i] || '',
                        start,
                        end,
                        char: ''
                    });
                }
                cancelAnimationFrame(this.frameRequest);
                this.frame = 0;
                this.update();
                return promise;
            }
            update() {
                let output = '';
                let complete = 0;
                for (let i = 0, n = this.queue.length; i < n; i++) {
                    let { from, to, start, end, char } = this.queue[i];
                    if (this.frame >= end) {
                        complete++;
                        output += to;
                    } else if (this.frame >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = this.randomChar();
                            this.queue[i].char = char;
                        }
                        output += `<span class="text-[#00FF87]">${char}</span>`;
                    } else {
                        output += from;
                    }
                }
                this.el.innerHTML = output;
                if (complete === this.queue.length) {
                    this.resolve();
                } else {
                    this.frameRequest = requestAnimationFrame(this.update);
                    this.frame++;
                }
            }
            randomChar() {
                return this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        }

        // Initialize Text Scramble on Hover
        document.querySelectorAll('.scramble-text').forEach(el => {
            const originalText = el.innerText;
            const scrambler = new TextScrambler(el);
            el.addEventListener('mouseenter', () => {
                scrambler.setText(originalText);
            });
        });

        // ── Canvas Cursor Trail ──────────────────────────────────────
        function initCursorTrail() {
            const canvas = document.getElementById('cursor-trail');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            let points = [];
            const maxPoints = 25;
            let mouseX = 0, mouseY = 0;
            
            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);
            
            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                points.push({ x: mouseX, y: mouseY, age: 0 });
            });
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Age points and remove old ones
                points = points.filter(p => p.age < maxPoints);
                
                if (points.length > 1) {
                    // Draw smooth trailing path line
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    
                    for (let i = 1; i < points.length; i++) {
                        const xc = (points[i].x + points[i - 1].x) / 2;
                        const yc = (points[i].y + points[i - 1].y) / 2;
                        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
                    }
                    
                    ctx.strokeStyle = 'rgba(0, 255, 135, 0.45)';
                    ctx.lineWidth = 2.0;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                    
                    // Draw trailing nodes
                    for (let i = 0; i < points.length; i++) {
                        const p = points[i];
                        const alpha = (1 - p.age / maxPoints) * 0.35;
                        ctx.fillStyle = '#00FF87';
                        ctx.globalAlpha = alpha;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, (1 - p.age / maxPoints) * 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                points.forEach(p => p.age++);
                requestAnimationFrame(animate);
            }
            animate();
        }
        initCursorTrail();

        // ── Custom Cursor snapping & movement ──────────────────────────
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorCircle = document.querySelector('.cursor-circle');
        let snapTarget = null;
        
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
            
            // Update CSS variables for mouse-following cinematic spotlight
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
            
            if (snapTarget) {
                const rect = snapTarget.getBoundingClientRect();
                gsap.to(cursorCircle, {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    duration: 0.18,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(cursorCircle, { x: e.clientX, y: e.clientY, duration: 0.15 });
            }
        });

        // Hover scale for standard links / interactive blocks
        document.querySelectorAll('a, button, input, textarea, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!el.classList.contains('magnetic-hover')) {
                    gsap.to(cursorCircle, { scale: 1.8, backgroundColor: 'rgba(0, 255, 135, 0.1)', duration: 0.3 });
                    cursorCircle.classList.remove('mix-blend-difference');
                }
            });
            el.addEventListener('mouseleave', () => {
                if (!el.classList.contains('magnetic-hover')) {
                    gsap.to(cursorCircle, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
                    cursorCircle.classList.add('mix-blend-difference');
                }
            });
        });

        // Snap ring border for magnetic-hover items (nav links & button)
        document.querySelectorAll('.magnetic-hover').forEach(el => {
            el.addEventListener('mouseenter', () => {
                snapTarget = el;
                cursorCircle.classList.remove('mix-blend-difference');
                gsap.to(cursorCircle, {
                    scale: 1,
                    width: el.offsetWidth + 16,
                    height: el.offsetHeight + 16,
                    borderRadius: '4px', // matching brutalist button corner radius
                    backgroundColor: 'rgba(0, 255, 135, 0.06)',
                    borderColor: '#00FF87',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            el.addEventListener('mouseleave', () => {
                snapTarget = null;
                cursorCircle.classList.add('mix-blend-difference');
                gsap.to(cursorCircle, {
                    scale: 1,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    borderColor: '#00FF87',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Three.js Hero Background - Interactive 3D Wireframe Scene (Grid Floor, Mountain Edges, Grid Ceiling, Floating Shapes)
        function initHeroThree() {
            const container = document.getElementById('hero-canvas');
            if (!container) return;

            const scene = new THREE.Scene();
            
            // Neon glowing fog matching the dark brutalist background
            scene.fog = new THREE.FogExp2(0x0c160e, 0.00075);
            
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
            camera.position.set(0, isTouchDevice ? 320 : 260, isTouchDevice ? 1100 : 800);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);

            // 1. Denser Plane Geometry representing the floor terrain grid
            const gridWidth = 3200;
            const gridHeight = 3200;
            const widthSegs = isTouchDevice ? 60 : 100;
            const heightSegs = isTouchDevice ? 60 : 100;
            const geometry = new THREE.PlaneGeometry(gridWidth, gridHeight, widthSegs, heightSegs);
            
            const posAttr = geometry.attributes.position;
            const count = posAttr.count;
            
            // Store original coordinates for relative height wave offsets
            const initialCoords = [];
            for (let i = 0; i < count; i++) {
                initialCoords.push({
                    x: posAttr.getX(i),
                    y: posAttr.getY(i)
                });
            }

            // Material 1: Wireframe Grid Mesh (Phong Material to react to light)
            const meshMaterial = new THREE.MeshPhongMaterial({
                color: 0x00FF87,
                wireframe: true,
                transparent: true,
                opacity: 0.15,
                depthWrite: false,
                shininess: 80,
                specular: 0x00FF87
            });
            const gridMesh = new THREE.Mesh(geometry, meshMaterial);
            gridMesh.rotation.x = -Math.PI / 2; // Lay flat
            scene.add(gridMesh);

            // Material 2: Dot Cloud at the intersections
            const dotMaterial = new THREE.PointsMaterial({
                color: 0x00FF87,
                size: 3.5,
                transparent: true,
                opacity: 0.35,
                sizeAttenuation: true,
                depthWrite: false
            });
            const dotCloud = new THREE.Points(geometry, dotMaterial);
            dotCloud.rotation.x = -Math.PI / 2;
            scene.add(dotCloud);

            // 2. Ceiling Grid Plane (Mirroring the floor corridor)
            const ceilWidth = 3200;
            const ceilHeight = 3200;
            const ceilSegsX = isTouchDevice ? 40 : 64;
            const ceilSegsY = isTouchDevice ? 40 : 64;
            const geometryCeil = new THREE.PlaneGeometry(ceilWidth, ceilHeight, ceilSegsX, ceilSegsY);
            
            const posAttrCeil = geometryCeil.attributes.position;
            const countCeil = posAttrCeil.count;
            
            const initialCoordsCeil = [];
            for (let i = 0; i < countCeil; i++) {
                initialCoordsCeil.push({
                    x: posAttrCeil.getX(i),
                    y: posAttrCeil.getY(i)
                });
            }

            const ceilMaterial = new THREE.MeshPhongMaterial({
                color: 0x00FF87,
                wireframe: true,
                transparent: true,
                opacity: 0.08, // Fainter to maintain visual hierarchy
                depthWrite: false,
                shininess: 40,
                specular: 0x00FF87
            });
            const ceilMesh = new THREE.Mesh(geometryCeil, ceilMaterial);
            ceilMesh.rotation.x = Math.PI / 2; // Face down
            ceilMesh.position.y = 480;
            scene.add(ceilMesh);

            // ─────────────────────────────────────────────────────────────
            // CINEMATIC LIGHTING SUITE
            // ─────────────────────────────────────────────────────────────
            const ambientLight = new THREE.AmbientLight(0x0c160e, 0.6);
            scene.add(ambientLight);

            // Pulsing Point Light in the center
            const pointLight = new THREE.PointLight(0x00FF87, 80000, 1500);
            pointLight.position.set(0, 200, 0);
            scene.add(pointLight);

            // Panning Spot Light (Searchlight sweeping the wireframe terrain)
            const spotLight = new THREE.SpotLight(0x00FF87, 250000, 2000, Math.PI / 5, 0.6, 1);
            spotLight.position.set(0, 800, 400);
            scene.add(spotLight);
            
            const spotTarget = new THREE.Object3D();
            spotTarget.position.set(0, 0, 0);
            scene.add(spotTarget);
            spotLight.target = spotTarget;

            // 3. Floating SVG Logos (JS, HTML5, GitHub)
            // Clean edge lines
            const lineMat1 = new THREE.LineBasicMaterial({ color: 0x00FF87, transparent: true, opacity: 0.22 });
            const lineMat2 = new THREE.LineBasicMaterial({ color: 0x00FF87, transparent: true, opacity: 0.22 });
            const lineMat3 = new THREE.LineBasicMaterial({ color: 0x00FF87, transparent: true, opacity: 0.22 });

            // Glassy solid body
            const glassMat1 = new THREE.MeshPhysicalMaterial({ color: 0x071009, transparent: true, opacity: 0.7, transmission: 0.5, roughness: 0.2, metalness: 0.8, emissive: 0x00FF87, emissiveIntensity: 0.05 });
            const glassMat2 = new THREE.MeshPhysicalMaterial({ color: 0x071009, transparent: true, opacity: 0.7, transmission: 0.5, roughness: 0.2, metalness: 0.8, emissive: 0x00FF87, emissiveIntensity: 0.05 });
            const glassMat3 = new THREE.MeshPhysicalMaterial({ color: 0x071009, transparent: true, opacity: 0.7, transmission: 0.5, roughness: 0.2, metalness: 0.8, emissive: 0x00FF87, emissiveIntensity: 0.05 });

            const shape1 = new THREE.Group();
            const shape2 = new THREE.Group();
            const shape3 = new THREE.Group();

            // Store references so the animation loop can easily find them and manipulate their materials
            shape1.userData = { isLogo: true, lineMat: lineMat1, glassMat: glassMat1 };
            shape2.userData = { isLogo: true, lineMat: lineMat2, glassMat: glassMat2 };
            shape3.userData = { isLogo: true, lineMat: lineMat3, glassMat: glassMat3 };

            shape1.position.set(isTouchDevice ? -120 : -350, 120, 100);
            shape2.position.set(0, isTouchDevice ? 240 : 180, -200);
            shape3.position.set(isTouchDevice ? 120 : 350, 140, 50);

            scene.add(shape1);
            scene.add(shape2);
            scene.add(shape3);

            const svgLoader = new SVGLoader();
            function loadSVGIntoGroup(url, targetGroup, lineMat, glassMat, scale = 0.25) {
                svgLoader.load(url, (data) => {
                    const paths = data.paths;
                    const innerGroup = new THREE.Group();
                    innerGroup.scale.set(scale, -scale, scale);
                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

                    for (let i = 0; i < paths.length; i++) {
                        const path = paths[i];
                        const shapes = path.toShapes(true);
                        for (let j = 0; j < shapes.length; j++) {
                            const geometry = new THREE.ExtrudeGeometry(shapes[j], { depth: 40, bevelEnabled: true, bevelThickness: 4, bevelSize: 2, bevelSegments: 3 });
                            geometry.computeBoundingBox();
                            minX = Math.min(minX, geometry.boundingBox.min.x);
                            minY = Math.min(minY, geometry.boundingBox.min.y);
                            maxX = Math.max(maxX, geometry.boundingBox.max.x);
                            maxY = Math.max(maxY, geometry.boundingBox.max.y);

                            const edgesGeom = new THREE.EdgesGeometry(geometry, 15);
                            const edgeLines = new THREE.LineSegments(edgesGeom, lineMat);
                            
                            const solidMesh = new THREE.Mesh(geometry, glassMat);
                            solidMesh.add(edgeLines);
                            innerGroup.add(solidMesh);
                        }
                    }
                    if (minX !== Infinity) {
                        const cx = (minX + maxX) / 2;
                        const cy = (minY + maxY) / 2;
                        innerGroup.children.forEach(mesh => mesh.position.set(-cx, -cy, -20));
                        targetGroup.add(innerGroup);
                    }
                });
            }

            loadSVGIntoGroup('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/brands/js.svg', shape1, lineMat1, glassMat1, 0.4);
            loadSVGIntoGroup('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/brands/html5.svg', shape2, lineMat2, glassMat2, 0.45);
            loadSVGIntoGroup('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/brands/github.svg', shape3, lineMat3, glassMat3, 0.4);

            // Mouse tracking
            let mouse = { x: 0, y: 0 };
            let targetMouse = { x: 0, y: 0 };
            const raycaster = new THREE.Raycaster();
            const mouseVec = new THREE.Vector2();
            let localMousePoint = null;

            window.addEventListener('mousemove', (e) => {
                if (isTouchDevice) return;
                targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            });

            // Bind individual shape & camera movements to GSAP ScrollTrigger for 3D Travel Effect
            gsap.to(camera.position, {
                y: 400,
                z: 1100,
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            gsap.to(shape1.position, {
                x: isTouchDevice ? -200 : -650,
                y: -100,
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            gsap.to(shape2.position, {
                y: isTouchDevice ? -150 : -250,
                z: -450,
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            gsap.to(shape3.position, {
                x: isTouchDevice ? 200 : 650,
                y: -100,
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);

                // Smoothly interpolate mouse coordinates for rotation tilt
                mouse.x += (targetMouse.x - mouse.x) * 0.05;
                mouse.y += (targetMouse.y - mouse.y) * 0.05;

                // Tilt floor grid gently based on mouse cursor position
                gridMesh.rotation.y = mouse.x * 0.12;
                gridMesh.rotation.x = -Math.PI / 2 + mouse.y * 0.08;
                
                // Sync dotCloud rotation
                dotCloud.rotation.y = gridMesh.rotation.y;
                dotCloud.rotation.x = gridMesh.rotation.x;

                // Tilt ceiling grid in opposite offset
                ceilMesh.rotation.y = -mouse.x * 0.08;
                ceilMesh.rotation.x = Math.PI / 2 - mouse.y * 0.06;

                // Raycast to find local intersection coordinate on the grid mesh
                mouseVec.x = targetMouse.x;
                mouseVec.y = targetMouse.y;
                raycaster.setFromCamera(mouseVec, camera);
                
                // Intersection check on floor grid
                const intersects = raycaster.intersectObject(gridMesh);
                if (intersects.length > 0) {
                    localMousePoint = intersects[0].point;
                } else {
                    localMousePoint = null;
                }

                // Intersection check on floating shapes (Spin fast & glow on hover!)
                const intersectsShapes = raycaster.intersectObjects([shape1, shape2, shape3], true);
                let hoveredShape = null;
                if (intersectsShapes.length > 0) {
                    let obj = intersectsShapes[0].object;
                    // Walk up the tree to find the parent Group that has userData.isLogo
                    while (obj && !obj.userData.isLogo && obj.parent && obj.parent !== scene) {
                        obj = obj.parent;
                    }
                    if (obj && obj.userData && obj.userData.isLogo) {
                        hoveredShape = obj;
                    }
                }

                const time = clock.getElapsedTime() * 1.2;

                // Update Cinematic Lights
                pointLight.intensity = 1.6 + Math.sin(time * 1.8) * 0.4;
                spotLight.position.x = Math.sin(time * 0.4) * 500;
                spotLight.position.z = 300 + Math.cos(time * 0.4) * 300;
                spotTarget.position.x = -Math.sin(time * 0.4) * 300;

                // Update Floor Grid Vertices (Waves + Mountain ridges + Cursor ripple)
                const posAttr = geometry.attributes.position;
                for (let i = 0; i < count; i++) {
                    const orig = initialCoords[i];
                    
                    // Wave layer 1: broad slow rolling swell
                    let z = Math.sin(orig.x * 0.003 + time) * 35 + Math.cos(orig.y * 0.003 + time) * 35;
                    // Wave layer 2: faster micro ripples
                    z += Math.sin(orig.x * 0.01 - time * 1.5) * 12;
                    z += Math.cos(orig.y * 0.012 + time) * 8;

                    // Mountain ridges along the edges (x = left/right boundary)
                    const distFromCenter = Math.abs(orig.x);
                    if (distFromCenter > 450) {
                        const ridgeFactor = (distFromCenter - 450) / 1150; // normalized edge distance
                        // Generate digital mountains rising up
                        z += Math.pow(ridgeFactor, 1.5) * 280 * (Math.sin(orig.y * 0.008) * 0.4 + 0.6) * (Math.cos(orig.x * 0.005) * 0.5 + 0.5);
                        z += Math.sin(orig.y * 0.02 + time * 1.5) * 15 * ridgeFactor;
                    }

                    // Wave layer 3: mouse proximity wave distortion
                    if (localMousePoint) {
                        const localPoint = gridMesh.worldToLocal(localMousePoint.clone());
                        const dx = orig.x - localPoint.x;
                        const dy = orig.y - localPoint.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 450) {
                            const normalizedDist = dist / 450;
                            const rippleForce = (1 - normalizedDist) * 75;
                            z += Math.sin(dist * 0.02 - time * 4) * rippleForce;
                        }
                    }

                    posAttr.setZ(i, z);
                }
                posAttr.needsUpdate = true;

                // Update Ceiling Grid Vertices (Waves)
                const posAttrCeilUpdate = geometryCeil.attributes.position;
                for (let i = 0; i < countCeil; i++) {
                    const orig = initialCoordsCeil[i];
                    let z = Math.sin(orig.x * 0.002 - time * 0.8) * 20 + Math.cos(orig.y * 0.002 - time * 0.8) * 20;
                    posAttrCeilUpdate.setZ(i, z);
                }
                posAttrCeilUpdate.needsUpdate = true;

                // Update Floating Shapes (Float + Spin + Raycast Hover logic)
                const targetScaleHover = new THREE.Vector3(1.35, 1.35, 1.35);
                const targetScaleNormal = new THREE.Vector3(1, 1, 1);

                // Shape 1 (JS)
                shape1.position.y = 120 + Math.sin(time * 0.7) * 25;
                if (hoveredShape === shape1) {
                    shape1.rotation.x += 0.04;
                    shape1.rotation.y += 0.04;
                    shape1.userData.lineMat.opacity = 0.8;
                    shape1.userData.glassMat.emissiveIntensity = 0.35;
                    shape1.scale.lerp(targetScaleHover, 0.1);
                    document.body.style.cursor = 'pointer';
                } else {
                    shape1.rotation.x += 0.006;
                    shape1.rotation.y += 0.008;
                    shape1.userData.lineMat.opacity = 0.22;
                    shape1.userData.glassMat.emissiveIntensity = 0.05;
                    shape1.scale.lerp(targetScaleNormal, 0.1);
                }

                // Shape 2 (HTML5)
                shape2.position.y = 180 + Math.cos(time * 0.5) * 30;
                if (hoveredShape === shape2) {
                    shape2.rotation.x += 0.04;
                    shape2.rotation.y += 0.04;
                    shape2.userData.lineMat.opacity = 0.8;
                    shape2.userData.glassMat.emissiveIntensity = 0.35;
                    shape2.scale.lerp(targetScaleHover, 0.1);
                    document.body.style.cursor = 'pointer';
                } else {
                    shape2.rotation.x -= 0.005;
                    shape2.rotation.y += 0.007;
                    shape2.userData.lineMat.opacity = 0.22;
                    shape2.userData.glassMat.emissiveIntensity = 0.05;
                    shape2.scale.lerp(targetScaleNormal, 0.1);
                }

                // Shape 3 (GitHub)
                shape3.position.y = 140 + Math.sin(time * 0.9) * 20;
                if (hoveredShape === shape3) {
                    shape3.rotation.x += 0.04;
                    shape3.rotation.y += 0.04;
                    shape3.userData.lineMat.opacity = 0.8;
                    shape3.userData.glassMat.emissiveIntensity = 0.35;
                    shape3.scale.lerp(targetScaleHover, 0.1);
                    document.body.style.cursor = 'pointer';
                } else {
                    shape3.rotation.x += 0.008;
                    shape3.rotation.z -= 0.005;
                    shape3.userData.lineMat.opacity = 0.22;
                    shape3.userData.glassMat.emissiveIntensity = 0.05;
                    shape3.scale.lerp(targetScaleNormal, 0.1);
                }

                if (!hoveredShape) {
                    document.body.style.cursor = 'default';
                }

                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }
        initHeroThree();

        // Main Animations — full GSAP suite
        function initAnimations() {

            // ─────────────────────────────────────────────────────────────
            // GEOLOCATION WIDGET
            // ─────────────────────────────────────────────────────────────
            const geoDisplay = document.getElementById('geo-location-display');
            const geoStatus = document.getElementById('geo-status');
            const geoIndicator = document.getElementById('geo-indicator');
            
            if (geoDisplay && geoStatus && geoIndicator) {
                // Using hardcoded Madurai location
                setTimeout(() => {
                    geoIndicator.classList.remove('animate-pulse');
                    geoIndicator.style.boxShadow = '0 0 10px #00FF87';
                    
                    const targetText = `9.9252° N, 78.1198° E // MADURAI_CORE`;
                    
                    geoDisplay.innerText = targetText;
                    geoStatus.innerText = "SYS_STATUS: UPLINK_ESTABLISHED";
                    
                    // Flash effect
                    gsap.fromTo(geoDisplay, { color: '#fff' }, { color: '#00FF87', duration: 1 });
                }, 800);
            }

            // ─────────────────────────────────────────────────────────────
            // HERO
            // ─────────────────────────────────────────────────────────────
            // Words slide up from behind mask
            gsap.to('.hero-word', {
                y: '0%',
                duration: 1.2,
                stagger: 0.08,
                ease: 'power4.out',
                delay: 0.2
            });

            // Subtitle & other text reveals
            gsap.from('.reveal-stagger', {
                y: 32,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.6,
                stagger: 0.15
            });

            // Scroll indicator fades in
            gsap.from('section .absolute.bottom-12', {
                opacity: 0,
                y: 16,
                duration: 0.9,
                ease: 'power3.out',
                delay: 1.2
            });

            // Scroll Progress
            gsap.to('#scroll-progress', {
                width: '100%',
                ease: 'none',
                scrollTrigger: { 
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0 
                }
            });

            // Hero Canvas Portal Zoom
            gsap.to('#hero-canvas', {
                scale: 2.2,
                opacity: 0,
                scrollTrigger: {
                    trigger: '#hero-canvas',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // 2-Column Scale & Parallax
            const rows = gsap.utils.toArray('.project-row');
            
            rows.forEach((row, index) => {
                const card = row.querySelector('.project-card');
                const info = row.querySelector('.project-info');
                const img = row.querySelector('.project-img');

                // Clear any previous transform clutter
                gsap.set([card, info, img], { clearProps: 'all' });

                // Animate Card Entrance
                if (card) {
                    gsap.fromTo(card, 
                        {
                            y: 100,
                            opacity: 0,
                            scale: 0.95,
                            filter: 'blur(5px)'
                        },
                        {
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            filter: 'blur(0px)',
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: row,
                                start: 'top 85%',
                                end: 'top 50%',
                                scrub: 1
                            }
                        }
                    );
                }

                // Animate Typography Info Entrance Staggered
                if (info) {
                    gsap.set(info, { perspective: 1000 }); // Add 3D perspective to parent
                    const textElements = info.children;
                    
                    gsap.fromTo(textElements, 
                        {
                            y: 60,
                            opacity: 0,
                            rotationX: -30
                        },
                        {
                            y: 0,
                            opacity: 1,
                            rotationX: 0,
                            stagger: 0.15, // Creates the beautiful cascade effect
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: row,
                                start: 'top 80%',
                                end: 'top 30%',
                                scrub: 1.5
                            }
                        }
                    );
                }

                // Subtle Image Parallax inside the card window
                if (img) {
                    gsap.fromTo(img, 
                        { y: '-15%' },
                        {
                            y: '15%',
                            ease: 'none',
                            scrollTrigger: {
                                trigger: row,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: true
                            }
                        }
                    );
                }
            });

            // Work title scroll reveal
            gsap.from('#projects-title', {
                x: -150,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: { trigger: '#work', start: 'top 80%', scrub: 1 }
            });

            // ─────────────────────────────────────────────────────────────
            // ABOUT
            // ─────────────────────────────────────────────────────────────
            // Staggered text mask reveal on scroll (wiping gradient from left to right)
            document.querySelectorAll('.reveal-line').forEach(line => {
                gsap.to(line, {
                    backgroundPosition: '0% 0%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 85%',
                        end: 'top 65%',
                        scrub: true
                    }
                });
            });

            // SVG Scroll Path Drawing
            const path = document.getElementById('scroll-path');
            if (path) {
                const pathLength = path.getTotalLength();
                gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
                gsap.to(path, {
                    strokeDashoffset: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#about',
                        start: 'top 50%',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }

            // Big "01" number parallax (unique target)
            gsap.to('#about-bg-num', {
                y: -25,
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            // About image container slide-in
            gsap.from('#about-image-container', {
                x: 80,
                opacity: 0,
                scale: 0.95,
                duration: 1.4,
                ease: 'power3.out',
                scrollTrigger: { trigger: '#about', start: 'top 75%' }
            });

            // About description paragraph
            gsap.from('#about-text > p', {
                y: 28,
                opacity: 0,
                duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: { trigger: '#about-text', start: 'top 82%' }
            });

            // ─────────────────────────────────────────────────────────────
            // EXPERTISE (Vertical Stacking Cards)
            // ─────────────────────────────────────────────────────────────
            const stackCards = gsap.utils.toArray('.stack-card');
            stackCards.forEach((card, index) => {
                // Stacking animation for sticky cards
                if (index !== 0) {
                    gsap.from(card, {
                        yPercent: 110,
                        opacity: 0.8,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom',
                            end: 'top top',
                            scrub: true,
                            onUpdate: (self) => {
                                const prevCard = stackCards[index - 1];
                                if (prevCard) {
                                    gsap.set(prevCard, {
                                        scale: 1 - self.progress * 0.05,
                                        opacity: 1 - self.progress * 0.3
                                    });
                                }
                            }
                        }
                    });
                }

                // Progress bars & numbers dynamic count-up on entry
                const progress = card.querySelector('.absolute.h-full');
                const percent = card.querySelector('.font-display-2xl');
                
                if (progress && percent) {
                    const targetPercent = parseInt(percent.innerText);
                    percent.innerText = "0%";
                    const countObj = { val: 0 };
                    
                    gsap.fromTo(progress, 
                        { width: '0%' },
                        {
                            width: targetPercent + '%',
                            duration: 1.8,
                            ease: 'power3.out',
                            scrollTrigger: { trigger: card, start: 'top 75%' }
                        }
                    );
                    
                    gsap.to(countObj, {
                        val: targetPercent,
                        duration: 1.8,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 75%' },
                        onUpdate: () => {
                            percent.innerText = Math.floor(countObj.val) + '%';
                        }
                    });
                }
            });



            // Text Scramble Expertise
            const skillTrigger = document.getElementById('skills-trigger');
            const originalText = skillTrigger.innerText;
            skillTrigger.addEventListener('mouseenter', () => {
                gsap.to(skillTrigger, {
                    duration: 0.5,
                    text: { value: "01011101", padSpace: true },
                    ease: "none"
                });
            });
            skillTrigger.addEventListener('mouseleave', () => {
                gsap.to(skillTrigger, {
                    duration: 0.5,
                    text: { value: originalText, padSpace: true },
                    ease: "none"
                });
            });

            // ─────────────────────────────────────────────────────────────
            // CONTACT
            // ─────────────────────────────────────────────────────────────
            // "LET'S TALK" reveal
            gsap.from('#contact-title', {
                y: 50,
                opacity: 0,
                scale: 0.95,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: { trigger: '#contact', start: 'top 75%' }
            });

            // Contact details reveal
            gsap.from('#contact-left > div', {
                y: 30,
                opacity: 0,
                stagger: 0.12,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: { trigger: '#contact-left', start: 'top 80%' }
            });

            // Form reveal
            gsap.from('#contact form', {
                x: 40,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: { trigger: '#contact form', start: 'top 80%' }
            });

            // Footer typing
            gsap.to("#footer-typewriter", {
                duration: 3,
                text: "MADE WITH HEART AND CODE",
                ease: "none",
                repeat: -1,
                repeatDelay: 2,
                yoyo: true
            });
        }

        // Project Card 3D Tilt Effect
        function initProjectCardTilt() {
            if (isTouchDevice) return; // Disable heavy hover filters on mobile to guarantee smooth scroll
            const cards = document.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                const setRotX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
                const setRotY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });
                
                // Absolute positioned details layer
                const textLayer = card.querySelector('.absolute.bottom-12.left-12');
                const setTransZ = textLayer ? gsap.quickTo(textLayer, 'z', { duration: 0.4, ease: 'power2.out' }) : null;

                gsap.set(card, { transformPerspective: 1000, transformStyle: 'preserve-3d' });
                if (textLayer) {
                    gsap.set(textLayer, { transformStyle: 'preserve-3d', z: 0 });
                }

                // Retrieve SVG displacement map for this card
                const map = document.querySelector(`#liquid-distortion-${index + 1} .disp-map`);

                // Text scrambler for project title
                const title = card.querySelector('h3');
                let scrambler = null;
                let originalText = "";
                if (title) {
                    originalText = title.innerText;
                    scrambler = new TextScrambler(title);
                }

                card.addEventListener('mouseenter', () => {
                    // Trigger text scramble
                    if (scrambler) scrambler.setText(originalText);
                    
                    // Ripple displacement scale warp on entry
                    if (map) {
                        gsap.fromTo(map, 
                            { attr: { scale: 65 } },
                            { attr: { scale: 0 }, duration: 1.2, ease: 'power2.out' }
                        );
                    }
                });

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = (e.clientX - cx) / (rect.width / 2);  // range -1 to 1
                    const dy = (e.clientY - cy) / (rect.height / 2); // range -1 to 1

                    setRotY(dx * 12);  // tilt up to 12 degrees
                    setRotX(-dy * 12); // tilt up to 12 degrees
                    if (setTransZ) setTransZ(45); // push text forward in 3D space
                });

                card.addEventListener('mouseleave', () => {
                    setRotX(0);
                    setRotY(0);
                    if (setTransZ) setTransZ(0);

                    // Ripple displacement scale warp on exit
                    if (map) {
                        gsap.fromTo(map, 
                            { attr: { scale: 45 } },
                            { attr: { scale: 0 }, duration: 1.0, ease: 'power2.out' }
                        );
                    }
                });
            });
        }

        // Magnetic Logic
        if (!isTouchDevice) {
            document.querySelectorAll('.magnetic-hover').forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
                });
                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
                });
            });
        }

        // ── Contact Form Keystroke Logger Terminal ──────────────────
        function initContactTerminal() {
            const terminal = document.getElementById('contact-terminal');
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const msgInput = document.getElementById('contact-message');
            
            if (!terminal || !nameInput || !emailInput || !msgInput) return;
            
            function logLine(type, msg) {
                const time = new Date().toLocaleTimeString().split(' ')[0];
                const line = document.createElement('div');
                line.className = 'opacity-0 transition-opacity duration-200';
                line.innerHTML = `<span class="text-[#00FF87]">[ ${time} ]</span> <span class="text-white">${type}</span>: ${msg}`;
                terminal.appendChild(line);
                // Force layout reflow then transition opacity
                setTimeout(() => line.classList.remove('opacity-0'), 10);
                
                // Keep history trimmed to avoid overflow
                while (terminal.children.length > 8) {
                    terminal.removeChild(terminal.firstChild);
                }
                terminal.scrollTop = terminal.scrollHeight;
            }

            [nameInput, emailInput, msgInput].forEach(input => {
                input.addEventListener('focus', () => {
                    logLine('CONN_FOCUS', `Field #${input.id.replace('contact-', '')} active. Awaiting keystrokes.`);
                });
                
                input.addEventListener('blur', () => {
                    logLine('CONN_BLUR', `Field #${input.id.replace('contact-', '')} released.`);
                });
                
                input.addEventListener('input', (e) => {
                    const char = e.data || '[backspace]';
                    const length = input.value.length;
                    logLine('SYS_KEY', `Char "${char}" registered. Buffer: ${length} chars.`);
                });
            });
        }
        initContactTerminal();

        // Toast
        function showToast() {
            const toast = document.getElementById('toast');
            if (toast) {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }
        }

        // Handle Contact Form Submission via FormSubmit AJAX
        const contactForm = document.getElementById('contact-form') as HTMLFormElement;
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Optional: Change button text to indicate loading
                const submitBtn = contactForm.querySelector('button[type="submit"] span') as HTMLElement;
                const originalText = submitBtn ? submitBtn.innerText : 'SEND MESSAGE';
                if (submitBtn) submitBtn.innerText = 'TRANSMITTING...';

                const formData = new FormData(contactForm);

                fetch('https://formsubmit.co/ajax/afrederick0005@gmail.com', {
                    method: 'POST',
                    headers: { 
                        'Accept': 'application/json'
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    showToast();
                    contactForm.reset();
                    if (submitBtn) submitBtn.innerText = originalText;
                })
                .catch(error => {
                    console.error('Form submission error:', error);
                    if (submitBtn) submitBtn.innerText = 'ERROR';
                    setTimeout(() => {
                        if (submitBtn) submitBtn.innerText = originalText;
                    }, 3000);
                });
            });
        }

        // Mobile Menu Logic
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        let menuOpen = false;

        if (mobileMenuBtn && mobileMenu) {
            const lines = mobileMenuBtn.querySelectorAll('span');
            
            const toggleMenu = () => {
                menuOpen = !menuOpen;
                
                // Animate hamburger icon to X
                if (menuOpen) {
                    gsap.to(lines[0], { y: 5, rotation: 45, duration: 0.3, ease: 'power2.inOut' });
                    gsap.to(lines[1], { y: -5, rotation: -45, duration: 0.3, ease: 'power2.inOut' });
                    
                    // Show menu
                    gsap.to(mobileMenu, { autoAlpha: 1, duration: 0.3 });

                    // Stagger links
                    gsap.fromTo(mobileNavLinks, 
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
                    );
                    
                    // Stop lenis scroll
                    lenis.stop();
                } else {
                    gsap.to(lines[0], { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
                    gsap.to(lines[1], { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
                    
                    // Hide menu
                    gsap.to(mobileMenu, { autoAlpha: 0, duration: 0.3 });

                    
                    // Start lenis scroll
                    lenis.start();
                }
            };

            mobileMenuBtn.addEventListener('click', toggleMenu);

            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (menuOpen) toggleMenu();
                });
            });
        }
