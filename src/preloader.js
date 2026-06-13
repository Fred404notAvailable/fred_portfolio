/**
 * PRELOADER.JS
 * Implements the linear preloader sequence: counter (00-100), glitch flickering,
 * ASCII code drift background, floating code vapor particles, and vertical curtain split reveal.
 */

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('load-counter');
  const loadBar = document.getElementById('load-bar');
  const asciiDrift = document.getElementById('ascii-drift');
  
  if (!preloader || !counterEl) {
    // If elements aren't present, bootstrap immediately
    if (typeof initSite === 'function') initSite();
    return;
  }

  // Setup progress bar scale
  gsap.set(loadBar, { width: '100%', scaleX: 0, transformOrigin: 'left' });
  gsap.to(loadBar, { scaleX: 1, duration: 2.2, ease: 'none' });

  // Floating code vapor spans
  const snippets = ['const', '=>', '</>', '{}', '[]', 'async', 'await', 'import', 'export', 'let', 'function', 'class'];
  for (let i = 0; i < 8; i++) {
    const span = document.createElement('span');
    span.className = 'code-vapor';
    span.textContent = snippets[Math.floor(Math.random() * snippets.length)];
    span.style.left = `${Math.random() * 90 + 5}vw`;
    span.style.animationDelay = `${Math.random() * 2}s`;
    span.style.animationDuration = `${3 + Math.random() * 4}s`;
    preloader.appendChild(span);
  }

  // ASCII background drift matrix update
  const matrixChars = '!<>-?\\/[]{}—=+*^#_0101';
  let matrixInterval = setInterval(() => {
    if (asciiDrift) {
      let str = '';
      const charsLength = matrixChars.length;
      for (let i = 0; i < 300; i++) {
        str += matrixChars[Math.floor(Math.random() * charsLength)];
      }
      asciiDrift.textContent = str;
    }
  }, 50);

  // Counter 00 -> 100 logic
  let count = 0;
  const countInterval = setInterval(() => {
    count++;
    if (count > 100) {
      count = 100;
      clearInterval(countInterval);
      clearInterval(glitchInterval);
      clearInterval(matrixInterval);
      revealCurtains();
    }
    
    // Format counter: force leading zero for 0-9
    const formattedCount = count < 10 ? '0' + count : count.toString();
    counterEl.textContent = formattedCount;
  }, 22); // ~2.2 seconds total duration

  // Glitch effect intervals
  const glitchInterval = setInterval(() => {
    counterEl.classList.add('glitch');
    counterEl.setAttribute('data-text', counterEl.textContent);
    
    // Remove class after 80ms
    setTimeout(() => {
      counterEl.classList.remove('glitch');
    }, 80);
  }, 300);

  // Reveal curtains timeline
  function revealCurtains() {
    // Reduced motion check
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReduced) {
      gsap.set(preloader, { display: 'none' });
      if (typeof initSite === 'function') initSite();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(preloader, { display: 'none' });
        if (typeof initSite === 'function') initSite();
      }
    });

    tl.to('#preloader-top', { 
      yPercent: -100, 
      duration: 0.9, 
      ease: 'expo.inOut' 
    })
    .to('#preloader-bottom', { 
      yPercent: 100, 
      duration: 0.9, 
      ease: 'expo.inOut' 
    }, '<')
    .to('#preloader-content', { 
      opacity: 0, 
      duration: 0.4, 
      ease: 'power2.out' 
    }, '<');
  }
}

// Auto-run if main entry script isn't doing it, but let's let main.js run it
window.addEventListener('DOMContentLoaded', () => {
  // We'll let main.js bootstrap this, so we don't duplicate logic.
});
