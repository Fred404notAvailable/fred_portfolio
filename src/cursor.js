/**
 * CURSOR.JS
 * Implements smooth lerping custom cursor dot & circle, hover states,
 * and context-sensitive views (like "VIEW" for project cards).
 */

function initCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorCircle = document.getElementById('cursor-circle');
  const customCursorContainer = document.querySelector('.custom-cursor');

  if (!cursorDot || !cursorCircle) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;

  // Disable completely on mobile or if user prefers reduced motion
  if (isMobile || prefersReduced) {
    if (customCursorContainer) {
      customCursorContainer.style.display = 'none';
    }
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Quick dot follow
    gsap.to(cursorDot, { 
      x: mouseX, 
      y: mouseY, 
      duration: 0.02,
      overwrite: 'auto'
    });
  });

  // Lerp circle coordinates for smooth lag lag effect
  function updateCirclePosition() {
    circleX += (mouseX - circleX) * 0.12;
    circleY += (mouseY - circleY) * 0.12;
    
    gsap.set(cursorCircle, { 
      x: circleX, 
      y: circleY 
    });
    
    requestAnimationFrame(updateCirclePosition);
  }
  
  // Start the tick loop
  updateCirclePosition();

  // Configure Cursor Hover Interactive Elements
  const hoverables = document.querySelectorAll('a, button, input, textarea, select, [data-cursor], .project-card, .magnetic-hover');

  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const cursorState = el.getAttribute('data-cursor');

      if (cursorState === 'VIEW' || el.classList.contains('project-card')) {
        // Project card hover
        cursorCircle.innerHTML = '<span class="text-xs text-[#071009] font-bold">VIEW</span>';
        cursorCircle.style.mixBlendMode = 'normal';
        gsap.to(cursorCircle, {
          width: 90,
          height: 90,
          backgroundColor: '#00FF87', // Primary Accent Green
          borderColor: 'transparent',
          duration: 0.3,
          overwrite: 'auto'
        });
        gsap.to(cursorDot, {
          opacity: 0,
          duration: 0.2
        });
      } else {
        // Standard interactive link hover
        cursorCircle.style.mixBlendMode = 'difference';
        gsap.to(cursorCircle, {
          width: 70,
          height: 70,
          backgroundColor: '#FFFFFF',
          borderColor: 'transparent',
          duration: 0.3,
          overwrite: 'auto'
        });
        gsap.to(cursorDot, {
          scale: 0.5,
          duration: 0.2
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      cursorCircle.innerHTML = '';
      cursorCircle.style.mixBlendMode = 'difference';
      
      gsap.to(cursorCircle, {
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
        borderColor: '#00FF87',
        duration: 0.3,
        overwrite: 'auto'
      });
      gsap.to(cursorDot, {
        scale: 1,
        opacity: 1,
        duration: 0.2
      });
    });
  });
}
