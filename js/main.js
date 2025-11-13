/**
 * AnimaBelle - Main JavaScript
 * Clínica de Estética Avançada
 * 
 * @description Script principal para funcionalidades do site
 * @version 1.0.0
 */

(function() {
  'use strict';

  /**
   * Navbar scroll effect
   * Adiciona classe 'scrolled' quando o usuário rola a página
   */
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;

    let lastScroll = 0;
    
    function handleScroll() {
      const currentScroll = window.scrollY || window.pageYOffset;
      
      if (currentScroll > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }

    // Throttle para melhor performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Smooth scroll para links âncora
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignora links vazios ou apenas #
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80; // Altura do navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Lazy loading para imagens
   */
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Navegador suporta lazy loading nativo
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', function() {
            this.classList.add('loaded');
          });
        }
      });
    }
  }

  /**
   * Inicialização quando DOM estiver pronto
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initNavbarScroll();
        initSmoothScroll();
        initLazyLoading();
      });
    } else {
      // DOM já está pronto
      initNavbarScroll();
      initSmoothScroll();
      initLazyLoading();
    }
  }

  // Inicia a aplicação
  init();

})();

