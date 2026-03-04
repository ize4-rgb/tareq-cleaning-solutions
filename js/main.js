/* ============================================
   Tareq Cleaning Solutions - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Loading Screen ----
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }, 800);
    });
    // Fallback: hide loader after 3 seconds no matter what
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => { if (loader.parentNode) loader.remove(); }, 500);
      }
    }, 3000);
  }

  // ---- AOS (Animate on Scroll) Init ----
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 80,
      disable: 'mobile'
    });
  }

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar
    if (navbar && !navbar.classList.contains('scrolled-fixed')) {
      if (scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        // Only remove 'scrolled' on the home page
        if (document.querySelector('.hero')) {
          navbar.classList.remove('scrolled');
        }
      }
    }

    // Back to top button
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(i => i.classList.remove('active'));

        // Open clicked (if it wasn't already open)
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('.counter');
  let counterAnimated = false;

  function animateCounters() {
    if (counterAnimated) return;

    counters.forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        counterAnimated = true;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out quad
          const eased = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(eased * target);
          counter.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        }

        requestAnimationFrame(updateCounter);
      }
    });
  }

  if (counters.length > 0) {
    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters(); // Check on load
  }

  // ---- Hero Stats Counter (home page) ----
  const heroNumbers = document.querySelectorAll('.hero-stat .number');
  heroNumbers.forEach(numEl => {
    const target = parseInt(numEl.getAttribute('data-target'));
    if (!target) return;

    const suffix = numEl.querySelector('span') ? numEl.querySelector('span').textContent : '';
    const duration = 2000;
    let started = false;

    function animateHeroStat() {
      if (started) return;
      started = true;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);

        // Rebuild text content
        numEl.textContent = '';
        numEl.textContent = current.toLocaleString();
        const span = document.createElement('span');
        span.textContent = suffix;
        numEl.appendChild(span);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          numEl.textContent = '';
          numEl.textContent = target.toLocaleString();
          const finalSpan = document.createElement('span');
          finalSpan.textContent = suffix;
          numEl.appendChild(finalSpan);
        }
      }

      requestAnimationFrame(update);
    }

    // Start after a short delay (hero is visible on load)
    setTimeout(animateHeroStat, 1200);
  });

  // ---- Hero Particles ----
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 6 + 3;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particleContainer.appendChild(particle);
    }
  }

  // ---- Form Handling ----
  function handleFormSubmit(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        // Reset styles
        field.style.borderColor = '';

        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e74c3c';
          field.style.animation = 'shake 0.5s ease';
          setTimeout(() => field.style.animation = '', 500);
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            valid = false;
            field.style.borderColor = '#e74c3c';
          }
        }
      });

      if (!valid) {
        showToast('Please fill in all required fields correctly.', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Your message has been sent successfully! We\'ll be in touch within 24 hours.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  handleFormSubmit('quoteForm');
  handleFormSubmit('contactForm');

  // ---- Toast Notification ----
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastMessage) return;

    // Reset classes
    toast.classList.remove('show', 'success', 'error');

    // Set content
    toastMessage.textContent = message;
    toast.classList.add(type);

    // Update icon
    const icon = toast.querySelector('i');
    if (icon) {
      icon.className = type === 'success'
        ? 'fas fa-check-circle'
        : 'fas fa-exclamation-circle';
    }

    // Show
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  // ---- Cookie Notice ----
  const cookieNotice = document.getElementById('cookieNotice');
  const acceptCookies = document.getElementById('acceptCookies');

  if (cookieNotice && acceptCookies) {
    // Check if already accepted
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
        cookieNotice.classList.add('show');
      }, 2000);
    }

    acceptCookies.addEventListener('click', () => {
      cookieNotice.classList.remove('show');
      localStorage.setItem('cookiesAccepted', 'true');
    });
  }

  // ---- Scroll-based animations for elements without AOS ----
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));
  }

  // ---- Active Nav Link Highlight ----
  // Already handled by adding .active class in HTML per page.
  // For single-page scroll-spy on home page:
  if (document.querySelector('.hero')) {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
      const scrollPos = window.scrollY + 150;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
  }

  // ---- Parallax Effect on Hero (subtle) ----
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && !document.getElementById('heroVideo')) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  }

  // ---- Keyboard accessibility: add shake animation keyframes ----
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);

  // ---- Typed effect for hero subtitle (optional enhancement) ----
  const heroDescription = document.querySelector('.hero-description');
  if (heroDescription && window.innerWidth > 768) {
    const text = heroDescription.textContent.trim();
    heroDescription.textContent = '';
    heroDescription.style.opacity = '1';
    heroDescription.style.transform = 'none';

    let charIndex = 0;
    function typeWriter() {
      if (charIndex < text.length) {
        heroDescription.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 15);
      }
    }

    // Start typing after hero animation
    setTimeout(typeWriter, 1500);
  }

  // ---- Image lazy loading enhancement ----
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ---- Ripple effect on buttons ----
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation keyframes
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleEffect {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  // ---- Console branding ----
  console.log(
    '%c✨ Tareq Cleaning Solutions %c Premium Commercial Cleaning',
    'background: linear-gradient(135deg, #0a1628, #1a365d); color: #00b4d8; padding: 12px 16px; font-size: 16px; font-weight: bold; border-radius: 8px 0 0 8px;',
    'background: #00b4d8; color: white; padding: 12px 16px; font-size: 16px; border-radius: 0 8px 8px 0;'
  );

  // ---- Before / After Image Slider ----
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const beforeImg = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(2, Math.min(98, percent));
      beforeImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = percent + '%';
    }

    function startDrag(e) {
      isDragging = true;
      slider.style.cursor = 'ew-resize';
      e.preventDefault();
    }

    function doDrag(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    }

    function stopDrag() {
      isDragging = false;
      slider.style.cursor = 'ew-resize';
    }

    // Mouse events
    slider.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);

    // Touch events
    slider.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', doDrag, { passive: true });
    window.addEventListener('touchend', stopDrag);

    // Click to jump
    slider.addEventListener('click', (e) => {
      setPosition(e.clientX);
    });
  });

  // ---- Instant Price Estimator ----
  const estimatorSection = document.querySelector('.estimator-section');
  if (estimatorSection) {
    const serviceOptions = document.querySelectorAll('#serviceType .est-option');
    const frequencyOptions = document.querySelectorAll('#frequencyType .est-option');
    const timeOptions = document.querySelectorAll('#timeType .est-option');
    const areaSlider = document.getElementById('areaSlider');
    const areaValue = document.getElementById('areaValue');
    const estimatedPrice = document.getElementById('estimatedPrice');
    const summaryService = document.getElementById('summaryService');
    const summaryArea = document.getElementById('summaryArea');
    const summaryFrequency = document.getElementById('summaryFrequency');
    const summaryTime = document.getElementById('summaryTime');

    function getActiveOption(container) {
      return container.querySelector('.est-option.active');
    }

    function setupOptions(options) {
      options.forEach(opt => {
        opt.addEventListener('click', () => {
          opt.closest('.estimator-options').querySelectorAll('.est-option').forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          calculatePrice();
        });
      });
    }

    setupOptions(serviceOptions);
    setupOptions(frequencyOptions);
    setupOptions(timeOptions);

    // Area slider
    if (areaSlider) {
      areaSlider.addEventListener('input', () => {
        const val = parseInt(areaSlider.value);
        areaValue.textContent = val.toLocaleString();
        updateSliderTrack();
        calculatePrice();
      });
    }

    function updateSliderTrack() {
      if (!areaSlider) return;
      const min = parseInt(areaSlider.min);
      const max = parseInt(areaSlider.max);
      const val = parseInt(areaSlider.value);
      const percentage = ((val - min) / (max - min)) * 100;
      areaSlider.style.background = `linear-gradient(to right, var(--secondary) 0%, var(--secondary) ${percentage}%, var(--border) ${percentage}%, var(--border) 100%)`;
    }

    function calculatePrice() {
      const activeService = getActiveOption(document.getElementById('serviceType'));
      const activeFrequency = getActiveOption(document.getElementById('frequencyType'));
      const activeTime = getActiveOption(document.getElementById('timeType'));
      const area = parseInt(areaSlider.value);

      const rate = parseFloat(activeService.dataset.rate);
      const multiplier = parseFloat(activeFrequency.dataset.multiplier);
      const surcharge = parseFloat(activeTime.dataset.surcharge);

      // base = rate * area, adjusted by frequency multiplier and time surcharge + minimum fee
      let price = Math.max(rate * area * multiplier * surcharge, 120);
      price = Math.round(price / 5) * 5; // Round to nearest $5

      // Animate price change
      const current = parseInt(estimatedPrice.textContent.replace(/,/g, ''));
      animateValue(estimatedPrice, current, price, 400);

      // Update summary
      const serviceNames = {
        office: 'Office Cleaning', medical: 'Medical Cleaning', school: 'School Cleaning',
        industrial: 'Industrial Cleaning', strata: 'Strata Cleaning', retail: 'Retail Cleaning'
      };
      const freqNames = {
        daily: 'Daily', '3x-week': '3x Per Week', weekly: 'Weekly',
        fortnightly: 'Fortnightly', 'one-off': 'One-Off'
      };
      const timeNames = {
        'after-hours': 'After Hours', 'business-hours': 'Business Hours', weekend: 'Weekend'
      };

      summaryService.textContent = serviceNames[activeService.dataset.value] || 'Office Cleaning';
      summaryArea.textContent = area.toLocaleString() + ' m²';
      summaryFrequency.textContent = freqNames[activeFrequency.dataset.value] || 'Daily';
      summaryTime.textContent = timeNames[activeTime.dataset.value] || 'After Hours';
    }

    function animateValue(element, start, end, duration) {
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);
        element.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    // Initial calculation
    updateSliderTrack();
    calculatePrice();
  }

  // ---- Animated Timeline (Scroll Reveal) ----
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length > 0) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation slightly
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          tlObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach(item => tlObserver.observe(item));
  }

  // ---- Parallax for hero video (subtle) ----
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    // Replace the heroBg parallax with video-compatible one
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroVideo.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.15}px)`;
    }, { passive: true });
  }

});
