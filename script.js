'use strict';

/* =========================================================
   Optional owner settings. No keys, backend, or build needed.
   Leave blank for automatic detection on *.github.io.
   Example value: 'https://github.com/your-name/your-repository'
   ========================================================= */
const SITE_CONFIG = Object.freeze({
  githubRepository: 'https://github.com/spark5632/Kimchi'
});

(() => {
  document.documentElement.classList.add('has-js');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileNav = window.matchMedia('(max-width: 1024px)');
  const toast = $('#toast');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3300);
  }

  /** Use secure clipboard when available; file:// has a checked fallback. */
  async function copyText(text, message = 'คัดลอกแล้ว') {
    if (!text) return false;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      showToast(message);
      return true;
    } catch {
      const active = document.activeElement;
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.setAttribute('readonly', '');
      temp.style.cssText = 'position:fixed;left:-9999px;top:0;font-size:16px;';
      // Place within the active native dialog so modal inertness does not block focus.
      const dialog = $('dialog[open]');
      (dialog || document.body).appendChild(temp);
      temp.focus();
      temp.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch { /* Show an honest failure below. */ }
      temp.remove();
      if (active instanceof HTMLElement) active.focus({ preventScroll: true });
      showToast(copied ? message : 'คัดลอกอัตโนมัติไม่ได้ กรุณาเลือกข้อความแล้วกด Ctrl+C หรือ ⌘C');
      return copied;
    }
  }

  $$('[data-copy-target]').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (target) copyText(target.textContent.trim());
    });
  });

  /* Sticky navigation, accessible mobile focus loop, active chapter. */
  const header = $('#siteHeader');
  const menu = $('#navLinks');
  const menuToggle = $('#menuToggle');
  const navAnchors = $$('#navLinks a');
  const chapters = navAnchors.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const progress = $('#readingProgress');

  function setMenu(open, restoreFocus = false) {
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
    document.body.classList.toggle('menu-open', open && mobileNav.matches);
    if (restoreFocus) menuToggle.focus({ preventScroll: true });
  }
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  navAnchors.forEach(a => a.addEventListener('click', () => setMenu(false)));
  $('.brand').addEventListener('click', () => setMenu(false));
  document.addEventListener('click', event => {
    if (menuToggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenu(false, true);
    }
    if (event.key === 'Tab' && mobileNav.matches) {
      const first = menuToggle;
      const last = navAnchors[navAnchors.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  mobileNav.addEventListener('change', () => setMenu(false));

  let scrollQueued = false;
  function updateScrollState() {
    scrollQueued = false;
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 16);
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, y / height)) : 0})`;
    const offset = header.getBoundingClientRect().height + 135;
    let active = '';
    for (const chapter of chapters) {
      if (chapter.getBoundingClientRect().top <= offset) active = chapter.id;
    }
    navAnchors.forEach(a => {
      if (a.getAttribute('href') === `#${active}`) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }
  function scheduleScrollUpdate() {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScrollState); }
  }
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
  updateScrollState();

  /* Reveal is progressive enhancement; without JS all content stays visible. */
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -12px 0px' });
    $$('.reveal').forEach(el => {
      // Keep anything already in the first viewport visible during initial load.
      if (el.getBoundingClientRect().top > window.innerHeight * .88) el.classList.add('will-reveal');
      revealObserver.observe(el);
    });
    const visualObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (entry.target.matches('.chart-story')) entry.target.classList.add('chart-animate');
        if (entry.target.matches('.diagram-figure')) entry.target.classList.add('flow-animate');
        visualObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    $$('.chart-story, .diagram-figure').forEach(el => visualObserver.observe(el));
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        revealObserver.disconnect(); visualObserver.disconnect();
        $$('.will-reveal').forEach(el => el.classList.remove('will-reveal'));
        $$('.chart-animate, .flow-animate').forEach(el => el.classList.remove('chart-animate', 'flow-animate'));
      }
    });
  }

  /* Native dialogs handle Escape and return focus to the invoking control. */
  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('dialog-open');
  }
  $$('dialog').forEach(dialog => {
    $$('[data-close-dialog]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (!$('dialog[open]')) document.body.classList.remove('dialog-open');
    });
  });
  function openImage(src, title, alt) {
    $('#dialogImage').src = src;
    $('#dialogImage').alt = alt;
    $('#imageDialogTitle').textContent = title;
    openDialog($('#imageDialog'));
  }

  /* 01: Before / After, actual existing image assets, keyboard-enabled tabs. */
  const imageStates = Object.freeze({
    before: {
      src: 'assets/images/infographic-before.webp',
      label: 'FIRST / ZERO-SHOT PROMPT',
      caption: '01 — ภาพผลลัพธ์แรก ก่อนกำหนดจำนวนขั้นตอนและ Layout',
      alt: 'ผลลัพธ์แรกของโครงงาน: ภาพกิมจิพร้อมวัตถุดิบและขั้นตอนหลายช่อง',
      download: 'assets/images/infographic-before.webp',
      title: 'Prompt แรก — Zero-shot Prompt'
    },
    after: {
      src: 'assets/images/infographic-after.webp',
      label: 'LATEST / STRUCTURED PROMPT',
      caption: '02 — ผลลัพธ์จาก Prompt ล่าสุด หลังระบุขั้นตอน โทนสี และอัตราส่วนภาพ',
      alt: 'ผลลัพธ์หลังปรับ Prompt: Infographic กิมจิ 5 ขั้นตอนจากซ้ายไปขวา',
      download: 'assets/kimchi-infographic.png',
      title: 'Prompt ล่าสุด — Structured Prompt'
    }
  });
  let imageState = 'after';
  const tabs = $$('.prompt-tab');
  function selectPrompt(name) {
    if (!imageStates[name]) return;
    imageState = name;
    tabs.forEach(tab => {
      const selected = tab.dataset.prompt === name;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    const state = imageStates[name];
    $('#resultImage').src = state.src;
    $('#resultImage').alt = state.alt;
    $('#resultLabel').textContent = state.label;
    $('#resultCaption').textContent = state.caption;
    $('#resultDownload').href = state.download;
    scheduleScrollUpdate();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPrompt(tab.dataset.prompt));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault(); tabs[next].focus(); selectPrompt(tabs[next].dataset.prompt);
      }
    });
  });
  $('#expandResult').addEventListener('click', () => {
    const state = imageStates[imageState];
    openImage(state.src, state.title, state.alt);
  });

  /* 02: Deterministic model. No sensors, measurements, or actual AI inference. */
  const model = day => 4.2 + 1.6 * Math.exp(-0.32 * day);
  const range = $('#dayRange');
  function updateModel(day) {
    const safeDay = Math.max(0, Math.min(14, Number(day)));
    if (!Number.isFinite(safeDay)) return;
    const ph = model(safeDay);
    const x = 64 + safeDay / 14 * 668;
    const y = 32 + (6 - ph) / 2 * 304;
    const readout = $('#dayReadout');
    // Replace only the number; the fixed '/ 14' caption stays intact.
    readout.firstChild.nodeValue = String(safeDay).padStart(2, '0');
    $('#phReadout').textContent = ph.toFixed(2);
    range.setAttribute('aria-valuetext', `วันที่ ${safeDay} ค่า pH จากแบบจำลอง ${ph.toFixed(2)}`);
    $('#markerGuide').setAttribute('x1', x.toFixed(2));
    $('#markerGuide').setAttribute('x2', x.toFixed(2));
    $('#markerGuide').setAttribute('y1', y.toFixed(2));
    ['#markerHalo', '#markerDot'].forEach(selector => {
      $(selector).setAttribute('cx', x.toFixed(2));
      $(selector).setAttribute('cy', y.toFixed(2));
    });
  }
  range.addEventListener('input', () => updateModel(range.value));
  updateModel(range.value);
  $('#phChart').addEventListener('click', event => {
    const r = event.currentTarget.getBoundingClientRect();
    const svgX = (event.clientX - r.left) / r.width * 760;
    const day = Math.round(Math.max(0, Math.min(14, (svgX - 64) / 668 * 14)));
    range.value = String(day); updateModel(day);
  });
  $('#copyEquation').addEventListener('click', () => copyText('y=4.2+1.6e^(-0.32x){0<=x<=14}', 'คัดลอกสมการสำหรับ Desmos แล้ว'));

  /* 03: The SVG fallback is always present. Only this optional action needs a CDN.
     Static hosting and file:// continue working if the library cannot load. */
  const mermaidSource = $('#mermaidCode').textContent.trim();
  $('#copyMermaid').addEventListener('click', () => copyText(mermaidSource, 'คัดลอก Mermaid Code แล้ว'));
  const mermaidButton = $('#renderMermaid');
  let mermaidModule;
  mermaidButton.addEventListener('click', async () => {
    const originalLabel = mermaidButton.innerHTML;
    mermaidButton.disabled = true;
    mermaidButton.textContent = 'กำลังโหลด…';
    $('#diagramMount').setAttribute('aria-busy', 'true');
    let timeout;
    try {
      if (!mermaidModule) {
        const module = await Promise.race([
          import('https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs'),
          new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Network timeout')), 10000); })
        ]);
        mermaidModule = module.default;
      }
      clearTimeout(timeout);
      mermaidModule.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: {
          fontFamily: 'Noto Sans Thai, Tahoma, sans-serif',
          fontSize: '16px',
          primaryColor: '#FFFDF9', primaryTextColor: '#242320',
          primaryBorderColor: '#D5D2C8', lineColor: '#78936C',
          secondaryColor: '#EAF0E6', tertiaryColor: '#FAF0D2',
          edgeLabelBackground: '#FAF8F2'
        },
        flowchart: { htmlLabels: false, useMaxWidth: true, curve: 'basis', nodeSpacing: 22, rankSpacing: 22, padding: 12 }
      });
      const result = await mermaidModule.render('kimchiLiveDiagram', mermaidSource);
      if (!result || !result.svg) throw new Error('No diagram returned');
      // SVG comes only from our fixed local source and Mermaid strict mode.
      $('#diagramMount').innerHTML = result.svg;
      $('#diagramMount').dataset.renderer = 'mermaid';
      $('#diagramStatus').textContent = 'Rendered with Mermaid · ใช้ Source เดิมครบทุกขั้นตอน';
      mermaidButton.hidden = true;
      showToast('แสดงแผนภาพด้วย Mermaid แล้ว');
    } catch {
      $('#diagramStatus').textContent = 'ใช้ SVG สำรองจากโครงสร้างเดิม — Mermaid ต้องเชื่อมต่ออินเทอร์เน็ต';
      showToast('โหลด Mermaid ไม่สำเร็จ แต่ยังดูแผนภาพและคัดลอกโค้ดได้ตามปกติ');
    } finally {
      clearTimeout(timeout);
      $('#diagramMount').removeAttribute('aria-busy');
      mermaidButton.disabled = false;
      mermaidButton.innerHTML = originalLabel;
    }
  });

  /* 04: Inline source avoids fetch restrictions when opening index.html locally. */
  $('#viewLatex').addEventListener('click', () => openDialog($('#sourceDialog')));

  /* 05: Eight exact PDF-page previews, with local files and no PDF library/CDN.
     Thumbnail order and titles follow the user-supplied PDF, not a generated deck. */
  const slides = [
    {
        "title": "Authentic Whole Napa Cabbage Kimchi",
        "src": "assets/slides/authentic-kimchi/page-01.webp",
        "page": 1
    },
    {
        "title": "Taste meets Health",
        "src": "assets/slides/authentic-kimchi/page-02.webp",
        "page": 2
    },
    {
        "title": "The Ingredient Matrix",
        "src": "assets/slides/authentic-kimchi/page-03.webp",
        "page": 3
    },
    {
        "title": "The Science of Osmosis",
        "src": "assets/slides/authentic-kimchi/page-04.webp",
        "page": 4
    },
    {
        "title": "The Sauce Equation",
        "src": "assets/slides/authentic-kimchi/page-05.webp",
        "page": 5
    },
    {
        "title": "The Craft of Coating",
        "src": "assets/slides/authentic-kimchi/page-06.webp",
        "page": 6
    },
    {
        "title": "Fermentation Dynamics",
        "src": "assets/slides/authentic-kimchi/page-07.webp",
        "page": 7
    },
    {
        "title": "The Master's Finish",
        "src": "assets/slides/authentic-kimchi/page-08.webp",
        "page": 8
    }
];
  const presentationPdf = 'assets/pdf/finalprompt.pdf';
  const slideDialog = $('#slideDialog');
  const slideShowcase = $('.slide-showcase');
  let currentSlide = 0;
  let suppressSlideClick = false;

  function selectSlide(index) {
    if (!Number.isFinite(index)) return;
    currentSlide = ((Math.trunc(index) % slides.length) + slides.length) % slides.length;
    const slide = slides[currentSlide];
    const count = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    const alt = `Slide ${currentSlide + 1} of ${slides.length}: ${slide.title}`;
    const preview = $('#slidePreview');
    preview.src = slide.src;
    preview.alt = alt;
    $('#slideTitle').textContent = slide.title;
    $('#slideCounter').textContent = count;
    $('#slideDialogImage').src = slide.src;
    $('#slideDialogImage').alt = alt;
    $('#slideDialogTitle').textContent = slide.title;
    $('#dialogSlideCounter').textContent = count;
    $('#openPresentationPdf').href = `${presentationPdf}#page=${slide.page}`;
    $('#openSlidePdf').href = `${presentationPdf}#page=${slide.page}`;
    $$('[data-slide]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.slide) === currentSlide)));
    // Cache just the adjacent page, rather than loading all full-size slides at once.
    const nextImage = new Image();
    nextImage.src = slides[(currentSlide + 1) % slides.length].src;
  }
  $$('[data-slide]').forEach(button => button.addEventListener('click', () => selectSlide(Number(button.dataset.slide))));
  $('#previousSlide').addEventListener('click', () => selectSlide(currentSlide - 1));
  $('#nextSlide').addEventListener('click', () => selectSlide(currentSlide + 1));
  $('#dialogPreviousSlide').addEventListener('click', () => selectSlide(currentSlide - 1));
  $('#dialogNextSlide').addEventListener('click', () => selectSlide(currentSlide + 1));
  $('#expandSlide').addEventListener('click', () => {
    if (suppressSlideClick) return;
    selectSlide(currentSlide);
    openDialog(slideDialog);
  });
  slideDialog.addEventListener('close', () => $('#expandSlide').focus({ preventScroll: true }));

  function galleryKeys(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next;
    if (event.key === 'ArrowRight') next = currentSlide + 1;
    if (event.key === 'ArrowLeft') next = currentSlide - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = slides.length - 1;
    if (next !== undefined) { event.preventDefault(); selectSlide(next); }
  }
  slideShowcase.addEventListener('keydown', galleryKeys);
  slideDialog.addEventListener('keydown', galleryKeys);

  // Horizontal swipes change slides; vertical movement is left to native scrolling.
  [$('#expandSlide'), $('.slides-viewer-body')].forEach(surface => {
    let gesture = null;
    surface.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) { gesture = null; return; }
      const touch = event.touches[0];
      gesture = { x: touch.clientX, y: touch.clientY, time: performance.now() };
    }, { passive: true });
    surface.addEventListener('touchend', event => {
      if (!gesture || !event.changedTouches.length) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - gesture.x;
      const dy = touch.clientY - gesture.y;
      const elapsed = performance.now() - gesture.time;
      gesture = null;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5 || elapsed > 1100) return;
      suppressSlideClick = true;
      selectSlide(currentSlide + (dx < 0 ? 1 : -1));
      setTimeout(() => { suppressSlideClick = false; }, 400);
    }, { passive: true });
    surface.addEventListener('touchcancel', () => { gesture = null; }, { passive: true });
  });

  /* Repository URL: explicit config first, safe inference on GitHub Pages second.
     A local demo never pretends that a remote repository already exists. */
  function validGitHubRepository(value) {
    if (!value) return null;
    try {
      const url = new URL(value);
      const segments = url.pathname.split('/').filter(Boolean);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password || segments.length < 2) return null;
      return `https://github.com/${segments.slice(0, 2).map(encodeURIComponent).join('/')}`;
    } catch { return null; }
  }
  function inferredRepository() {
    const host = window.location.hostname.toLowerCase();
    if (!host.endsWith('.github.io')) return null;
    const owner = host.slice(0, -'.github.io'.length);
    if (!owner || owner.includes('.')) return null;
    let first = window.location.pathname.split('/').filter(Boolean)[0] || '';
    try { first = decodeURIComponent(first); } catch { return null; }
    const repo = !first || first === 'index.html' ? `${owner}.github.io` : first;
    return `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  }
  const repository = validGitHubRepository(SITE_CONFIG.githubRepository) || inferredRepository();
  const repositoryLink = $('#repositoryLink');
  if (repository) {
    repositoryLink.href = repository;
    repositoryLink.target = '_blank';
    repositoryLink.rel = 'noopener noreferrer';
    $('#repositoryNote').textContent = 'ดูซอร์สโค้ดและไฟล์ประกอบทั้งหมดใน Repository ของโครงงาน';
  } else {
    repositoryLink.addEventListener('click', event => {
      event.preventDefault(); openDialog($('#repositoryDialog'));
    });
  }
})();
/* =========================================================
   KIMCHI CURSOR FX
   Decorative desktop-only cursor. No external library needed.
   ========================================================= */
(() => {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERACTIVE_SELECTOR = [
    'a[href]',
    'button:not(:disabled)',
    'summary',
    '[role="button"]',
    'input:not([type="hidden"]):not(:disabled)',
    'select:not(:disabled)',
    'textarea:not(:disabled)',
    'label[for]'
  ].join(',');

  const cursor = document.createElement('div');
  cursor.className = 'kimchi-cursor-fx';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `
    <img class="kimchi-cursor-normal" src="assets/images/kimchi-cursor.png" alt="">
    <img class="kimchi-cursor-hover" src="assets/images/kimchi-cursor-hover.png" alt="">
  `;
  document.body.appendChild(cursor);
  document.documentElement.classList.add('kimchi-cursor-enabled');

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let lastX = targetX;
  let lastY = targetY;
  let rotation = 0;
  let targetRotation = 0;
  let scale = 1;
  let targetScale = 1;
  let firstMove = true;
  let rafId = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;

  function isInteractiveTarget(target) {
    return target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
  }

  function updateHoverState(target) {
    const interactive = isInteractiveTarget(target);
    cursor.classList.toggle('is-interactive', interactive);
    targetScale = interactive ? 1.10 : 1;
  }

  function renderCursor() {
    const follow = reducedMotion.matches ? 1 : 0.20;
    const rotateFollow = reducedMotion.matches ? 1 : 0.18;
    const scaleFollow = reducedMotion.matches ? 1 : 0.20;

    currentX = lerp(currentX, targetX, follow);
    currentY = lerp(currentY, targetY, follow);
    rotation = lerp(rotation, reducedMotion.matches ? 0 : targetRotation, rotateFollow);
    scale = lerp(scale, targetScale, scaleFollow);

    cursor.style.setProperty('--cursor-x', `${currentX.toFixed(2)}px`);
    cursor.style.setProperty('--cursor-y', `${currentY.toFixed(2)}px`);
    cursor.style.setProperty('--cursor-rotate', `${rotation.toFixed(2)}deg`);
    cursor.style.setProperty('--cursor-scale', scale.toFixed(3));

    // Slowly settle the tilt back toward neutral after movement.
    targetRotation *= 0.88;
    rafId = requestAnimationFrame(renderCursor);
  }

  function onPointerMove(event) {
    if (event.pointerType === 'touch') return;

    targetX = event.clientX;
    targetY = event.clientY;

    if (firstMove) {
      currentX = targetX;
      currentY = targetY;
      lastX = targetX;
      lastY = targetY;
      firstMove = false;
    }

    const dx = targetX - lastX;
    const dy = targetY - lastY;
    lastX = targetX;
    lastY = targetY;

    if (!reducedMotion.matches) {
      // Horizontal motion drives most of the tilt; vertical movement adds a little character.
      targetRotation = clamp((dx * 0.72) + (dy * 0.16), -11, 11);
    }

    updateHoverState(event.target);
    cursor.classList.add('is-visible');
  }

  function hideCursor() {
    cursor.classList.remove('is-visible', 'is-interactive', 'is-clicking');
    targetScale = 1;
  }

  function makePepperBurst(x, y) {
    if (reducedMotion.matches) return;

    const pieces = 9;
    for (let i = 0; i < pieces; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'kimchi-pepper-particle';
      particle.setAttribute('aria-hidden', 'true');

      const angle = (Math.PI * 2 * i / pieces) + (Math.random() - 0.5) * 0.55;
      const distance = 18 + Math.random() * 30;
      const travelX = Math.cos(angle) * distance;
      const travelY = Math.sin(angle) * distance - (4 + Math.random() * 8);
      const size = 3.5 + Math.random() * 3.5;
      const turn = (Math.random() - 0.5) * 220;
      const color = i % 3 === 0 ? '#7D201D' : (i % 2 === 0 ? '#D94A3F' : '#B8322A');

      particle.style.setProperty('--start-x', `${x}px`);
      particle.style.setProperty('--start-y', `${y}px`);
      particle.style.setProperty('--travel-x', `${travelX.toFixed(1)}px`);
      particle.style.setProperty('--travel-y', `${travelY.toFixed(1)}px`);
      particle.style.setProperty('--particle-rotate', `${turn.toFixed(1)}deg`);
      particle.style.setProperty('--size', `${size.toFixed(1)}px`);
      particle.style.setProperty('--particle-color', color);

      document.body.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
    }
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true });

  document.addEventListener('pointerover', event => {
    if (event.pointerType === 'touch') return;
    updateHoverState(event.target);
  }, { passive: true });

  document.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    cursor.classList.add('is-clicking');
    targetScale = isInteractiveTarget(event.target) ? 1.18 : 0.90;
    makePepperBurst(event.clientX, event.clientY);
  }, { passive: true });

  document.addEventListener('pointerup', event => {
    if (event.pointerType === 'touch') return;
    cursor.classList.remove('is-clicking');
    targetScale = isInteractiveTarget(event.target) ? 1.34 : 1;
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', hideCursor);
  window.addEventListener('blur', hideCursor);

  // If the device capability changes (for example a tablet attaches/detaches a mouse),
  // reload so the native/custom cursor mode is re-evaluated cleanly.
  finePointer.addEventListener?.('change', () => window.location.reload());

  rafId = requestAnimationFrame(renderCursor);

  window.addEventListener('pagehide', () => {
    if (rafId) cancelAnimationFrame(rafId);
  }, { once: true });
})();

/* =========================================================
   ZEST-INSPIRED HERO PARALLAX
   Subtle ingredient motion; disabled for touch/reduced motion.
   ========================================================= */
(() => {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.zest-hero');
  if (!hero || !canHover.matches || reducedMotion.matches) return;

  const items = [...hero.querySelectorAll('.parallax-food')];
  if (!items.length) return;

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const depths = [18, -14, 10];

  function animate() {
    cx += (tx - cx) * 0.075;
    cy += (ty - cy) * 0.075;
    items.forEach((item, index) => {
      const depth = depths[index] ?? 10;
      const x = cx * depth;
      const y = cy * depth * .65;
      const r = cx * depth * .025;
      item.style.setProperty('--zpx', `${x.toFixed(2)}px`);
      item.style.setProperty('--zpy', `${y.toFixed(2)}px`);
      item.style.setProperty('--zpr', `${r.toFixed(2)}deg`);
    });
    raf = requestAnimationFrame(animate);
  }

  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    tx = ((event.clientX - rect.left) / rect.width - .5) * 2;
    ty = ((event.clientY - rect.top) / rect.height - .5) * 2;
  }, { passive: true });

  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; }, { passive: true });
  raf = requestAnimationFrame(animate);
  window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
})();

/* =========================================================
   KIMCHI FORMATION INTRO
   1) Ingredients fly/gather toward the center.
   2) They disappear as the finished kimchi bowl appears.
   3) A transparent circular hole expands from the center,
      revealing the website underneath.
   ========================================================= */
(() => {
  const intro = document.getElementById('kimchiIntro');
  const ring = document.getElementById('kimchiIntroRing');
  const skip = document.getElementById('kimchiIntroSkip');
  if (!intro || !ring) {
    document.documentElement.classList.add('intro-finished');
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsMask =
    CSS.supports('mask-image', 'radial-gradient(circle, transparent 0, #000 1px)') ||
    CSS.supports('-webkit-mask-image', 'radial-gradient(circle, transparent 0, #000 1px)');

  let revealStarted = false;
  let playTimer = 0;
  let revealTimer = 0;
  let revealRaf = 0;

  document.body.classList.add('intro-active');

  // Start on the next painted frame so initial transforms are committed
  // before the CSS keyframes begin.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      intro.classList.add('is-playing');
    });
  });

  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }

  function finishIntro() {
    if (revealRaf) cancelAnimationFrame(revealRaf);
    clearTimeout(playTimer);
    clearTimeout(revealTimer);

    intro.classList.add('is-finished');
    ring.classList.remove('is-visible');
    document.body.classList.remove('intro-active');
    document.documentElement.classList.add('intro-finished');

    // Remove the intro nodes after the fade has settled so they cannot
    // affect pointer interaction or accessibility later in the page.
    window.setTimeout(() => {
      intro.remove();
      ring.remove();
    }, 260);
  }

  function startReveal(fast = false) {
    if (revealStarted) return;
    revealStarted = true;
    clearTimeout(revealTimer);

    // Browsers without CSS masking still get a graceful fade exit.
    if (!supportsMask) {
      intro.style.transition = 'opacity .55s ease';
      intro.style.opacity = '0';
      window.setTimeout(finishIntro, 560);
      return;
    }

    intro.classList.add('is-revealing');
    ring.classList.add('is-visible');

    const start = performance.now();
    const duration = fast ? 520 : (reducedMotion ? 520 : 1500);
    // Radius from viewport center to the furthest corner, plus breathing room.
    const maxRadius = Math.hypot(window.innerWidth / 2, window.innerHeight / 2) + 140;

    function frame(now) {
      const linear = Math.min(1, (now - start) / duration);
      const progress = easeOutQuint(linear);
      const radius = maxRadius * progress;

      intro.style.setProperty('--intro-hole', `${radius.toFixed(2)}px`);
      ring.style.setProperty('--intro-ring-scale', Math.max(.001, radius / 40).toFixed(4));

      // Let the outline disappear shortly before it reaches the corners.
      if (linear > .66) {
        ring.style.opacity = String(Math.max(0, .75 * (1 - ((linear - .66) / .34))));
      }

      if (linear < 1) {
        revealRaf = requestAnimationFrame(frame);
      } else {
        finishIntro();
      }
    }

    revealRaf = requestAnimationFrame(frame);
  }

  // Normal sequence: ~3 seconds of ingredient formation, then the
  // center-out circular reveal. Reduced-motion users see a shorter intro.
  revealTimer = window.setTimeout(
    () => startReveal(false),
    reducedMotion ? 720 : 2700
  );

  skip?.addEventListener('click', () => startReveal(true));

  // Escape is a convenient keyboard-accessible skip.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !revealStarted) startReveal(true);
  }, { passive: true });

  // Failsafe: never leave the visitor trapped behind the intro.
  playTimer = window.setTimeout(() => {
    if (document.body.classList.contains('intro-active')) finishIntro();
  }, 6500);
})();
