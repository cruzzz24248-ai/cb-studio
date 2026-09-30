/* ==========================================================================
   MARCADOR INICIO: CB STUDIO WEB - JAVASCRIPT
   Header · Menú · Hero · Reveals · Smooth Scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     PASO 1 - COMPORTAMIENTO DEL HEADER Y MENÚ MÓVIL
     ========================================================================== */

  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-only-btn');

  // 1. Ajuste del Header al hacer scroll
  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  updateHeader();

  window.addEventListener('scroll', updateHeader, { passive: true });

  // 2. Control del Menú Hamburguesa Móvil
  if (header && hamburgerBtn && navMenu) {

    const openMenu = () => {
      navMenu.classList.add('active');
      hamburgerBtn.classList.add('active');

      hamburgerBtn.setAttribute('aria-expanded', 'true');
      hamburgerBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
    };

    const closeMenu = () => {
      navMenu.classList.remove('active');
      hamburgerBtn.classList.remove('active');

      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', 'Abrir menú de navegación');
    };

    const toggleMenu = () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    // Evento al tocar el botón de hamburguesa
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // 3. Cerrar el menú al tocar cualquier link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // 4. Cerrar el menú al tocar fuera del header
    document.addEventListener('click', (e) => {
      if (
        !header.contains(e.target) &&
        navMenu.classList.contains('active')
      ) {
        closeMenu();
      }
    });

    // 5. Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'Escape' &&
        navMenu.classList.contains('active')
      ) {
        closeMenu();
        hamburgerBtn.focus();
      }
    });

    // 6. Cerrar menú al pasar a escritorio
    window.addEventListener('resize', () => {
      if (
        window.innerWidth > 900 &&
        navMenu.classList.contains('active')
      ) {
        closeMenu();
      }
    });
  }

  /* ==========================================================================
     MARCADOR FIN: PASO 1 - HEADER Y MENÚ
     ========================================================================== */


  /* ==========================================================================
     PASO 2 - COMPORTAMIENTO HERO SECTION (EFECTO 3D TILT)
     ========================================================================== */

  const heroCard = document.querySelector('.hero-diagonal-card');

  if (
    heroCard &&
    window.innerWidth > 850 &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {

    let animationFrame = null;

    heroCard.addEventListener('mousemove', (e) => {

      if (animationFrame) return;

      animationFrame = requestAnimationFrame(() => {

        const { left, top, width, height } = heroCard.getBoundingClientRect();

        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        heroCard.style.transform =
          `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;

        animationFrame = null;
      });
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform =
        'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }

  /* ==========================================================================
     MARCADOR FIN: PASO 2 - HERO SECTION
     ========================================================================== */


  /* ==========================================================================
     FUNCIÓN GENERAL DE REVEAL (IntersectionObserver con Staggering)
     ========================================================================== */

  const createReveal = (elements, options = {}) => {

    if (!elements.length) return;

    const {
      translate = 'translateY(20px)',
      duration = '0.6s',
      delay = 100,
      threshold = 0.15
    } = options;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Si el usuario prefiere menos movimiento, mostramos directamente.
    if (reduceMotion) {
      elements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
      });
      return;
    }

    // Estado inicial
    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = translate;
      element.style.transition =
        `opacity ${duration} cubic-bezier(0.16, 1, 0.3, 1), transform ${duration} cubic-bezier(0.16, 1, 0.3, 1)`;
    });

    // Intersection Observer
    if ('IntersectionObserver' in window) {

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const index = elements.indexOf(entry.target);

            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0) translateX(0)';
            }, Math.max(0, index * delay));

            observer.unobserve(entry.target);
          });
        },
        { threshold }
      );

      elements.forEach(element => {
        observer.observe(element);
      });

    } else {
      // Fallback para navegadores antiguos
      elements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
      });
    }
  };


  /* ==========================================================================
     PASO 3 - REVEAL DE SECCIÓN ENFOQUE (01 / 04)
     ========================================================================== */

  const approachPillars = document.querySelectorAll('.pillar-item');

  createReveal(
    Array.from(approachPillars),
    {
      translate: 'translateY(15px)',
      duration: '0.6s',
      delay: 120,
      threshold: 0.2
    }
  );

  /* ==========================================================================
     MARCADOR FIN: PASO 3 - ENFOQUE
     ========================================================================== */


  /* ==========================================================================
     PASO 4 - REVEAL DE TARJETAS DE PROYECTO
     ========================================================================== */

  const projectCards = document.querySelectorAll('.project-card');

  createReveal(
    Array.from(projectCards),
    {
      translate: 'translateY(20px)',
      duration: '0.6s',
      delay: 100,
      threshold: 0.15
    }
  );

  /* ==========================================================================
     MARCADOR FIN: PASO 4 - PROYECTOS
     ========================================================================== */


  /* ==========================================================================
     PASO 5 - REVEAL DE PASOS DEL PROCESO
     ========================================================================== */

  const processSteps = document.querySelectorAll('.process-step-item');

  createReveal(
    Array.from(processSteps),
    {
      translate: 'translateX(15px)',
      duration: '0.5s',
      delay: 120,
      threshold: 0.2
    }
  );

  /* ==========================================================================
     MARCADOR FIN: PASO 5 - PROCESO
     ========================================================================== */


  /* ==========================================================================
     PASO 6 - ANIMACIÓN DE SERVICIOS
     ========================================================================== */

  const serviceCards = document.querySelectorAll('.service-card');

  createReveal(
    Array.from(serviceCards),
    {
      translate: 'translateY(20px)',
      duration: '0.6s',
      delay: 100,
      threshold: 0.15
    }
  );

  /* ==========================================================================
     MARCADOR FIN: PASO 6 - SERVICIOS
     ========================================================================== */


  /* ==========================================================================
     PASO 7 - ANIMACIÓN SOBRE CB
     ========================================================================== */

  const aboutElements = document.querySelectorAll('.about-visual, .about-header, .about-body');

  createReveal(
    Array.from(aboutElements),
    {
      translate: 'translateY(20px)',
      duration: '0.6s',
      delay: 120,
      threshold: 0.2
    }
  );

  /* ==========================================================================
     MARCADOR FIN: PASO 7 - SOBRE CB
     ========================================================================== */


  /* ==========================================================================
     PASO 8 - NAVEGACIÓN SUAVE (CON COMPENSACIÓN DE HEADER) Y REVEAL CTA
     ========================================================================== */

  const ctaElements = document.querySelectorAll('.cta-header, .cta-action, .cta-quote');

  createReveal(
    Array.from(ctaElements),
    {
      translate: 'translateY(20px)',
      duration: '0.6s',
      delay: 120,
      threshold: 0.15
    }
  );

  // Smooth scroll universal con descuento de la altura del header sticky
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function (e) {

      const targetId = this.getAttribute('href');

      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      e.preventDefault();

      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({
        top: offsetPosition,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* ==========================================================================
     MARCADOR FIN: PASO 8 - CTA Y NAVEGACIÓN
     ========================================================================== */

});

/* ==========================================================================
   MARCADOR FIN: CB STUDIO WEB - JAVASCRIPT
   ========================================================================== */
