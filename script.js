/* ==========================================================================
   MARCADOR INICIO: PASO 1 - COMPORTAMIENTO DEL HEADER Y MENÚ MÓVIL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-only-btn');

  // 1. Ajuste del Header al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Control del Menú Hamburguesa Móvil
  const toggleMenu = () => {
    const isOpen = navMenu.classList.contains('active');
    
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

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

  // Evento al tocar el botón de hamburguesa
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // 3. Cerrar el menú al tocar cualquier link de navegación
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // 4. Cerrar el menú automáticamente si se toca fuera del header
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // 5. Cerrar menú al redimensionar a pantalla de escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
});

/* ==========================================================================
   MARCADOR FIN: PASO 1 - COMPORTAMIENTO DEL HEADER Y MENÚ MÓVIL
   ========================================================================== */

/* ==========================================================================
   MARCADOR INICIO: PASO 2 - COMPORTAMIENTO HERO SECTION
   ========================================================================== */

  // Micro-interacción 3D suave al mover el mouse sobre la tarjeta diagonal (Desktop)
  const heroCard = document.querySelector('.hero-diagonal-card');
  
  if (heroCard && window.innerWidth > 850) {
    heroCard.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = heroCard.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      heroCard.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }

/* ==========================================================================
   MARCADOR FIN: PASO 2 - COMPORTAMIENTO HERO SECTION
   ========================================================================== */
/* ==========================================================================
   MARCADOR INICIO: PASO 3 - REVEAL DE SECCIÓN ENFOQUE (01 / 04)
   ========================================================================== */

  // Animación de aparición suave al hacer scroll sobre la sección de Enfoque
  const approachPillars = document.querySelectorAll('.pillar-item');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    approachPillars.forEach(pillar => {
      pillar.style.opacity = '0';
      pillar.style.transform = 'translateY(15px)';
      pillar.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(pillar);
    });
  }

/* ==========================================================================
   MARCADOR FIN: PASO 3 - REVEAL DE SECCIÓN ENFOQUE (01 / 04)
   ========================================================================== */
/* ==========================================================================
   MARCADOR INICIO: PASO 4 - REVEAL DE TARJETAS DE PROYECTO
   ========================================================================== */

  // Animación staggered (escalonada) de aparición al hacer scroll hacia la sección Proyectos
  const projectCards = document.querySelectorAll('.project-card');
  
  if ('IntersectionObserver' in window) {
    const projectObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          projectObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    projectCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      projectObserver.observe(card);
    });
  }

/* ==========================================================================
   MARCADOR FIN: PASO 4 - REVEAL DE TARJETAS DE PROYECTO
   ========================================================================== */
/* ==========================================================================
   MARCADOR INICIO: PASO 5 - REVEAL DE PASOS DEL PROCESO
   ========================================================================== */

  // Animación de aparición progresiva para cada paso del proceso
  const processSteps = document.querySelectorAll('.process-step-item');
  
  if ('IntersectionObserver' in window) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
          }, index * 120);
          processObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    processSteps.forEach(step => {
      step.style.opacity = '0';
      step.style.transform = 'translateX(15px)';
      step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      processObserver.observe(step);
    });
  }

/* ==========================================================================
   MARCADOR FIN: PASO 5 - REVEAL DE PASOS DEL PROCESO
   ========================================================================== */
/* ==========================================================================
   MARCADOR INICIO: PASO 6 - ANIMACIÓN DE SERVICIOS
   ========================================================================== */

  // Revelado suave staggered para las tarjetas de servicio
  const serviceCards = document.querySelectorAll('.service-card');

  if ('IntersectionObserver' in window) {
    const serviceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          serviceObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    serviceCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      serviceObserver.observe(card);
    });
  }

/* ==========================================================================
   MARCADOR FIN: PASO 6 - ANIMACIÓN DE SERVICIOS
   ========================================================================== */
/* ==========================================================================
   MARCADOR INICIO: PASO 7 - ANIMACIÓN SOBRE CB
   ========================================================================== */

  // Revelado suave para la sección Sobre CB
  const aboutElements = document.querySelectorAll('.about-visual, .about-header, .about-body');

  if ('IntersectionObserver' in window) {
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 120);
          aboutObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    aboutElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      aboutObserver.observe(el);
    });
  }

/* ==========================================================================
   MARCADOR FIN: PASO 7 - ANIMACIÓN SOBRE CB
   ========================================================================== */
/* ==========================================================================
   MARCADOR INICIO: PASO 8 - NAVEGACIÓN SUAVE Y REVEAL CTA
   ========================================================================== */

  // Revelado animado para la sección CTA
  const ctaElements = document.querySelectorAll('.cta-header, .cta-action, .cta-quote');

  if ('IntersectionObserver' in window) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 120);
          ctaObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    ctaElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      ctaObserver.observe(el);
    });
  }

  // Smooth scroll universal para enlaces internos (#)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

/* ==========================================================================
   MARCADOR FIN: PASO 8 - NAVEGACIÓN SUAVE Y REVEAL CTA
   ========================================================================== */
