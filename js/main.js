/**
 * Anima Belle — interações do site institucional
 * Arquivo em UTF-8. As configurações abaixo concentram integrações editáveis.
 */
(function () {
  'use strict';

  const CONFIG = {
    whatsapp: '5521969983889',
    whatsappDisplay: '(21) 96998-3889',
    // Insira um endpoint Formspree para receber o formulário também por e-mail.
    formspreeEndpoint: ''
  };

  const NOTICE_CONFIG = {
    // Troque para false quando todos os tratamentos estiverem liberados.
    enabled: true
  };

  // Insira aqui as URLs oficiais quando estiverem disponíveis.
  const SOCIAL_LINKS = {
    instagram: 'https://www.instagram.com/flavia_almeidas2',
    facebook: ''
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function buildWhatsAppUrl(message) {
    const baseUrl = 'https://wa.me/' + CONFIG.whatsapp;
    return message ? baseUrl + '?text=' + encodeURIComponent(message) : baseUrl;
  }

  function initWhatsAppLinks() {
    document.querySelectorAll('.wa-link').forEach(function (link) {
      const message = link.getAttribute('data-wa-message') || '';
      link.setAttribute('href', buildWhatsAppUrl(message));
    });

    document.querySelectorAll('.wa-display').forEach(function (element) {
      element.textContent = CONFIG.whatsappDisplay;
    });
  }

  function initHeader() {
    const header = document.querySelector('.site-header');
    const menuButton = document.querySelector('.menu-toggle');
    const navigation = document.getElementById('mainNav');

    if (!header || !menuButton || !navigation) return;

    function updateHeader() {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    }

    function closeMenu() {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      navigation.classList.remove('is-open');
      header.classList.remove('is-menu-open');
      document.body.classList.remove('is-locked');
    }

    function toggleMenu() {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
      navigation.classList.toggle('is-open', willOpen);
      header.classList.toggle('is-menu-open', willOpen);
      document.body.classList.toggle('is-locked', willOpen && window.innerWidth < 1024);
    }

    menuButton.addEventListener('click', toggleMenu);
    navigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
        closeMenu();
        menuButton.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) closeMenu();
    });

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      window.requestAnimationFrame(function () {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }, { passive: true });

    updateHeader();
  }

  function initActiveNavigation() {
    if (!('IntersectionObserver' in window)) return;

    const links = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
    const sections = links
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          const isCurrent = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', isCurrent);
          if (isCurrent) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function initReveals() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      elements.forEach(function (element) { element.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    elements.forEach(function (element) {
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
  }

  function initAnchorBehavior() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        const selector = anchor.getAttribute('href');
        if (!selector || selector === '#') return;

        const target = document.querySelector(selector);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });

        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', selector);
        }
      });
    });
  }

  function initChatWidget() {
    const toggle = document.getElementById('chatWidgetToggle');
    const widget = document.getElementById('chatWidget');
    const closeButton = document.getElementById('chatWidgetClose');
    const stepHome = document.getElementById('chatStepHome');
    const stepSchedule = document.getElementById('chatStepAgendar');
    const stepSuccess = document.getElementById('chatStepSuccess');
    const form = document.getElementById('chatFormAgendar');
    const backButton = document.getElementById('chatAgendarVoltar');
    const submitButton = document.getElementById('chatBtnSubmit');
    const openWhatsAppButton = document.getElementById('chatAbrirWhatsApp');

    if (!toggle || !widget || !closeButton || !stepHome || !stepSchedule || !stepSuccess) return;

    function showStep(name) {
      stepHome.hidden = name !== 'home';
      stepSchedule.hidden = name !== 'schedule';
      stepSuccess.hidden = name !== 'success';

      if (name === 'schedule') {
        window.setTimeout(function () {
          const firstInput = document.getElementById('chatNome');
          if (firstInput) firstInput.focus();
        }, 30);
      }
    }

    function openChat() {
      widget.classList.add('is-open');
      widget.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      showStep('home');
      window.setTimeout(function () { closeButton.focus(); }, 30);
    }

    function closeChat() {
      widget.classList.remove('is-open');
      widget.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      if (widget.classList.contains('is-open')) closeChat();
      else openChat();
    });

    closeButton.addEventListener('click', function () {
      closeChat();
      toggle.focus();
    });

    if (backButton) {
      backButton.addEventListener('click', function () { showStep('home'); });
    }

    if (openWhatsAppButton) {
      openWhatsAppButton.addEventListener('click', function () {
        window.open(buildWhatsAppUrl('Olá! Gostaria de agendar uma avaliação. Já preenchi meus dados pelo site.'), '_blank', 'noopener');
      });
    }

    widget.querySelectorAll('[data-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        const action = button.getAttribute('data-action');

        if (action === 'agendar') {
          showStep('schedule');
          return;
        }

        if (action === 'whatsapp') {
          window.open(buildWhatsAppUrl('Olá! Vim pelo site da Anima Belle e gostaria de falar com vocês.'), '_blank', 'noopener');
          closeChat();
          return;
        }

        if (action === 'servicos') {
          closeChat();
          const treatments = document.getElementById('tratamentos');
          if (treatments) {
            treatments.scrollIntoView({
              behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    if (form && submitButton) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const name = document.getElementById('chatNome').value.trim();
        const email = document.getElementById('chatEmail').value.trim();
        const phone = document.getElementById('chatCelular').value.trim();
        const message = 'Olá! Gostaria de agendar uma avaliação.\n\nNome: ' + name + '\nE-mail: ' + email + '\nCelular: ' + phone;
        const whatsappUrl = buildWhatsAppUrl(message);

        if (!CONFIG.formspreeEndpoint) {
          window.open(whatsappUrl, '_blank', 'noopener');
          form.reset();
          closeChat();
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando…';

        fetch(CONFIG.formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            nome: name,
            email: email,
            celular: phone,
            _subject: 'Novo agendamento — Anima Belle (site)'
          })
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Não foi possível enviar o formulário.');
            form.reset();
            showStep('success');
          })
          .catch(function () {
            window.open(whatsappUrl, '_blank', 'noopener');
            form.reset();
            closeChat();
          })
          .finally(function () {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Continuar <span>→</span>';
          });
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && widget.classList.contains('is-open')) {
        closeChat();
        toggle.focus();
      }
    });
  }

  function initNotice() {
    const overlay = document.getElementById('avisoPopup');
    const closeButton = document.getElementById('btnFechar');
    const confirmButton = document.getElementById('btnEntendi');

    if (!overlay || !closeButton || !confirmButton || !NOTICE_CONFIG.enabled) return;

    let previouslyFocused = null;

    function openNotice() {
      previouslyFocused = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add('is-locked');
      closeButton.focus();
    }

    function closeNotice() {
      overlay.hidden = true;
      document.body.classList.remove('is-locked');
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    }

    closeButton.addEventListener('click', closeNotice);
    confirmButton.addEventListener('click', closeNotice);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeNotice();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !overlay.hidden) closeNotice();
    });

    window.addEventListener('load', openNotice, { once: true });
  }

  function initTreatmentPhotos() {
    document.querySelectorAll('img[data-treatment-photo]').forEach(function (image) {
      function showNeutralPlaceholder() {
        image.hidden = true;
        image.closest('.treatment-media')?.classList.add('is-placeholder');
      }

      image.addEventListener('error', showNeutralPlaceholder, { once: true });

      if (image.complete && image.naturalWidth === 0) {
        showNeutralPlaceholder();
      }
    });
  }

  function initSocialLinks() {
    document.querySelectorAll('[data-social]').forEach(function (link) {
      const network = link.getAttribute('data-social');
      const configuredUrl = SOCIAL_LINKS[network]?.trim();

      if (configuredUrl) {
        link.setAttribute('href', configuredUrl);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.removeAttribute('aria-disabled');
        return;
      }

      link.removeAttribute('href');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.setAttribute('aria-disabled', 'true');

      link.addEventListener('click', function (event) {
        event.preventDefault();
      });

      link.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
      });
    });
  }

  function initCurrentYear() {
    const year = document.getElementById('currentYear');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function init() {
    initWhatsAppLinks();
    initHeader();
    initActiveNavigation();
    initAnchorBehavior();
    initReveals();
    initChatWidget();
    initNotice();
    initTreatmentPhotos();
    initSocialLinks();
    initCurrentYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
