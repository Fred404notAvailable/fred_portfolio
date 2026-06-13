/**
 * UTILS.JS
 * Helper functions, text scrambling, clipboard copy, and toast notification utilities.
 */

// Linear interpolation (lerp)
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

// Clamp value between min and max
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// Scramble text animation effect
function scrambleText(el, finalText) {
  if (!el) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*?0123456789_+=';
  let iteration = 0;
  
  // Clear any existing intervals on this element
  if (el.scrambleInterval) {
    clearInterval(el.scrambleInterval);
  }
  
  el.scrambleInterval = setInterval(() => {
    el.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ' || char === '/') return char;
        if (i < iteration) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
      
    if (iteration >= finalText.length) {
      clearInterval(el.scrambleInterval);
      el.textContent = finalText;
    }
    iteration += 0.4;
  }, 30);
}

// Show standard toast notifications
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    
    // Clear any pending timeout to prevent flickering
    if (window.toastTimeout) {
      clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Set up clipboard email copying
function initEmailCopy() {
  const copyBtn = document.getElementById('copy-btn');
  const emailText = document.getElementById('email-text');
  
  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', () => {
      const emailVal = emailText.textContent || 'hello@yourname.dev';
      navigator.clipboard.writeText(emailVal)
        .then(() => {
          showToast('EMAIL COPIED TO CLIPBOARD! 📋');
        })
        .catch(err => {
          console.error('Failed to copy email: ', err);
          showToast('FAILED TO COPY EMAIL.');
        });
    });
  }
}
