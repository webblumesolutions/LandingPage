/* ==========================================================================
   Webblume Solutions — main.js
   Header scroll state, mobile nav, GSAP hero entrance + subtle motion.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header background on scroll ---- */
  const setHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  /* ---- Mobile nav toggle ---- */
  if (navToggle && mainNav) {
    const closeNav = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
      document.body.classList.remove('nav-is-open');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      mainNav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('nav-is-open', !isOpen);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeNav));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---- GSAP: services cards ---- */
  const serviceCards = document.querySelectorAll('.service-card');
  const canHoverServices = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (window.gsap && serviceCards.length) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      gsap.set(serviceCards, { opacity: 1, y: 0 });
    } else if (window.ScrollTrigger) {
      gsap.set(serviceCards, { opacity: 0, y: 36 });
      ScrollTrigger.batch(serviceCards, {
        start: 'top 88%',
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12 }),
        once: true,
      });
    }

    if (!prefersReducedMotion && canHoverServices) {
      serviceCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
          card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
      });
    }
  }

  /* ---- GSAP: hero entrance + floating cards ---- */
  if (window.gsap) {
    if (prefersReducedMotion) {
      gsap.set(
        ['.hero-eyebrow', '.hero-title', '.hero-copy', '.hero-actions', '.hero-meta', '.hero-visual'],
        { opacity: 1, y: 0, clearProps: 'transform' }
      );
    } else {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.6 })
        .from('.hero-title', { opacity: 0, y: 28, duration: 0.8 }, '-=0.4')
        .from('.hero-copy', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
        .from('.hero-actions', { opacity: 0, y: 16, duration: 0.6 }, '-=0.45')
        .from('.hero-meta-item', { opacity: 0, y: 14, duration: 0.5, stagger: 0.08 }, '-=0.3')
        .from(
          '.hero-visual',
          { opacity: 0, y: 30, scale: 0.97, duration: 0.9 },
          '-=0.7'
        )
        .from(
          '.floating-card',
          { opacity: 0, y: 18, duration: 0.6, stagger: 0.12 },
          '-=0.5'
        );

      /* Gentle continuous float on the two metric cards */
      gsap.to('.fc-seo', {
        y: '+=10',
        duration: 3.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.to('.fc-metric', {
        y: '-=10',
        duration: 3.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.4,
      });

      /* Draw the little SEO graph line once it's on screen */
      const graphPath = document.querySelector('.fc-graph-line');
      if (graphPath) {
        const length = graphPath.getTotalLength();
        gsap.set(graphPath, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(graphPath, { strokeDashoffset: 0, duration: 1.4, delay: 1.1, ease: 'power2.out' });
      }

      /* Cursor-driven tilt on the browser mockup — user-triggered, desktop only */
      const visual = document.querySelector('.hero-visual');
      const frame = document.querySelector('.browser-frame');
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      if (visual && frame && canHover) {
        const baseRotateY = -7;
        const baseRotateX = 3;

        visual.addEventListener('mousemove', (e) => {
          const rect = visual.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(frame, {
            rotateY: baseRotateY + px * 10,
            rotateX: baseRotateX - py * 10,
            duration: 0.6,
            ease: 'power2.out',
          });
        });

        visual.addEventListener('mouseleave', () => {
          gsap.to(frame, {
            rotateY: baseRotateY,
            rotateX: baseRotateX,
            duration: 0.8,
            ease: 'power3.out',
          });
        });
      }

      /* Cursor-driven tilt on the SEO dashboard card — same treatment, mirrored */
      const seoPanel = document.querySelector('.seo-panel');
      const seoTiltCard = document.querySelector('#seo-card');

      if (seoPanel && seoTiltCard && canHover) {
        const seoBaseRotateY = 5;
        const seoBaseRotateX = -2;

        seoPanel.addEventListener('mousemove', (e) => {
          const rect = seoPanel.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(seoTiltCard, {
            rotateY: seoBaseRotateY + px * 8,
            rotateX: seoBaseRotateX - py * 8,
            duration: 0.6,
            ease: 'power2.out',
          });
        });

        seoPanel.addEventListener('mouseleave', () => {
          gsap.to(seoTiltCard, {
            rotateY: seoBaseRotateY,
            rotateX: seoBaseRotateX,
            duration: 0.8,
            ease: 'power3.out',
          });
        });
      }
    }
  }

  /* ---- Why Webblume: accordion pillars ---- */
  const whyStack = document.querySelector('#why-stack');

  if (whyStack) {
    const whyCards = Array.from(whyStack.querySelectorAll('.why-card'));
    const whyCounter = document.querySelector('.why-counter-current');

    const setPanelHeight = (card) => {
      const panel = card.querySelector('.why-panel');
      const inner = panel.querySelector('.why-panel-inner');
      panel.style.height = card.classList.contains('is-open') ? `${inner.offsetHeight}px` : '0px';
    };

    const openCard = (target) => {
      whyCards.forEach((card) => {
        const isTarget = card === target;
        card.classList.toggle('is-open', isTarget);
        card.querySelector('.why-card-head').setAttribute('aria-expanded', String(isTarget));
        setPanelHeight(card);
      });

      if (whyCounter) {
        whyCounter.textContent = String(whyCards.indexOf(target) + 1).padStart(2, '0');
      }
    };

    whyCards.forEach((card) => {
      setPanelHeight(card);

      card.querySelector('.why-card-head').addEventListener('click', () => {
        if (card.classList.contains('is-open')) return; // keep one pillar always open
        openCard(card);
      });
    });

    /* Keep the open panel correctly sized when the layout reflows */
    let whyResizeId;
    window.addEventListener('resize', () => {
      window.clearTimeout(whyResizeId);
      whyResizeId = window.setTimeout(() => whyCards.forEach(setPanelHeight), 150);
    });

    /* Scroll reveal */
    if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from('.why-aside > *', {
        opacity: 0,
        y: 26,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.why', start: 'top 78%', once: true },
      });

      gsap.from(whyCards, {
        opacity: 0,
        y: 28,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: whyStack, start: 'top 82%', once: true },
      });
    }
  }


  /* ---- SEO Visual: counters + graph draw ---- */
  const seoCard = document.querySelector('#seo-card');

  if (seoCard) {
    const runSeoReveal = () => {
      seoCard.classList.add('is-in-view');

      seoCard.querySelectorAll('.seo-stat-value').forEach((el) => {
        const target = parseFloat(el.dataset.countTo);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const counter = { val: 0 };

        if (prefersReducedMotion || !window.gsap) {
          el.textContent = `${prefix}${target}${suffix}`;
          return;
        }

        gsap.to(counter, {
          val: target,
          duration: 1.3,
          delay: 0.1,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
          },
        });
      });
    };

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: seoCard,
        start: 'top 80%',
        once: true,
        onEnter: runSeoReveal,
      });

      gsap.from('.seo-copy > *', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.seo', start: 'top 78%', once: true },
      });

      gsap.from('.seo-panel', {
        opacity: 0,
        y: 30,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.seo', start: 'top 78%', once: true },
      });
    } else {
      /* No GSAP / reduced motion: reveal immediately via IntersectionObserver */
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runSeoReveal();
            io.disconnect();
          }
        });
      }, { threshold: 0.4 });
      io.observe(seoCard);
    }
  }

  /* ---- Process: connecting line draw + staggered step reveal ---- */
  const processSteps = document.querySelectorAll('.process-step');
  const processLineFill = document.getElementById('process-line-fill');
  const canHoverProcess = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (processSteps.length) {
    const activateSteps = () => {
      processSteps.forEach((step) => step.classList.add('is-active'));
    };

    if (prefersReducedMotion) {
      activateSteps();
      if (processLineFill) processLineFill.style.width = '100%';
    } else if (window.gsap) {
      if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

      gsap.from('.process-head > *', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.process', start: 'top 78%', once: true },
      });

      gsap.set(processSteps, { opacity: 0, y: 30 });
      gsap.set('.process-card-media img', { scale: 1.18 });

      if (window.ScrollTrigger) {
        ScrollTrigger.create({
          trigger: '.process-track',
          start: 'top 75%',
          once: true,
          onEnter: () => {
            if (processLineFill) {
              gsap.to(processLineFill, { width: '100%', duration: 1.1, ease: 'power2.inOut' });
            }
            gsap.to(processSteps, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: 'power3.out',
              stagger: 0.15,
              onStart: activateSteps,
            });
            gsap.to('.process-card-media img', {
              scale: 1,
              duration: 1.1,
              ease: 'power3.out',
              stagger: 0.15,
            });
          },
        });

        gsap.from('.process-foot > *', {
          opacity: 0,
          y: 18,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.process-foot', start: 'top 90%', once: true },
        });
      } else {
        activateSteps();
        gsap.to(processSteps, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 });
        if (processLineFill) processLineFill.style.width = '100%';
      }
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateSteps();
            if (processLineFill) processLineFill.style.width = '100%';
            io.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(document.querySelector('.process-track'));
    }

    /* Touch devices can't hover — tap a card to reveal its details, tap elsewhere to close */
    if (!canHoverProcess) {
      const processCards = document.querySelectorAll('.process-card');
      processCards.forEach((card) => {
        card.addEventListener('click', (e) => {
          const wasOpen = card.classList.contains('is-open');
          processCards.forEach((c) => c.classList.remove('is-open'));
          if (!wasOpen) card.classList.add('is-open');
          e.stopPropagation();
        });
      });
      document.addEventListener('click', () => {
        processCards.forEach((c) => c.classList.remove('is-open'));
      });
    }
  }

  /* ---- Our Works: staggered reveal per project row ---- */
  const workItems = document.querySelectorAll('.work-item');

  if (workItems.length) {
    if (prefersReducedMotion) {
      gsap.set(workItems, { opacity: 1, y: 0 });
    } else if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from('.work .section-head > *', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.work', start: 'top 78%', once: true },
      });

      gsap.set(workItems, { opacity: 0, y: 40 });
      gsap.set('.work-frame-body img', { scale: 1.1 });

      workItems.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(item, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' });
            gsap.to(item.querySelector('.work-frame-body img'), {
              scale: 1,
              duration: 1,
              ease: 'power3.out',
            });
          },
        });
      });
    }
  }

  /* ---- About: word-mask headline reveal + staggered section entrance ---- */
  const aboutSection = document.querySelector('.about');

  if (aboutSection) {
    const eyebrow = aboutSection.querySelector('.about-copy > .eyebrow');
    const wordRevealEls = aboutSection.querySelectorAll('.reveal-words');
    const bodyTargets = aboutSection.querySelectorAll(
      '.about-body > *, .about-stack, .about-stats, .about-team-label, .team-card'
    );

    /* Split each heading/statement's text into word-in-mask spans:
       <span class="word-mask"><span class="word-inner">Word</span></span>
       so each word can be clipped and slid up independently. */
    const splitIntoWords = (el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words
        .map((word) => `<span class="word-mask"><span class="word-inner">${word}</span></span>`)
        .join(' ');
      return el.querySelectorAll('.word-inner');
    };

    if (prefersReducedMotion) {
      gsap.set([eyebrow, ...bodyTargets].filter(Boolean), { opacity: 1, y: 0 });
    } else if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      const wordInners = Array.from(wordRevealEls).flatMap((el) => Array.from(splitIntoWords(el)));

      gsap.set(wordInners, { yPercent: 130, opacity: 0 });
      if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 16 });
      gsap.set(bodyTargets, { opacity: 0, y: 26 });

      const aboutTl = gsap.timeline({
        scrollTrigger: { trigger: aboutSection, start: 'top 75%', once: true },
        defaults: { ease: 'power3.out' },
      });

      if (eyebrow) aboutTl.to(eyebrow, { opacity: 1, y: 0, duration: 0.5 });

      aboutTl
        .to(
          wordInners,
          { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out', stagger: 0.018 },
          eyebrow ? '-=0.2' : 0
        )
        .to(bodyTargets, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.5');
    } else {
      /* No GSAP / no ScrollTrigger fallback */
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              aboutSection.querySelectorAll('.reveal-words, .about-body > *, .about-stack, .about-stats, .about-team-label, .team-card, .about-copy > .eyebrow')
                .forEach((el) => el.classList.add('is-visible'));
              io.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(aboutSection);
    }
  }

  /* ---- Final CTA + Contact: simple fade-up on scroll ---- */
  const finalCtaCard = document.querySelector('.final-cta-card');
  const contactTargets = document.querySelectorAll(
    '.contact-copy > *, .contact-form'
  );

  if (finalCtaCard) {
    if (prefersReducedMotion) {
      gsap.set(finalCtaCard, { opacity: 1, y: 0, scale: 1 });
    } else if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(finalCtaCard, {
        opacity: 0,
        y: 30,
        scale: 0.98,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: finalCtaCard, start: 'top 85%', once: true },
      });
    }

    const canHoverCta = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!prefersReducedMotion && canHoverCta) {
      finalCtaCard.addEventListener('mousemove', (e) => {
        const rect = finalCtaCard.getBoundingClientRect();
        finalCtaCard.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        finalCtaCard.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    }
  }

  if (contactTargets.length) {
    if (prefersReducedMotion) {
      gsap.set(contactTargets, { opacity: 1, y: 0 });
    } else if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(contactTargets, {
        opacity: 0,
        y: 26,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.contact', start: 'top 78%', once: true },
      });
    }
  }

  /* ---- Toast notifications: used for the contact form's submit result,
     so the person never gets bounced to formspree.io's own page. ---- */
  function showToast(type, message) {
    let root = document.getElementById('toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      root.setAttribute('aria-live', 'polite');
      root.setAttribute('aria-atomic', 'true');
      document.body.appendChild(root);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const iconPath = type === 'success'
      ? '<path d="M20 6 9 17l-5-5"/>'
      : '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>';

    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
      </span>
      <p class="toast-message"></p>
      <button type="button" class="toast-close" aria-label="Dismiss notification">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    `;
    toast.querySelector('.toast-message').textContent = message;

    root.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('is-visible')));

    const remove = () => {
      toast.classList.remove('is-visible');
      toast.classList.add('is-leaving');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
      setTimeout(() => toast.remove(), 700);
    };

    const timer = setTimeout(remove, 6000);
    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(timer);
      remove();
    });
  }

  /* ---- Contact form: client-side validation + submit handling.
     Posts directly to Formspree via fetch so the page never redirects —
     the person always stays on this site and sees a toast instead. */
  const FORM_ENDPOINT = 'https://formspree.io/f/mljdeqpr';

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const fields = {
      name: document.getElementById('cf-name'),
      company: document.getElementById('cf-company'),
      email: document.getElementById('cf-email'),
      phone: document.getElementById('cf-phone'),
      service: document.getElementById('cf-service'),
      message: document.getElementById('cf-message'),
    };
    const statusEl = document.getElementById('form-status');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setFieldError = (field, message) => {
      const wrapper = field.closest('.form-field');
      const errorEl = wrapper.querySelector('.form-error');
      wrapper.classList.toggle('has-error', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
    };

    const validate = () => {
      let isValid = true;

      if (!fields.name.value.trim()) {
        setFieldError(fields.name, 'Please enter your name.');
        isValid = false;
      } else {
        setFieldError(fields.name, '');
      }

      if (!fields.email.value.trim()) {
        setFieldError(fields.email, 'Please enter your email address.');
        isValid = false;
      } else if (!emailPattern.test(fields.email.value.trim())) {
        setFieldError(fields.email, 'Please enter a valid email address.');
        isValid = false;
      } else {
        setFieldError(fields.email, '');
      }

      if (!fields.service.value) {
        setFieldError(fields.service, 'Please select a service.');
        isValid = false;
      } else {
        setFieldError(fields.service, '');
      }

      if (!fields.message.value.trim()) {
        setFieldError(fields.message, 'Please share a few project details.');
        isValid = false;
      } else {
        setFieldError(fields.message, '');
      }

      return isValid;
    };

    Object.values(fields).forEach((field) => {
      if (!field) return;
      field.addEventListener('blur', validate);
    });

    const submitBtn = contactForm.querySelector('.form-submit');
    const canHoverSubmit = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        const rect = submitBtn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        submitBtn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });

      if (!prefersReducedMotion && canHoverSubmit && window.gsap) {
        submitBtn.addEventListener('mousemove', (e) => {
          const rect = submitBtn.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(submitBtn, { x: px * 10, y: py * 8, duration: 0.3, ease: 'power2.out' });
        });
        submitBtn.addEventListener('mouseleave', () => {
          gsap.to(submitBtn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
        });
      }
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validate()) {
        statusEl.textContent = 'Please fix the highlighted fields and try again.';
        statusEl.className = 'form-status is-error';
        return;
      }

      statusEl.textContent = '';
      statusEl.className = 'form-status';

      const submitLabel = submitBtn ? submitBtn.querySelector('.form-submit-label') : null;
      const originalLabel = submitLabel ? submitLabel.textContent : '';

      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Sending…';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm),
      })
        .then((response) => {
          if (response.ok) {
            showToast('success', "Thanks — your enquiry is in. We'll get back to you within a day.");
            contactForm.reset();
          } else {
            return response.json().then((data) => {
              const message = data && Array.isArray(data.errors) && data.errors.length
                ? data.errors.map((err) => err.message).join(', ')
                : 'Something went wrong sending that.';
              throw new Error(message);
            });
          }
        })
        .catch(() => {
          showToast('error', "Couldn't send that just now. Please try again or email us directly.");
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
          if (submitLabel) submitLabel.textContent = originalLabel;
        });
    });
  }

  /* ---- Footer: current year ---- */
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

});