/**
 * ============================================================
 * script.js — Portfólio Pessoal
 * Funcionalidades: tema, hambúrguer, nav ativa, reveal, 
 *                  barras de progresso, validação de formulário
 * ============================================================
 */

'use strict';

/* ============================================================
   1. TEMA CLARO / ESCURO
   Lê e salva a preferência do usuário no LocalStorage.
   ============================================================ */
(function initTheme() {
  const html      = document.documentElement;
  const btnTheme  = document.getElementById('btnTheme');
  const themeIcon = document.getElementById('themeIcon');

  // Lê preferência salva ou usa preferência do sistema operacional
  const saved = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = saved || (prefersDark ? 'dark' : 'light');

  applyTheme(current);

  btnTheme.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  /**
   * Aplica o tema ao <html> e atualiza o ícone do botão.
   * @param {'light'|'dark'} theme
   */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    // Alterna o ícone: sol no modo escuro (para indicar "mudar para claro"),
    // lua no modo claro (para indicar "mudar para escuro")
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    btnTheme.setAttribute('aria-label',
      theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'
    );
  }
})();


/* ============================================================
   2. MENU HAMBÚRGUER (MOBILE)
   Abre/fecha o menu em telas pequenas.
   ============================================================ */
(function initHamburger() {
  const btnHamburger = document.getElementById('btnHamburger');
  const nav          = document.getElementById('nav');

  btnHamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    btnHamburger.setAttribute('aria-expanded', String(isOpen));
    // Impede rolagem do body enquanto menu está aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fecha o menu ao clicar em qualquer link de navegação
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      btnHamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Fecha ao clicar fora do menu (ESC)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      nav.classList.remove('nav--open');
      btnHamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      btnHamburger.focus();
    }
  });
})();


/* ============================================================
   3. HEADER — sombra ao rolar + link ativo conforme seção
   ============================================================ */
(function initHeaderBehavior() {
  const header   = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav__link[data-section]');
  // Seleciona todas as seções que têm id correspondente
  const sections = Array.from(navLinks).map(l => document.getElementById(l.dataset.section)).filter(Boolean);

  /**
   * Atualiza visualmente qual link do menu está ativo,
   * baseado em qual seção está visível no viewport.
   */
  function updateActiveLink() {
    // Adiciona classe ao header quando a página rolou mais de 60px
    header.classList.toggle('header--scrolled', window.scrollY > 60);

    // Encontra a seção atual (a última que ultrapassou o topo + margem)
    const margin = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--header-h')) + 40;

    let activeId = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= margin) {
        activeId = section.id;
      }
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === activeId);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // roda na carga da página
})();


/* ============================================================
   4. ANIMAÇÕES DE REVEAL — fade-in ao entrar no viewport
   ============================================================ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Adiciona pequeno delay escalonado para elementos próximos
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        observer.unobserve(entry.target); // para de observar após revelar
      }
    });
  }, { threshold: 0.12 }); // aciona quando 12% do elemento está visível

  // Adiciona delay escalonado a grupos de elementos na mesma seção
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    const revealInSection = section.querySelectorAll('.reveal');
    revealInSection.forEach((el, idx) => {
      el.dataset.delay = idx * 80; // 80ms de atraso entre elementos
    });
  });

  items.forEach(item => observer.observe(item));
})();


/* ============================================================
   5. BARRAS DE PROGRESSO DE IDIOMAS
   Animadas quando a seção de formação entra no viewport.
   ============================================================ */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Pega o valor alvo definido inline via custom property CSS
        const target = entry.target.style.getPropertyValue('--target');
        entry.target.style.width = target;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ============================================================
   6. ANO ATUAL NO FOOTER
   ============================================================ */
(function initYear() {
  const el = document.getElementById('anoAtual');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ============================================================
   7. VALIDAÇÃO E ENVIO SIMULADO DO FORMULÁRIO
   ============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const inputNome     = document.getElementById('inputNome');
  const inputEmail    = document.getElementById('inputEmail');
  const inputMensagem = document.getElementById('inputMensagem');
  const btnEnviar     = document.getElementById('btnEnviar');
  const btnText       = document.getElementById('btnEnviarText');
  const formSuccess   = document.getElementById('formSuccess');

  /**
   * Valida um campo e exibe/limpa a mensagem de erro.
   * @param {HTMLInputElement|HTMLTextAreaElement} field — campo a validar
   * @param {string} errorId — id do elemento de erro
   * @param {Function} rule — função que retorna a mensagem de erro ou ''
   * @returns {boolean} true se válido
   */
  function validate(field, errorId, rule) {
    const msg     = rule(field.value.trim());
    const errorEl = document.getElementById(errorId);

    if (msg) {
      field.classList.add('form-input--error');
      errorEl.textContent = msg;
      return false;
    }

    field.classList.remove('form-input--error');
    errorEl.textContent = '';
    return true;
  }

  /** Regras de validação para cada campo */
  const rules = {
    nome:     v => !v                        ? 'Informe seu nome.'                 : '',
    email:    v => !v                        ? 'Informe seu e-mail.'               :
                   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Digite um e-mail válido.'  : '',
    mensagem: v => !v                        ? 'Escreva sua mensagem.'             :
                   v.length < 10             ? 'Mensagem muito curta (mín. 10 chars).' : '',
  };

  // Validação em tempo real ao sair do campo (blur)
  inputNome.addEventListener('blur',     () => validate(inputNome,     'erroNome',     rules.nome));
  inputEmail.addEventListener('blur',    () => validate(inputEmail,    'erroEmail',    rules.email));
  inputMensagem.addEventListener('blur', () => validate(inputMensagem, 'erroMensagem', rules.mensagem));

  // Limpa erro ao começar a digitar novamente
  [inputNome, inputEmail, inputMensagem].forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('form-input--error');
      // Limpa mensagem de erro correspondente
      const erroId = 'erro' + field.id.replace('input', '');
      const erroEl = document.getElementById(erroId);
      if (erroEl) erroEl.textContent = '';
    });
  });

  /** Envio do formulário */
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Valida todos os campos
    const nomeOk     = validate(inputNome,     'erroNome',     rules.nome);
    const emailOk    = validate(inputEmail,    'erroEmail',    rules.email);
    const mensagemOk = validate(inputMensagem, 'erroMensagem', rules.mensagem);

    if (!nomeOk || !emailOk || !mensagemOk) {
      // Foca o primeiro campo com erro
      const firstError = form.querySelector('.form-input--error');
      if (firstError) firstError.focus();
      return;
    }

    // Simula envio: desabilita botão e mostra loading
    btnEnviar.disabled    = true;
    btnText.textContent   = 'Enviando…';

    setTimeout(() => {
      // Limpa campos
      form.reset();
      [inputNome, inputEmail, inputMensagem].forEach(f => {
        f.classList.remove('form-input--error');
      });

      // Exibe feedback de sucesso
      formSuccess.hidden  = false;
      btnEnviar.disabled  = false;
      btnText.textContent = 'Enviar mensagem';

      // Esconde a mensagem de sucesso após 6 segundos
      setTimeout(() => { formSuccess.hidden = true; }, 6000);
    }, 1400); // simula latência de rede
  });
})();


/* ============================================================
   8. SUAVE: fecha overlay ao redimensionar para desktop
   ============================================================ */
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    const nav          = document.getElementById('nav');
    const btnHamburger = document.getElementById('btnHamburger');
    nav.classList.remove('nav--open');
    btnHamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}, { passive: true });
