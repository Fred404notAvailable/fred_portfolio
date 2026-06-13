# 🚀 Antigravity Agent Prompt — Animated Web Developer Portfolio

> Paste this into the **Agent Manager → New Task** in Google Antigravity.
> Works best with **Gemini 3.1 Pro** model selected.
> Set **Artifact Review Policy → "Asks for Review"** before running so you can approve the implementation plan before code is written.

---

## 🎯 MISSION BRIEF

You are building a **cinematic, award-level personal portfolio website** for a full-stack web developer. This is not a template — it is a hand-crafted, deeply animated, premium experience that should feel like it belongs on Awwwards. Every section must have purposeful, smooth animation that communicates craft and technical mastery.

**Project folder:** `./portfolio`
**Output:** A complete, working, single-page HTML/CSS/JS website
**Deploy target:** Static hosting (no backend needed)

---

## 📋 IMPLEMENTATION PLAN INSTRUCTIONS

Before writing any code, produce an **Implementation Plan** with:
1. File structure (list every file you will create)
2. Library CDN links you will use (GSAP, Lenis, Three.js)
3. Section-by-section animation strategy
4. Mobile responsiveness approach
5. Performance considerations

**Wait for my approval on the plan before writing code.**

---

## 🗂 FILE STRUCTURE TO CREATE

```
portfolio/
├── index.html          ← Main HTML, all sections
├── style.css           ← All styles + CSS variables + keyframes
├── main.js             ← Entry point, initializes all modules
├── preloader.js        ← Preloader animation logic
├── cursor.js           ← Custom cursor tracking + effects
├── hero.js             ← Three.js particle scene + hero animations
├── animations.js       ← All GSAP ScrollTrigger section animations
└── utils.js            ← Helpers: lerp, clamp, text scramble, clipboard
```

---

## 📦 LIBRARIES (load via CDN in index.html `<head>`)

```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">

<!-- GSAP Core + Plugins -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js"></script>

<!-- Lenis Smooth Scroll -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>

<!-- Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

---

## 🎨 DESIGN TOKENS (define as CSS variables in `:root`)

```css
:root {
  --bg:           #080808;
  --surface:      #111111;
  --text:         #F0EDE6;
  --muted:        #555555;
  --accent:       #00FF87;       /* neon green — primary accent */
  --accent-2:     #FF3366;       /* hot pink — used sparingly */
  --font-display: 'Syne', sans-serif;
  --font-mono:    'Space Mono', monospace;
  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:  cubic-bezier(0.87, 0, 0.13, 1);
  --transition:   0.4s var(--ease-out);
  --radius:       4px;
}
```

**Typography scale:**
- Hero headline: `clamp(60px, 10vw, 140px)`, Syne ExtraBold, `line-height: 0.9`
- Section titles: `clamp(40px, 6vw, 90px)`, Syne Bold
- Body: `16–18px`, Syne Regular, `line-height: 1.7`
- Labels/tags: `12–13px`, Space Mono, `letter-spacing: 0.1em`, uppercase

---

## 🔢 SECTION 1 — PRELOADER (`preloader.js`)

Build a full-screen preloader that plays for ~2.5 seconds.

**Step-by-step behavior:**

1. **On DOM load:** A black `#preloader` div covers the full viewport (`position: fixed`, `z-index: 9999`)

2. **Counter animation:** A centered number counts from `0` → `100` using `setInterval` (increment every ~22ms for ~2.2s total). Format with leading zero for single digits (`07`, `38`). Font: Syne ExtraBold, `font-size: clamp(80px, 15vw, 200px)`, color `var(--text)`.

3. **Glitch flicker:** Every ~300ms, briefly apply a CSS class `.glitch` to the counter that:
   - Slightly offsets a `::before` pseudo-element copy in `var(--accent)` color
   - Lasts only `80ms` then removes the class

4. **Progress bar:** A 2px bar at the bottom of the preloader, `background: var(--accent)`, animates `scaleX` from `0` → `1` over 2.2s, `transform-origin: left`, `ease: "none"` (linear).

