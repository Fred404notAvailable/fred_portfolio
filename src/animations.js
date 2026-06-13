/**
 * ANIMATIONS.JS
 * All GSAP ScrollTrigger animations: About, Work (horizontal pinned scroll),
 * Expertise/Skills, Contact, Footer typewriter, and Scroll Progress Bar.
 */

function initAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // ──────────────────────────────────────────────────────────────────────────
  // 1. SCROLL PROGRESS BAR
  // ──────────────────────────────────────────────────────────────────────────
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

  // ──────────────────────────────────────────────────────────────────────────
  // 2. NAVBAR SMART SHRINK ON SCROLL (class toggle)
  // ──────────────────────────────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => {
        if (self.direction === 1) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    });
  }


  // ──────────────────────────────────────────────────────────────────────────
  // 3. HERO SCROLL INDICATOR PULSE LOOP
  // ──────────────────────────────────────────────────────────────────────────
  const scrollLine = document.querySelector('.scroll-line');
  if (scrollLine) {
    gsap.to(scrollLine, {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. ABOUT SECTION — Slide-in, Text reveal, Blob morph, Section number parallax
  // ──────────────────────────────────────────────────────────────────────────

  // Visual panel slides in from the left
  gsap.from('.about-visual', {
    x: -120,
    opacity: 0,
    duration: 1.3,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%'
    }
  });

  // Blob path morphing – continuous oscillation via GSAP
  const morphBlob = document.getElementById('morph-blob');
  if (morphBlob) {
    const pathA = morphBlob.getAttribute('d');
    const pathB = 'M42.2,-72.1C55.3,-64.1,66.9,-52.7,74.1,-39.3C81.3,-25.9,84.1,-10.5,81.3,3.8C78.4,18.1,69.9,31.4,59.3,42.4C48.7,53.4,36,62,22.1,68.4C8.2,74.8,-6.8,79.1,-21.2,77.3C-35.6,75.4,-49.3,67.5,-60,56.1C-70.8,44.7,-78.6,29.9,-81.5,14.3C-84.4,-1.3,-82.4,-17.7,-75.3,-32.1C-68.1,-46.5,-55.8,-58.9,-42.1,-66.6C-28.5,-74.3,-13.4,-77.3,1,-79.1C15.4,-80.9,30.8,-81.5,42.2,-72.1Z';

    gsap.to(morphBlob, {
      attr: { d: pathB },
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  // Reveal lines – clip-reveal from behind clipping mask
  const revealLines = document.querySelectorAll('.masked-text .reveal-line span');
  if (revealLines.length > 0) {
    gsap.from(revealLines, {
      y: '100%',
      opacity: 0,
      stagger: 0.12,
      duration: 1.0,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.masked-text',
        start: 'top 80%'
      }
    });
  }

  // Section large background number parallax scrub
  gsap.utils.toArray('.section-number').forEach(el => {
    gsap.to(el, {
      y: -80,
      scrollTrigger: {
        trigger: el.closest('section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. SELECTED WORK — Horizontal Pinned Scroll with Card Parallax
  // ──────────────────────────────────────────────────────────────────────────
  const workSection = document.getElementById('work');
  const scrollWrapper = document.getElementById('scroll-wrapper');
  const isMobile = window.innerWidth <= 768;

  if (workSection && scrollWrapper && !isMobile) {
    // Calculate the total scroll distance
    const getScrollDistance = () => scrollWrapper.scrollWidth - window.innerWidth;

    const horizontalTween = gsap.to(scrollWrapper, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#work',
        start: 'top top',
        end: () => '+=' + getScrollDistance(),
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Inner image parallax: opposite direction scroll on each card's image
    gsap.utils.toArray('.parallax-img').forEach(img => {
      const speed = parseFloat(img.dataset.parallax) || 0.2;
      gsap.to(img, {
        x: () => getScrollDistance() * speed * -0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.project-card'),
          containerAnimation: horizontalTween,
          start: 'left right',
          end: 'right left',
          scrub: true
        }
      });
    });

    // Card line draw-in from left
    gsap.utils.toArray('.card-line').forEach(line => {
      gsap.from(line, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: line.closest('.project-card'),
          containerAnimation: horizontalTween,
          start: 'left 80%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // Work section title slam-in animation
  gsap.from('.work-title', {
    x: 200,
    rotation: 3,
    opacity: 0,
    duration: 1.1,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '#work',
      start: 'top 80%'
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. EXPERTISE SECTION — Text Scramble, Skill Bars with counter
  // ──────────────────────────────────────────────────────────────────────────

  // "EXPERTISE" title scramble on scroll entry
  const scramblerEl = document.querySelector('[data-scramble]');
  if (scramblerEl) {
    ScrollTrigger.create({
      trigger: scramblerEl,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (typeof scrambleText === 'function') {
          scrambleText(scramblerEl, scramblerEl.getAttribute('data-original-text') || 'EXPERTISE');
        }
      }
    });
    // Store original for after scroll
    scramblerEl.setAttribute('data-original-text', scramblerEl.textContent);
    
    // Also scramble on hover
    scramblerEl.addEventListener('mouseenter', () => {
      if (typeof scrambleText === 'function') {
        scrambleText(scramblerEl, '01011101');
      }
    });
    scramblerEl.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (typeof scrambleText === 'function') {
          scrambleText(scramblerEl, 'EXPERTISE');
        }
      }, 300);
    });
  }

  // Skill bars with animated fill + live counter text
  document.querySelectorAll('.bar-item').forEach(item => {
    const fill = item.querySelector('.bar-fill');
    const pctLabel = item.querySelector('.bar-pct');
    const barContainer = item.querySelector('.bar');
    if (!fill || !barContainer) return;

    const targetWidth = parseInt(barContainer.dataset.width) || 80;

    gsap.to(fill, {
      width: targetWidth + '%',
      duration: 1.6,
      ease: 'elastic.out(1, 0.6)',
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        once: true
      },
      onUpdate: function () {
        if (pctLabel) {
          const pct = Math.round(
            (fill.offsetWidth / barContainer.offsetWidth) * 100
          );
          pctLabel.textContent = pct + '%';
        }
      },
      onComplete: function () {
        // Clear will-change after animation
        gsap.set(fill, { clearProps: 'will-change' });
      }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 7. CONTACT SECTION
  // ──────────────────────────────────────────────────────────────────────────

  // "TALK" fill-word setup
  const fillWords = document.querySelectorAll('.fill-word');
  fillWords.forEach(word => {
    if (!word.getAttribute('data-hover-fill')) {
      word.setAttribute('data-hover-fill', word.textContent.trim());
    }
  });

  // Contact headline slides up
  gsap.from('.contact-headline', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 75%'
    }
  });

  // Contact email + copy button reveal
  gsap.from('.contact-email', {
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.out',
    delay: 0.2,
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%'
    }
  });

  // Social links bounce-in on scroll
  gsap.from('.social-links a', {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.9,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: '.social-links',
      start: 'top 90%'
    }
  });

  // Contact form fields stagger reveal
  gsap.from('.contact-form .field', {
    y: 30,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#contact-form',
      start: 'top 85%'
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 8. FOOTER — Typewriter effect using GSAP TextPlugin
  // ──────────────────────────────────────────────────────────────────────────
  const footerTypewriter = document.getElementById('footer-typewriter');
  if (footerTypewriter) {
    ScrollTrigger.create({
      trigger: 'footer',
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(footerTypewriter, {
          text: 'MADE WITH ♥ AND CODE',
          duration: 1.8,
          ease: 'none',
          delay: 0.3
        });
      }
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 9. SUBMIT BUTTON STATE MACHINE
  // ──────────────────────────────────────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('.submit-btn');
      const btnText = btn.querySelector('.btn-text');
      const btnSpinner = btn.querySelector('.btn-spinner');
      const btnCheck = btn.querySelector('.btn-check');

      if (!btn) return;

      // Loading state
      btn.classList.add('loading');
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
      if (btnCheck) btnCheck.style.display = 'none';

      // Simulate send then checkmark
      setTimeout(() => {
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btnCheck) btnCheck.style.display = 'inline-block';
        btn.classList.remove('loading');

        if (typeof showToast === 'function') {
          showToast('MESSAGE SENT SUCCESSFULLY! ✓');
        }

        // Reset after 3 seconds
        setTimeout(() => {
          if (btnText) btnText.style.display = '';
          if (btnCheck) btnCheck.style.display = 'none';
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 10. REFRESH SCROLLTRIGGER after all are registered
  // ──────────────────────────────────────────────────────────────────────────
  ScrollTrigger.refresh();
}
