/**
 * AnimaBelle - Main JavaScript
 * Clínica de Estética Avançada
 * 
 * @description Script principal para funcionalidades do site
 * @version 1.0.0
 */

(function() {
  'use strict';

  const CONFIG = {
    whatsapp: '5521969983889',
    whatsappDisplay: '(21) 96998-3889',
    // Formspree: cadastre-se em https://formspree.io e coloque aqui o endpoint do formulário (ex: https://formspree.io/f/abcdefgh)
    // Assim você recebe nome, email e celular por e-mail sem precisar que o visitante abra o WhatsApp.
    formspreeEndpoint: ''
  };

  function initWhatsAppLinks() {
    const waUrl = 'https://wa.me/' + CONFIG.whatsapp;
    document.querySelectorAll('.wa-link').forEach(function(el) {
      el.setAttribute('href', waUrl);
    });
    document.querySelectorAll('.wa-display').forEach(function(el) {
      el.textContent = CONFIG.whatsappDisplay;
    });
  }

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
   * Chat Widget - Caixa de conversa (estilo chatbot)
   * "Agendar avaliação" abre formulário (nome, email, celular) e envia dados no WhatsApp
   */
  function initChatWidget() {
    const toggle = document.getElementById('chatWidgetToggle');
    const widget = document.getElementById('chatWidget');
    const closeBtn = document.getElementById('chatWidgetClose');
    const stepHome = document.getElementById('chatStepHome');
    const stepAgendar = document.getElementById('chatStepAgendar');
    const stepSuccess = document.getElementById('chatStepSuccess');
    const formAgendar = document.getElementById('chatFormAgendar');
    const btnVoltar = document.getElementById('chatAgendarVoltar');
    const btnSubmit = document.getElementById('chatBtnSubmit');
    const btnAbrirWa = document.getElementById('chatAbrirWhatsApp');
    const quickBtns = document.querySelectorAll('.chat-quick-btn');

    if (!toggle || !widget) return;

    function openChat(e) {
      if (e) e.preventDefault();
      widget.classList.add('is-open');
      widget.setAttribute('aria-hidden', 'false');
      showStep('home');
    }

    function closeChat() {
      widget.classList.remove('is-open');
      widget.setAttribute('aria-hidden', 'true');
    }

    function showStep(step) {
      stepHome.setAttribute('hidden', '');
      stepAgendar.setAttribute('hidden', '');
      stepSuccess.setAttribute('hidden', '');
      if (step === 'home') stepHome.removeAttribute('hidden');
      else if (step === 'agendar') stepAgendar.removeAttribute('hidden');
      else if (step === 'success') stepSuccess.removeAttribute('hidden');
    }

    toggle.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);

    btnVoltar.addEventListener('click', function() {
      showStep('home');
    });

    btnAbrirWa.addEventListener('click', function() {
      var msg = 'Olá! Gostaria de agendar uma avaliação (já enviei meus dados pelo site).';
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');
    });

    formAgendar.addEventListener('submit', function(e) {
      e.preventDefault();
      var nome = document.getElementById('chatNome').value.trim();
      var email = document.getElementById('chatEmail').value.trim();
      var celular = document.getElementById('chatCelular').value.trim();
      if (!nome || !email || !celular) return;

      var textoWa = 'Olá! Gostaria de agendar uma avaliação.\n\nNome: ' + nome + '\nE-mail: ' + email + '\nCelular: ' + celular;
      var urlWa = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(textoWa);

      if (CONFIG.formspreeEndpoint) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="chat-btn-loading">Enviando...</span>';
        fetch(CONFIG.formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: nome,
            email: email,
            celular: celular,
            _subject: 'Novo agendamento - AnimaBelle (site)'
          })
        })
          .then(function() {
            formAgendar.reset();
            showStep('success');
          })
          .catch(function() {
            window.open(urlWa, '_blank');
            formAgendar.reset();
            closeChat();
          })
          .finally(function() {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="bi bi-send"></i> Enviar';
          });
      } else {
        window.open(urlWa, '_blank');
        formAgendar.reset();
        closeChat();
      }
    });

    quickBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        if (action === 'agendar') {
          showStep('agendar');
        } else if (action === 'whatsapp') {
          var msg = 'Olá, vim pelo site e gostaria de falar com vocês.';
          window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');
          closeChat();
        } else if (action === 'servicos') {
          closeChat();
          var servicos = document.querySelector('#servicos');
          if (servicos) {
            servicos.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  /**
   * Inicialização quando DOM estiver pronto
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initWhatsAppLinks();
        initNavbarScroll();
        initSmoothScroll();
        initLazyLoading();
        initChatWidget();
      });
    } else {
      initWhatsAppLinks();
      initNavbarScroll();
      initSmoothScroll();
      initLazyLoading();
      initChatWidget();
    }
  }

  // Inicia a aplicação
  init();

})();