5. **Background code vapor:** 5 `<span>` elements containing ASCII snippets (`const`, `=>`, `</>`, `{}`, `[]`) positioned randomly, font `Space Mono`, `opacity: 0.08`, float upward with `keyframes: translateY(0) → translateY(-80px)`, staggered `animation-delay`.

6. **Curtain reveal (at 100%):** Use a GSAP timeline:
   ```js
   const tl = gsap.timeline();
   tl.to('#preloader-top', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
     .to('#preloader-bottom', { yPercent: 100, duration: 0.9, ease: 'expo.inOut' }, '<')
     .set('#preloader', { display: 'none' })
     .add(() => initSite()); // triggers all other animations
   ```
   The preloader should be split into two halves (`#preloader-top`, `#preloader-bottom`) that slide apart.

---

## 🌌 SECTION 2 — HERO (`hero.js` + `index.html`)

### Three.js Particle Background
- Create a `<canvas id="hero-canvas">` behind the hero content (`position: absolute, z-index: 0`)
- Spawn **1,800 particles** as `THREE.Points` with `THREE.BufferGeometry`
- Particle color: `0x00FF87` (accent green), size `1.5`, `transparent: true`
- Gentle drift: in `animate()` loop, rotate the particle group slightly: `particles.rotation.y += 0.0003`
- **Mouse parallax:** Track `mousemove`, map mouse position to `[-1, 1]` range, apply to camera position: `camera.position.x += (targetX - camera.position.x) * 0.05`

### HTML Structure
```html
<section id="hero">
  <canvas id="hero-canvas"></canvas>
  <nav id="navbar">
    <div class="logo"><!-- SVG draw-on logo --></div>
    <ul class="nav-links">
      <li><a href="#work" data-magnetic>Work</a></li>
      <li><a href="#about" data-magnetic>About</a></li>
      <li><a href="#skills" data-magnetic>Skills</a></li>
      <li><a href="#contact" data-magnetic>Contact</a></li>
    </ul>
  </nav>
  <div class="hero-content">
    <span class="hero-label">Full-Stack Developer · Available for Work</span>
    <h1 class="hero-headline">
      <span class="line" data-split>CRAFTING</span>
      <span class="line outline" data-split>DIGITAL</span>
      <span class="line" data-split>WORLDS<span class="dot">.</span></span>
    </h1>
    <a href="#work" class="cta-btn">View My Work <span>↓</span></a>
  </div>
  <div class="scroll-indicator">
    <div class="scroll-line"></div>
    <span>SCROLL</span>
  </div>
</section>
```

### Hero Animations (run after preloader reveals site):
1. **Logo SVG draw-on:** Set `stroke-dasharray` and `stroke-dashoffset` to path length, then GSAP tween `strokeDashoffset` from `pathLength → 0`, duration `1.2s`, `ease: power2.inOut`

2. **Headline character stagger:** Split each `.line` into individual `<span>` chars. Animate each char:
   ```js
   gsap.from(chars, {
     y: -80, opacity: 0, stagger: 0.04,
     duration: 0.8, ease: 'back.out(1.4)', delay: 0.3
   });
   ```

3. **Nav links fade in:** `gsap.from('.nav-links li', { y: -20, opacity: 0, stagger: 0.1, duration: 0.6, delay: 1 })`

4. **CTA button:** `gsap.from('.cta-btn', { y: 30, opacity: 0, duration: 0.8, delay: 1.3 })`

5. **Scroll indicator:** Pulse animation — the `.scroll-line` does a looping `scaleY: 0→1→0` with `transformOrigin: top`, `repeat: -1`, `duration: 1.5`

### Magnetic Nav Links:
For each `[data-magnetic]` element, add mousemove listener:
```js
el.addEventListener('mousemove', (e) => {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.3 });
});
el.addEventListener('mouseleave', () => {
  gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
});
```

### Navbar Smart Behavior:
```js
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: (self) => {
    if (self.direction === 1) gsap.to('#navbar', { padding: '12px 40px', backdropFilter: 'blur(12px)', duration: 0.4 });
    else gsap.to('#navbar', { padding: '24px 40px', backdropFilter: 'blur(0px)', duration: 0.4 });
  }
});
```

