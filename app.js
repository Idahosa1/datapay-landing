// DataPay Interaction & Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const navPillItems = document.querySelectorAll('.nav-pill-item');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const prevTestimonialBtn = document.getElementById('prevTestimonial');
  const nextTestimonialBtn = document.getElementById('nextTestimonial');

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuDrawer.classList.toggle('open');
      mobileMenuDrawer.setAttribute('aria-hidden', isExpanded);
    });
  }

  // Sticky Bottom Action Dock (Appears when scrolled out of hero)
  const heroSection = document.getElementById('home');
  const bottomDock = document.getElementById('bottomActionDock');

  if (heroSection && bottomDock) {
    const updateDockVisibility = () => {
      const heroRect = heroSection.getBoundingClientRect();
      // Threshold: when scrolled out of hero (bottom of hero is within 300px of top or above viewport)
      const threshold = Math.min(window.innerHeight * 0.45, 300);
      if (heroRect.bottom <= threshold && window.scrollY > 150) {
        bottomDock.classList.add('visible');
        bottomDock.setAttribute('aria-hidden', 'false');
      } else {
        bottomDock.classList.remove('visible');
        bottomDock.setAttribute('aria-hidden', 'true');
      }
    };

    window.addEventListener('scroll', updateDockVisibility, { passive: true });
    window.addEventListener('resize', updateDockVisibility, { passive: true });

    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            bottomDock.classList.add('visible');
            bottomDock.setAttribute('aria-hidden', 'false');
          } else {
            updateDockVisibility();
          }
        });
      }, { threshold: 0 });
      heroObserver.observe(heroSection);
    }

    updateDockVisibility();
  }

  // Smooth scroll and active pill update on click
  function setActiveNav(targetHref) {
    navPillItems.forEach((btn) => {
      if (btn.getAttribute('href') === targetHref) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    mobileNavLinks.forEach((link) => {
      if (link.getAttribute('href') === targetHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  navPillItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      setActiveNav(href);
    });
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      setActiveNav(href);
      if (mobileMenuDrawer) {
        mobileMenuDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // IntersectionObserver to sync navbar active state as user scrolls through sections
  const sections = document.querySelectorAll('header[id], section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          setActiveNav('#' + id);
        }
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));

  // Staggered Step Cards Reveal Animation (Scroll-triggered, reverses when scrolled out, replays when scrolled in)
  const stepsContainer = document.querySelector('.steps-container');
  const stepCards = document.querySelectorAll('.step-card');

  if (stepsContainer && stepCards.length > 0) {
    let stepTimeouts = [];

    const clearStepTimeouts = () => {
      stepTimeouts.forEach((t) => clearTimeout(t));
      stepTimeouts = [];
    };

    const resetSteps = () => {
      clearStepTimeouts();
      stepCards.forEach((card) => card.classList.remove('revealed'));
      stepsContainer.classList.remove('is-revealed');
    };

    const playStaggeredReveal = () => {
      resetSteps();
      stepsContainer.classList.add('is-revealed');

      // Step 1 reveals promptly
      stepTimeouts.push(
        setTimeout(() => {
          if (stepCards[0]) stepCards[0].classList.add('revealed');
        }, 150)
      );

      // Step 2 reveals after a delay (~1.8 seconds)
      stepTimeouts.push(
        setTimeout(() => {
          if (stepCards[1]) stepCards[1].classList.add('revealed');
        }, 1800)
      );

      // Step 3 reveals after another delay (~1.8 seconds)
      stepTimeouts.push(
        setTimeout(() => {
          if (stepCards[2]) stepCards[2].classList.add('revealed');
        }, 3500)
      );
    };

    if ('IntersectionObserver' in window) {
      const stepObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              playStaggeredReveal();
            } else {
              // Reverses when scrolled out of that frame so scrolling back in replays
              resetSteps();
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      stepObserver.observe(stepsContainer);
    } else {
      playStaggeredReveal();
    }
  }

  // Universal Scroll-Reveal Orchestrator for Sections and Content Blocks
  const revealTargets = [
    // All section headers & notes
    ...document.querySelectorAll('.reveal-on-scroll'),
    // Features grid (staggered card wave)
    document.querySelector('.features-grid'),
    // Testimonials wrapper (carousel entrance)
    document.querySelector('.testimonials-wrapper'),
    // Contact layout columns
    document.querySelector('.contact-info'),
    document.querySelector('.contact-form-card'),
  ].filter(Boolean);

  if (revealTargets.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          } else {
            // Reversible: resets when scrolled out of view so scrolling back in replays
            entry.target.classList.remove('is-revealed');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-revealed'));
  }

  // Testimonials Auto-Scroll Ticker (Continuous self-scroll, 50% speed on hover, drag-to-scroll, buttons)
  if (testimonialsTrack && prevTestimonialBtn && nextTestimonialBtn) {
    const scrollAmount = 402; // card width (386px) + gap (16px)
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let isHovering = false;
    let tickerRafId = null;

    // Carousel buttons
    prevTestimonialBtn.addEventListener('click', () => {
      testimonialsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextTestimonialBtn.addEventListener('click', () => {
      testimonialsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Drag-to-Scroll Functionality
    testimonialsTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      testimonialsTrack.classList.add('is-dragging');
      startX = e.pageX - testimonialsTrack.offsetLeft;
      scrollStart = testimonialsTrack.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - testimonialsTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      testimonialsTrack.scrollLeft = scrollStart - walk;

      const halfWidth = testimonialsTrack.scrollWidth / 2;
      if (halfWidth > 0) {
        if (testimonialsTrack.scrollLeft >= halfWidth) {
          testimonialsTrack.scrollLeft -= halfWidth;
          scrollStart -= halfWidth;
        } else if (testimonialsTrack.scrollLeft <= 0) {
          testimonialsTrack.scrollLeft += halfWidth;
          scrollStart += halfWidth;
        }
      }
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      testimonialsTrack.classList.remove('is-dragging');
    });

    // Continuous Auto-Scroll Ticker:
    // Normal speed = 1.2px/frame; 50% speed on hover = 0.6px/frame
    const tickerStep = () => {
      if (!isDown) {
        const speed = isHovering ? 0.6 : 1.2;
        testimonialsTrack.scrollLeft += speed;

        const halfWidth = testimonialsTrack.scrollWidth / 2;
        if (halfWidth > 0) {
          if (testimonialsTrack.scrollLeft >= halfWidth) {
            testimonialsTrack.scrollLeft -= halfWidth;
          } else if (testimonialsTrack.scrollLeft <= 0) {
            testimonialsTrack.scrollLeft += halfWidth;
          }
        }
      }
      tickerRafId = requestAnimationFrame(tickerStep);
    };

    // Start auto-scroll ticker
    tickerRafId = requestAnimationFrame(tickerStep);

    // Hover detection: slow down to 50% speed on hover, return to normal when not hovering
    const testimonialsWrapper = document.querySelector('.testimonials-wrapper') || testimonialsTrack;

    testimonialsWrapper.addEventListener('mouseenter', () => {
      isHovering = true;
    });

    testimonialsWrapper.addEventListener('mouseleave', () => {
      isHovering = false;
    });

    // Pause animation when browser tab is hidden to save resources
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(tickerRafId);
      } else {
        cancelAnimationFrame(tickerRafId);
        tickerRafId = requestAnimationFrame(tickerStep);
      }
    });
  }

  // Form Submit Button Disabled State Handling
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  if (messageInput && submitBtn) {
    function updateSubmitState() {
      const hasContent = messageInput.value.trim().length > 0;
      submitBtn.disabled = !hasContent;
    }

    // Initialize state
    updateSubmitState();

    // Listen for input changes
    messageInput.addEventListener('input', updateSubmitState);
    messageInput.addEventListener('change', updateSubmitState);
  }

  // Hero Word "Seamlessly" Font Cycling Animation (Instrument Sans -> Caveat -> Playwrite US Modern -> Loop every 1.5s)
  const heroWord = document.getElementById('heroWordDynamic');
  if (heroWord) {
    const fontStates = [
      'font-state-instrument',
      'font-state-caveat',
      'font-state-playwrite'
    ];
    let activeFontIndex = 0;

    setInterval(() => {
      // 1. Trigger subtle crossfade transition
      heroWord.classList.add('font-swapping');

      setTimeout(() => {
        // 2. Remove previous font state class
        heroWord.classList.remove(fontStates[activeFontIndex]);

        // 3. Advance to next font state (modulo 3 for infinite loop)
        activeFontIndex = (activeFontIndex + 1) % fontStates.length;
        heroWord.classList.add(fontStates[activeFontIndex]);

        // 4. Fade back to full clarity
        heroWord.classList.remove('font-swapping');
      }, 150);
    }, 1500);
  }

  // Ensure Video Autoplays Smoothly
  const previewVideo = document.querySelector('.dashboard-preview-video');
  if (previewVideo) {
    previewVideo.muted = true;
    previewVideo.playsInline = true;
    const playPromise = previewVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback: re-trigger on user interaction
        window.addEventListener('click', () => previewVideo.play(), { once: true });
        window.addEventListener('touchstart', () => previewVideo.play(), { once: true });
      });
    }
  }

  // Footer Scroll-Triggered Animation (Emulating Scene-4-Elegant.mp4)
  const footerWrapper = document.querySelector('.footer-wrapper');
  if (footerWrapper) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      footerWrapper.classList.add('animated');

      if ('IntersectionObserver' in window) {
        const footerObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                footerWrapper.classList.add('in-view');
              } else {
                // Reversible: reset when scrolled out of view so re-entering replays the choreography
                footerWrapper.classList.remove('in-view');
              }
            });
          },
          {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px',
          }
        );

        footerObserver.observe(footerWrapper);
      } else {
        footerWrapper.classList.add('in-view');
      }
    }
  }
});