### CTA Liquid Fill Hover:
Use a `::before` pseudo-element on `.cta-btn` with `background: var(--accent)`, `scaleY: 0`, `transform-origin: bottom`. On hover: CSS transition `scaleY: 1`.

---

## 🖱 CUSTOM CURSOR (`cursor.js`)

Build a fully custom cursor that replaces the OS cursor (`cursor: none` on `body`).

**HTML (append to body):**
```html
<div id="cursor-dot"></div>
<div id="cursor-circle"></div>
```

**Styles:**
- `#cursor-dot`: `width: 10px; height: 10px; background: var(--accent); border-radius: 50%; position: fixed; pointer-events: none; z-index: 10000; transform: translate(-50%, -50%)`
- `#cursor-circle`: `width: 40px; height: 40px; border: 1.5px solid var(--accent); border-radius: 50%; position: fixed; pointer-events: none; z-index: 10000; transform: translate(-50%, -50%); transition: width 0.3s, height 0.3s`

**JS behavior:**
```js
let mouseX = 0, mouseY = 0;
let circleX = 0, circleY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to('#cursor-dot', { x: mouseX, y: mouseY, duration: 0.1 });
});

// Lerp the circle for lag effect
function updateCursor() {
  circleX += (mouseX - circleX) * 0.12;
  circleY += (mouseY - circleY) * 0.12;
  gsap.set('#cursor-circle', { x: circleX, y: circleY });
  requestAnimationFrame(updateCursor);
}
updateCursor();
```

**Hover states:**
- On hover over `a, button, [data-cursor]`:
  - `#cursor-circle`: scale up to `70px×70px`, `mix-blend-mode: difference`, `background: white`
- On hover over `.project-card`:
  - Show `"VIEW"` text inside `#cursor-circle`
  - Circle expands to `90px×90px`
- On mouse leave: revert all

---

## 📜 SECTION 3 — ABOUT (`animations.js`)

```html
<section id="about">
  <span class="section-number">01</span>
  <div class="about-grid">
    <div class="about-visual">
      <div class="blob-avatar"><!-- SVG morphing blob --></div>
    </div>
    <div class="about-text">
      <h2>I build things<br>for the web.</h2>
      <p class="reveal-line">Full-stack developer with 5+ years of experience crafting performant, accessible, and visually compelling digital products.</p>
      <p class="reveal-line">I specialize in React, Node.js, and creative front-end work — bridging the gap between design vision and technical execution.</p>
      <div class="skill-tags">
        <span>React</span><span>Node.js</span><span>TypeScript</span>
        <span>PostgreSQL</span><span>WebGL</span><span>AWS</span>
      </div>
    </div>
  </div>
</section>
```

**Scroll Animations (ScrollTrigger):**
```js
// Image slides in from left
gsap.from('.about-visual', {
  x: -120, opacity: 0, duration: 1.2, ease: 'expo.out',
  scrollTrigger: { trigger: '#about', start: 'top 75%' }
});

// Text lines clip-reveal (each line masked)
gsap.from('.reveal-line', {
  y: '100%', opacity: 0, stagger: 0.2, duration: 0.9, ease: 'expo.out',
  scrollTrigger: { trigger: '.about-text', start: 'top 80%' }
});

// Section number parallax
gsap.to('.section-number', {
  y: -60,
  scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 2 }
});
```

**Morphing Blob:**
CSS `@keyframes blob-morph` that transitions `border-radius` through 6 states over `8s infinite alternate`, e.g.:
`30% 70% 70% 30% / 30% 30% 70% 70%` → `70% 30% 30% 70% / 70% 70% 30% 30%`

**Skill tag hover:**
`.skill-tags span:hover { background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: #000; transform: scale(1.08); }`

---

## 💼 SECTION 4 — PROJECTS / WORK (`animations.js`)

This is the **horizontal scroll pinned section**.

```html
<section id="work">
  <div class="work-header">
    <h2 class="work-title">SELECTED<br>WORK</h2>
  </div>
  <div class="work-track-wrapper">
    <div class="work-track">
      <!-- 4 project cards -->
      <article class="project-card" data-cursor>
        <div class="card-bg" style="background-image: url('assets/project1.jpg')"></div>
        <div class="card-info">
          <div class="card-line"></div>
          <h3>Project Name</h3>
          <p>Brief description of the project and impact.</p>
          <div class="card-tags"><span>React</span><span>Node</span></div>
        </div>
        <a href="#" class="card-orbit-btn">View <br>Project →</a>
      </article>
      <!-- repeat 3 more cards -->
    </div>
  </div>
</section>
```

**Horizontal scroll setup (GSAP pin):**
```js
const track = document.querySelector('.work-track');
const cards = gsap.utils.toArray('.project-card');

gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth) + 'px',
  ease: 'none',
  scrollTrigger: {
    trigger: '.work-track-wrapper',
    pin: true,
    scrub: 1.5,
    start: 'top top',
    end: () => '+=' + track.scrollWidth
  }
});
```

**Inner image parallax (each card's `.card-bg`):**
```js
cards.forEach(card => {
  const bg = card.querySelector('.card-bg');
  gsap.to(bg, {
    x: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: card,
      containerAnimation: /* the horizontal scroll tween */,
      start: 'left right',
      end: 'right left',
      scrub: true
    }
  });
});
```

**Card line draw-in:**
```js
gsap.from('.card-line', {
  scaleX: 0, transformOrigin: 'left',
  scrollTrigger: { trigger: '.project-card', start: 'left 70%', containerAnimation: scrollTween }
});
```

**Section title slam-in:**
```js
gsap.from('.work-title', {
  x: 200, rotation: 3, opacity: 0, duration: 1, ease: 'expo.out',
  scrollTrigger: { trigger: '#work', start: 'top 80%' }
});
```

**Orbit button on card hover (CSS):**
```css
.card-orbit-btn {
  position: absolute;
  top: 50%; left: 50%;
  width: 90px; height: 90px;
  border: 1px solid var(--accent);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.4s var(--ease-out);
  font: 11px/1.2 var(--font-mono);
  color: var(--accent);
  text-align: center;
}
.project-card:hover .card-orbit-btn { transform: translate(-50%, -50%) scale(1); }
.project-card:hover .card-bg { transform: scale(1.06); }
```

---

## 🛠 SECTION 5 — SKILLS (`animations.js` + `utils.js`)

```html
<section id="skills">
  <h2 class="skills-title" data-scramble>EXPERTISE</h2>
  <div class="marquee-wrapper">
    <div class="marquee marquee-left">
      <span>React</span><span>Node.js</span><span>TypeScript</span>
      <span>PostgreSQL</span><span>Docker</span><span>AWS</span>
      <span>GraphQL</span><span>Redis</span>
      <!-- duplicate set for infinite loop -->
    </div>
    <div class="marquee marquee-right">
      <span>WebGL</span><span>Three.js</span><span>GSAP</span>
      <span>CSS Animation</span><span>Next.js</span><span>REST APIs</span>
      <!-- duplicate set -->
    </div>
  </div>
  <div class="skill-bars">
    <div class="bar-item"><span>HTML / CSS</span><div class="bar" data-width="95"><div class="bar-fill"></div></div><span class="bar-pct">0%</span></div>
    <div class="bar-item"><span>JavaScript</span><div class="bar" data-width="90"><div class="bar-fill"></div></div><span class="bar-pct">0%</span></div>
    <div class="bar-item"><span>React / Next.js</span><div class="bar" data-width="88"><div class="bar-fill"></div></div><span class="bar-pct">0%</span></div>
    <div class="bar-item"><span>Node.js / Backend</span><div class="bar" data-width="82"><div class="bar-fill"></div></div><span class="bar-pct">0%</span></div>
    <div class="bar-item"><span>DevOps / Cloud</span><div class="bar" data-width="70"><div class="bar-fill"></div></div><span class="bar-pct">0%</span></div>
  </div>
</section>
```

**Text scramble effect (`utils.js`):**
```js
function scrambleText(el, finalText) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&';
  let iteration = 0;
  const interval = setInterval(() => {
    el.textContent = finalText.split('').map((char, i) =>
      i < iteration ? char : chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    if (iteration >= finalText.length) clearInterval(interval);
    iteration += 0.5;
  }, 40);
}

ScrollTrigger.create({
  trigger: '[data-scramble]',
  start: 'top 80%',
  once: true,
  onEnter: () => scrambleText(document.querySelector('[data-scramble]'), 'EXPERTISE')
});
```

**Infinite marquee (CSS):**
```css
@keyframes marquee-left  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
.marquee-left  { animation: marquee-left  20s linear infinite; }
.marquee-right { animation: marquee-right 25s linear infinite; }
.marquee-wrapper:hover .marquee { animation-play-state: paused; }
```

**Skill bars — scroll-triggered counter + fill:**
```js
document.querySelectorAll('.bar-item').forEach(item => {
  const fill = item.querySelector('.bar-fill');
  const label = item.querySelector('.bar-pct');
  const target = parseInt(item.querySelector('.bar').dataset.width);

  gsap.to(fill, {
    width: target + '%', duration: 1.4, ease: 'elastic.out(1, 0.6)',
    scrollTrigger: { trigger: item, start: 'top 85%', once: true },
    onUpdate: function() {
      label.textContent = Math.round(this.targets()[0].offsetWidth / item.querySelector('.bar').offsetWidth * 100) + '%';
    }
  });
});
```

---

## 📬 SECTION 6 — CONTACT (`animations.js` + `utils.js`)

```html
<section id="contact">
  <div class="contact-top">
    <h2 class="contact-headline">
      LET'S <span class="fill-word" data-hover-fill>TALK</span>
    </h2>
    <p>Available for freelance projects and full-time roles.</p>
  </div>
  <div class="contact-email">
    <span id="email-text">hello@yourname.dev</span>
    <button id="copy-btn" data-cursor>Copy Email</button>
    <div id="toast">Copied! 📋</div>
  </div>
  <form class="contact-form" id="contact-form">
    <div class="field"><input type="text" id="name" placeholder=" "><label for="name">Name</label></div>
    <div class="field"><input type="email" id="email" placeholder=" "><label for="email">Email</label></div>
    <div class="field"><textarea id="msg" placeholder=" " rows="4"></textarea><label for="msg">Message</label></div>
    <button type="submit" class="submit-btn">
      <span class="btn-text">Send Message</span>
      <span class="btn-spinner"></span>
      <span class="btn-check">✓</span>
    </button>
  </form>
  <div class="social-links">
    <a href="#" aria-label="GitHub">GH</a>
    <a href="#" aria-label="LinkedIn">LI</a>
    <a href="#" aria-label="Twitter">TW</a>
  </div>
</section>
```

**"TALK" hover fill animation (CSS):**
```css
.fill-word { position: relative; -webkit-text-stroke: 2px var(--accent); color: transparent; }
.fill-word::before {
  content: attr(data-hover-fill);  /* JS sets this to same text */
  position: absolute; inset: 0;
  color: var(--accent);
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.6s var(--ease-out);
  -webkit-text-stroke: 0;
}
.fill-word:hover::before { clip-path: inset(0 0% 0 0); }
```
Set `el.setAttribute('data-hover-fill', el.textContent)` in JS.

**Clipboard copy + toast (`utils.js`):**
```js
document.getElementById('copy-btn').addEventListener('click', () => {
  navigator.clipboard.writeText('hello@yourname.dev');
  const toast = document.getElementById('toast');
  gsap.fromTo(toast, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3,
    onComplete: () => gsap.to(toast, { opacity: 0, delay: 1.5, duration: 0.3 })
  });
});
```

**Form field animated underline:**
```css
.field { position: relative; }
.field input, .field textarea { border: none; border-bottom: 1px solid var(--muted); background: transparent; color: var(--text); padding: 16px 0 8px; width: 100%; font-family: var(--font-display); }
.field::after { content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 2px; background: var(--accent); transition: width 0.4s var(--ease-out), left 0.4s var(--ease-out); }
.field:focus-within::after { width: 100%; left: 0; }
```

**Submit button morph (spinner → checkmark):**
On form submit, add class `.loading` to hide `.btn-text`, show spinner (CSS rotate animation), then after 1.5s swap to `.success` class showing `.btn-check`.

**Social links bounce-in:**
```js
gsap.from('.social-links a', {
  y: 30, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(2)',
  scrollTrigger: { trigger: '.social-links', start: 'top 90%' }
});
```

---

## 🖱 SCROLL PROGRESS BAR

Add to top of `<body>`:
```html
<div id="scroll-progress"></div>
```
```css
#scroll-progress {
  position: fixed; top: 0; left: 0; height: 2px;
  background: var(--accent); transform-origin: left;
  transform: scaleX(0); z-index: 10001;
  will-change: transform;
}
```
```js
gsap.to('#scroll-progress', {
  scaleX: 1, ease: 'none',
  scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0 }
});
```

---

## 🌀 LENIS SMOOTH SCROLL SETUP (`main.js`)

```js
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

---

## 🦶 FOOTER

```html
<footer>
  <p class="footer-type" data-typewriter>MADE WITH ♥ AND CODE</p>
  <p>© 2025 YourName · All rights reserved</p>
</footer>
```

Typewriter effect with `TextPlugin`:
```js
gsap.registerPlugin(TextPlugin);
ScrollTrigger.create({
  trigger: 'footer', start: 'top 90%', once: true,
  onEnter: () => gsap.to('[data-typewriter]', { text: 'MADE WITH ♥ AND CODE', duration: 1.5, ease: 'none', delay: 0.3 })
});
```

Add blinking cursor `::after` on `.footer-type` with `animation: blink 1s step-end infinite`.

---

## ⚡ PERFORMANCE REQUIREMENTS

1. All GSAP tweens must animate only `transform` and `opacity` — never `top`, `left`, `width`, `height`
2. Add `will-change: transform` to elements before animation, remove after with `clearProps: 'will-change'`
3. Three.js: use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
4. Wrap all animations in reduced-motion guard:
   ```js
   const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if (!prefersReduced) { /* all animation code here */ }
   ```
5. Debounce scroll and resize listeners

---

## 📱 MOBILE RESPONSIVENESS (≤768px)

- Disable horizontal scroll section → convert to vertical stack of project cards
- Reduce Three.js particles from 1800 → 300
- Disable custom cursor → `body { cursor: auto; }`, hide `#cursor-dot` and `#cursor-circle`
- Two-column layouts → single column, `gap: 40px`
- Hero headline `font-size: clamp(52px, 13vw, 80px)`
- Reduce preloader counter to `font-size: 20vw`

---

## ✅ AGENT TASK CHECKLIST

After writing all code, open the **built-in browser** and verify:

- [ ] Preloader plays and reveals with curtain split
- [ ] Counter increments with glitch flicker
- [ ] Hero particles render and respond to mouse
- [ ] SVG logo draws itself on load
- [ ] Headline characters stagger in letter by letter
- [ ] Magnetic nav links follow cursor
- [ ] Custom cursor dot + circle follow mouse with lag
- [ ] Cursor changes on hover over links and project cards
- [ ] About section text lines reveal on scroll
- [ ] Blob avatar morphs shape continuously
- [ ] Work section pins and scrolls horizontally
- [ ] Project card images parallax in opposite direction
- [ ] Card orbit button appears on hover
- [ ] Text scramble fires on Skills section entry
- [ ] Marquee rows scroll in opposite directions and pause on hover
- [ ] Skill bars animate to target width with counter
- [ ] "TALK" fills with accent color on hover
- [ ] Email copy button shows toast
- [ ] Form fields show underline grow on focus
- [ ] Submit button shows spinner then checkmark
- [ ] Social links bounce in on scroll
- [ ] Footer types itself out
- [ ] Top progress bar fills as page is scrolled
- [ ] Navbar shrinks on scroll down
- [ ] Lenis smooth scroll active throughout
- [ ] All animations disabled when `prefers-reduced-motion: reduce`
- [ ] Site is fully responsive on mobile (375px)
- [ ] No console errors

---

> **Agent note:** Prioritize animation smoothness and visual polish. If any library CDN fails to load, implement a graceful fallback. Use comments in JS files to label each animation block clearly. After completing, generate a **browser recording** of the full scroll-through to verify all animations work in sequence.
