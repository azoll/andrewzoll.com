/* =========================================================================
   RWM Quiz Engine ,  runtime
   Renders config-driven quizzes: landing → questions → email gate → results.
   Handles Mailchimp JSONP subscribe + PDF download.
   Public API: window.RWMQuiz.mount({ rootEl, config })
   ========================================================================= */

(function () {
  'use strict';

  // ---- Utils ---------------------------------------------------------------
  const TRUNC_MAX = 120;
  function truncate(s, n) {
    if (!s) return '';
    s = String(s);
    if (s.length <= (n || TRUNC_MAX)) return s;
    const cut = s.slice(0, n || TRUNC_MAX);
    const sp = cut.lastIndexOf(' ');
    return (sp > 60 ? cut.slice(0, sp) : cut).replace(/[\s,;:.\-]+$/, '') + '…';
  }
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'className') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else if (attrs[k] === true) node.setAttribute(k, '');
      else if (attrs[k] === false || attrs[k] == null) {} // skip
      else node.setAttribute(k, attrs[k]);
    }
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null || c === false) return;
        if (typeof c === 'string') node.appendChild(document.createTextNode(c));
        else node.appendChild(c);
      });
    }
    return node;
  }
  function on(node, ev, fn) { node.addEventListener(ev, fn); return node; }

  // ---- Engine --------------------------------------------------------------
  function mount({ rootEl, config }) {
    if (!rootEl) throw new Error('RWMQuiz.mount: rootEl required');
    if (!config) throw new Error('RWMQuiz.mount: config required');

    const state = {
      screen: 'landing',
      qIndex: 0,
      answers: {},          // { [qid]: value | string[] }
      firstName: '',
      email: '',
      results: null,
    };

    // Initial answers (multi-* questions get arrays)
    config.questions.forEach(q => {
      if (q.kind === 'multi' || q.kind === 'multi-capped') state.answers[q.id] = [];
      else state.answers[q.id] = null;
    });

    // ---- DOM scaffold ------------------------------------------------------
    rootEl.innerHTML = '';
    const container = el('div', { className: 'rq-container' });
    const header = el('div', { className: 'rq-header' }, [
      el('div', { className: 'rq-header-logo' }, [
        el('a', { href: 'https://ryleighwm.com/', target: '_blank', rel: 'noopener' }, config.brand.org || 'Ryleigh Wealth Management')
      ])
    ]);
    container.appendChild(header);

    const progressWrap = el('div', { className: 'rq-progress-wrap', id: 'rq-progress', style: 'display:none;' }, [
      el('div', { className: 'rq-progress-label', id: 'rq-progress-label' }, ''),
      el('div', { className: 'rq-progress-track' }, [
        el('div', { className: 'rq-progress-fill', id: 'rq-progress-fill', style: 'width:0%;' }),
      ]),
    ]);
    container.appendChild(progressWrap);

    const screenLanding = renderLanding();
    const screenQ = el('div', { className: 'rq-screen', id: 'rq-screen-q' });
    const screenGate = renderGate();
    const screenResults = el('div', { className: 'rq-screen', id: 'rq-screen-results' });

    container.appendChild(screenLanding);
    container.appendChild(screenQ);
    container.appendChild(screenGate);
    container.appendChild(screenResults);
    rootEl.appendChild(container);

    showScreen('landing');

    // ---- Screen control ----------------------------------------------------
    function showScreen(name) {
      state.screen = name;
      [screenLanding, screenQ, screenGate, screenResults].forEach(s => s.classList.remove('active'));
      const map = { landing: screenLanding, q: screenQ, gate: screenGate, results: screenResults };
      map[name].classList.add('active');
      progressWrap.style.display = name === 'q' ? 'block' : 'none';
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }

    // ---- Landing -----------------------------------------------------------
    function renderLanding() {
      const L = config.landing || {};
      const screen = el('div', { className: 'rq-screen active', id: 'rq-screen-landing' });
      const hero = el('div', { className: 'rq-landing-hero' });
      if (L.badge) hero.appendChild(el('span', { className: 'rq-badge' }, L.badge));
      hero.appendChild(el('h1', { className: 'rq-landing-headline' }, L.headline || ''));
      if (L.subhead) hero.appendChild(el('p', { className: 'rq-landing-subhead' }, L.subhead));

      if (L.trustItems && L.trustItems.length) {
        const bar = el('div', { className: 'rq-trust-bar', 'aria-label': 'Credentials' });
        L.trustItems.forEach((item, i) => {
          if (i > 0) bar.appendChild(el('span', { className: 'rq-trust-dot', 'aria-hidden': 'true' }));
          bar.appendChild(el('div', { className: 'rq-trust-item' }, item));
        });
        hero.appendChild(bar);
      }
      screen.appendChild(hero);

      // Body bullets
      if (L.bullets && L.bullets.length) {
        const body = el('div', { className: 'rq-landing-body' });
        const ul = el('ul');
        L.bullets.forEach(b => ul.appendChild(el('li', null, b)));
        body.appendChild(ul);
        screen.appendChild(body);
      }
      if (L.body) {
        const body = el('div', { className: 'rq-landing-body' });
        (Array.isArray(L.body) ? L.body : [L.body]).forEach(p => {
          body.appendChild(el('p', { html: p }));
        });
        screen.appendChild(body);
      }

      screen.appendChild(el('div', { className: 'rq-landing-ornament' }, [
        el('span', { className: 'rq-landing-ornament-mark' }, [el('span'), el('span'), el('span')])
      ]));

      const cta = el('div', { className: 'rq-landing-cta-wrap' }, [
        el('button', {
          type: 'button',
          className: 'rq-btn',
          onclick: () => { state.qIndex = 0; renderQuestion(); showScreen('q'); }
        }, L.ctaLabel || 'Start')
      ]);
      screen.appendChild(cta);
      if (L.fineprint) screen.appendChild(el('p', { className: 'rq-landing-fineprint' }, L.fineprint));
      return screen;
    }

    // ---- Questions ---------------------------------------------------------
    function renderQuestion() {
      const q = config.questions[state.qIndex];
      screenQ.innerHTML = '';
      const total = config.questions.length;
      document.getElementById('rq-progress-label').textContent = `Question ${state.qIndex + 1} of ${total}`;
      document.getElementById('rq-progress-fill').style.width = `${((state.qIndex + 1) / total) * 100}%`;

      if (q.category) screenQ.appendChild(el('div', { className: 'rq-question-category' }, q.category));
      screenQ.appendChild(el('h2', { className: 'rq-question-text' }, q.prompt));
      if (q.help) screenQ.appendChild(el('p', { className: 'rq-question-help' }, q.help));

      const opts = el('ul', { className: 'rq-options', role: 'listbox' });
      const isMulti = q.kind === 'multi' || q.kind === 'multi-capped';
      const cap = q.maxSelections || (q.kind === 'multi-capped' ? 3 : Infinity);

      q.options.forEach(opt => {
        const isSelected = isMulti
          ? state.answers[q.id].includes(opt.value)
          : state.answers[q.id] === opt.value;
        const li = el('li');
        const btn = el('button', {
          type: 'button',
          className: 'rq-option' + (isSelected ? ' selected' : ''),
          'role': 'option',
          'aria-selected': isSelected ? 'true' : 'false',
          onclick: () => onSelect(q, opt.value)
        }, opt.label);
        li.appendChild(btn);
        opts.appendChild(li);
      });
      screenQ.appendChild(opts);

      if (isMulti) {
        const selectedCount = state.answers[q.id].length;
        screenQ.appendChild(el('p', {
          className: 'rq-question-help',
          style: 'margin-top:14px;text-align:center;'
        }, `Selected ${selectedCount}${cap !== Infinity ? ` of up to ${cap}` : ''}`));
      }

      const nav = el('div', { className: 'rq-question-nav' });
      const backBtn = el('button', {
        type: 'button',
        className: 'rq-btn-back',
        hidden: state.qIndex === 0
      }, '← Back');
      on(backBtn, 'click', () => {
        if (state.qIndex > 0) { state.qIndex--; renderQuestion(); }
      });
      nav.appendChild(backBtn);

      const isLast = state.qIndex === total - 1;
      const canProceed = isMulti
        ? state.answers[q.id].length >= 1
        : state.answers[q.id] != null;
      const nextBtn = el('button', {
        type: 'button',
        className: 'rq-btn',
        'aria-disabled': canProceed ? 'false' : 'true',
        disabled: !canProceed
      }, isLast ? 'See my results' : 'Next →');
      on(nextBtn, 'click', () => {
        if (!canProceed) return;
        if (isLast) { showScreen('gate'); }
        else { state.qIndex++; renderQuestion(); }
      });
      nav.appendChild(nextBtn);
      screenQ.appendChild(nav);
    }

    function onSelect(q, value) {
      const isMulti = q.kind === 'multi' || q.kind === 'multi-capped';
      if (isMulti) {
        const arr = state.answers[q.id];
        const cap = q.maxSelections || (q.kind === 'multi-capped' ? 3 : Infinity);
        const idx = arr.indexOf(value);
        if (idx >= 0) arr.splice(idx, 1);
        else if (arr.length < cap) arr.push(value);
        renderQuestion();
      } else {
        state.answers[q.id] = value;
        renderQuestion();
      }
    }

    // ---- Email Gate --------------------------------------------------------
    function renderGate() {
      const G = config.gate || {};
      const screen = el('div', { className: 'rq-screen', id: 'rq-screen-gate' });
      screen.appendChild(el('div', { className: 'rq-gate-icon' }, [
        el('span', { html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3,7 12,13 21,7"/></svg>' })
      ]));
      screen.appendChild(el('h2', { className: 'rq-gate-headline' }, G.headline || 'Where should we send your results?'));
      screen.appendChild(el('p', { className: 'rq-gate-body' }, G.body || 'Enter your name and email to view your personalized results and download your printable PDF.'));

      const form = el('form', { id: 'rq-gate-form', novalidate: '' });
      form.appendChild(formGroup('rq-firstName', 'First name', 'Sarah', 'text', true));
      form.appendChild(formGroup('rq-email', 'Email address', 'you@example.com', 'email', true));
      const errorMsg = el('div', { className: 'rq-form-error', id: 'rq-form-error' });
      form.appendChild(errorMsg);
      const submitWrap = el('div', { className: 'rq-gate-submit-wrap' }, [
        el('button', { type: 'submit', className: 'rq-btn' }, 'View my results')
      ]);
      form.appendChild(submitWrap);
      if (G.fineprint) form.appendChild(el('p', { className: 'rq-gate-fineprint' }, G.fineprint));
      on(form, 'submit', onGateSubmit);
      screen.appendChild(form);
      return screen;
    }
    function formGroup(id, label, placeholder, type, required) {
      return el('div', { className: 'rq-form-group' }, [
        el('label', { className: 'rq-form-label', for: id }, label),
        el('input', { id, type, placeholder, className: 'rq-form-input', required: required ? '' : null, autocomplete: type === 'email' ? 'email' : 'given-name' })
      ]);
    }
    function onGateSubmit(e) {
      e.preventDefault();
      const firstName = document.getElementById('rq-firstName').value.trim();
      const email = document.getElementById('rq-email').value.trim();
      const errEl = document.getElementById('rq-form-error');
      errEl.classList.remove('show'); errEl.textContent = '';
      if (!firstName) { errEl.textContent = 'Please enter your first name.'; errEl.classList.add('show'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEl.textContent = 'Please enter a valid email address.'; errEl.classList.add('show'); return; }
      state.firstName = firstName;
      state.email = email;
      // Compute results
      const r = config.computeResults(state.answers, { firstName, email });
      state.results = r;
      // Subscribe
      subscribeMailchimp(r);
      // Show results
      renderResults();
      showScreen('results');
    }

    // ---- Mailchimp ---------------------------------------------------------
    function subscribeMailchimp(results) {
      const mc = config.mailchimp;
      if (!mc || !mc.url) { console.warn('[RWMQuiz] No mailchimp config; skipping subscribe.'); return; }
      const fields = (results.mailchimp && results.mailchimp.mergeFields) || {};
      // Truncate sentence display fields (anything not matching all-lowercase-slug pattern)
      const truncated = {};
      Object.keys(fields).forEach(k => {
        const v = fields[k];
        if (v == null) return;
        truncated[k] = truncate(String(v), TRUNC_MAX);
      });
      const params = new URLSearchParams(Object.assign({
        u: mc.u,
        id: mc.id,
        f_id: mc.f_id || '',
        FNAME: state.firstName,
        EMAIL: state.email,
      }, truncated));
      // Tag ,  Mailchimp accepts a numeric tag id under `tags`.
      const tagId = (results.mailchimp && results.mailchimp.tagId) || mc.tagId;
      if (tagId) params.set('tags', tagId);

      const cb = 'rq_mc_' + Date.now();
      window[cb] = function(resp) {
        delete window[cb];
        if (resp && resp.result === 'error' && resp.msg && !/already subscribed/i.test(resp.msg)) {
          console.warn('[RWMQuiz] Mailchimp error:', resp.msg);
        }
      };
      const s = document.createElement('script');
      s.src = mc.url + '?' + params.toString() + '&c=' + cb;
      s.onerror = () => console.warn('[RWMQuiz] Mailchimp request failed (network).');
      document.body.appendChild(s);
    }

    // ---- Results -----------------------------------------------------------
    function renderResults() {
      const r = state.results;
      screenResults.innerHTML = '';
      const wrap = el('div', { className: 'rq-stagger' });

      // Header
      const head = el('div', { className: 'rq-results-header' }, [
        el('div', { className: 'rq-results-overline' }, r.overline || `${state.firstName}'s Results`),
        el('h1', { className: 'rq-results-title' }, config.brand.product || ''),
      ]);
      wrap.appendChild(head);

      // Tier card
      if (r.tierLabel) {
        const tier = el('div', { className: 'rq-tier-card' }, [
          r.tierOverline ? el('div', { className: 'rq-tier-overline' }, r.tierOverline) : null,
          el('div', { className: 'rq-tier-label' }, r.tierLabel),
          r.tierBlurb ? el('div', { className: 'rq-tier-blurb' }, r.tierBlurb) : null,
          r.tierPill ? el('div', { className: 'rq-tier-pill' }, r.tierPill) : null,
        ].filter(Boolean));
        wrap.appendChild(tier);
      }

      // Blocks
      (r.blocks || []).forEach(b => {
        const block = el('div', { className: 'rq-block' });
        if (b.title) block.appendChild(el('h3', { className: 'rq-block-title' }, b.title));
        block.appendChild(renderBlock(b));
        wrap.appendChild(block);
      });

      // CTA (intro to Andrew + Calendly anchor link)
      const cta = r.cta || config.cta;
      if (cta) {
        const ctaChildren = [];
        if (cta.headshot) {
          ctaChildren.push(el('img', { className: 'rq-cta-headshot', src: cta.headshot, alt: cta.signature || 'Andrew Zoll', loading: 'lazy' }));
        }
        ctaChildren.push(el('div', { className: 'rq-cta-headline' }, cta.headline || 'Talk it through'));
        if (cta.body) ctaChildren.push(el('div', { className: 'rq-cta-body' }, cta.body));
        ctaChildren.push(el('a', {
          className: 'rq-btn',
          href: cta.scheduleAnchor !== false && config.calendly ? '#rq-schedule' : (cta.href || '#'),
          target: cta.scheduleAnchor !== false && config.calendly ? null : '_blank',
          rel: 'noopener',
        }, cta.label || 'Book a Stewardship Clarity Call'));
        if (cta.signature) ctaChildren.push(el('p', { className: 'rq-cta-signature' }, cta.signature));
        wrap.appendChild(el('div', { className: 'rq-cta' }, ctaChildren));
      }

      // PDF download row
      const pdfBtn = el('button', { type: 'button', onclick: () => downloadPDF(r) });
      pdfBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span style="margin-left:8px;">Download PDF of Your Results</span>';
      wrap.appendChild(el('div', { className: 'rq-pdf-row' }, [pdfBtn]));

      // Calendly inline embed
      if (config.calendly && config.calendly.url) {
        const cal = config.calendly;
        const sched = el('div', { className: 'rq-schedule', id: 'rq-schedule' });
        sched.appendChild(el('div', { className: 'rq-schedule-overline' }, 'Schedule Now'));
        sched.appendChild(el('h3', { className: 'rq-schedule-title' }, cal.title || 'Pick a time that works for you.'));
        sched.appendChild(el('p', { className: 'rq-schedule-body' }, cal.body || 'Twenty-five minutes, focused on your situation. No pressure, no sales pitch.'));
        // Lazy-load Calendly assets
        if (!document.getElementById('rq-calendly-css')) {
          const link = document.createElement('link');
          link.id = 'rq-calendly-css';
          link.rel = 'stylesheet';
          link.href = 'https://assets.calendly.com/assets/external/widget.css';
          document.head.appendChild(link);
        }
        if (!document.getElementById('rq-calendly-js')) {
          const sc = document.createElement('script');
          sc.id = 'rq-calendly-js';
          sc.src = 'https://assets.calendly.com/assets/external/widget.js';
          sc.async = true;
          document.body.appendChild(sc);
        }
        const widget = el('div', {
          className: 'calendly-inline-widget',
          'data-url': cal.url,
          style: 'min-width:320px;height:1100px;'
        });
        sched.appendChild(widget);
        wrap.appendChild(sched);
      }

      // FAQ
      const faq = r.faq || config.faq;
      if (faq && faq.length) {
        const faqSec = el('div', { className: 'rq-faq' });
        faqSec.appendChild(el('div', { className: 'rq-faq-overline' }, 'Common Questions'));
        faqSec.appendChild(el('h3', { className: 'rq-faq-title' }, config.faqTitle || 'Before You Book'));
        faq.forEach(item => {
          const det = el('details', { className: 'rq-faq-item' });
          det.appendChild(el('summary', null, item.q));
          det.appendChild(el('div', { className: 'rq-faq-body' }, [el('p', null, item.a)]));
          faqSec.appendChild(det);
        });
        wrap.appendChild(faqSec);
      }

      // Disclosure
      const disc = r.disclosure || config.disclosure || config.pdf?.disclosure;
      if (disc) {
        wrap.appendChild(el('div', { className: 'rq-disclosure', html: disc }));
      }

      screenResults.appendChild(wrap);
    }

    function renderBlock(b) {
      switch (b.kind) {
        case 'snapshot':       return renderSnapshot(b);
        case 'priority-list':  return renderPriorityList(b);
        case 'checklist':      return renderChecklist(b);
        case 'paired-list':    return renderPairedList(b);
        default:               return el('div', null, '');
      }
    }
    function renderSnapshot(b) {
      const wrap = el('div', { className: 'rq-snapshot' });
      (b.rows || []).forEach(row => {
        const main = el('div', { className: 'rq-snapshot-row-main' }, [
          el('div', { className: 'rq-snapshot-row-label' }, row.label),
          row.detail ? el('div', { className: 'rq-snapshot-row-detail' }, row.detail) : null,
        ].filter(Boolean));
        const band = row.band ? el('div', {
          className: 'rq-snapshot-row-band rq-band-' + (row.band.kind || 'neutral')
        }, row.band.label) : null;
        const r = el('div', { className: 'rq-snapshot-row' }, [main, band].filter(Boolean));
        wrap.appendChild(r);
      });
      return wrap;
    }
    function renderPriorityList(b) {
      const ol = el('ol', { className: 'rq-priority-list' });
      (b.items || []).forEach((it, i) => {
        ol.appendChild(el('li', { className: 'rq-priority-card' }, [
          el('span', { className: 'rq-priority-card-num' }, ('0' + (i + 1)).slice(-2)),
          el('strong', null, it.heading || ''),
          it.body ? el('p', null, it.body) : null,
        ].filter(Boolean)));
      });
      return ol;
    }
    function renderChecklist(b) {
      const ul = el('ul', { className: 'rq-checklist' });
      (b.items || []).forEach(item => {
        ul.appendChild(el('li', null, item));
      });
      return ul;
    }
    function renderPairedList(b) {
      const ul = el('ul', { className: 'rq-paired-list' });
      (b.items || []).forEach(it => {
        const card = el('li', { className: 'rq-paired-card' }, [
          el('div', { className: 'rq-paired-statement' }, it.heading || ''),
          it.scriptureRef ? el('div', { className: 'rq-paired-scripture' }, it.scriptureRef) : null,
          it.reframe ? el('div', { className: 'rq-paired-reframe' }, it.reframe) : null,
          it.action ? el('div', { className: 'rq-paired-action' }, [
            el('strong', null, 'One step'),
            it.action,
          ]) : null,
        ].filter(Boolean));
        ul.appendChild(card);
      });
      return ul;
    }

    // ---- PDF ---------------------------------------------------------------
    function downloadPDF(r) {
      if (!window.jspdf) { alert('PDF library failed to load. Please refresh and try again.'); return; }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 56;
      const contentW = pageW - margin * 2;

      const NAVY = [27, 58, 92];
      const PRIMARY = NAVY;             // header band, tier label color
      const GOLD = [200, 150, 46];
      const GOLD_PALE = [253, 243, 224];
      const INK = [13, 13, 13];
      const INK_MUTED = [97, 93, 89];
      const WHISPER = [228, 226, 224];
      const WHITE = [255, 255, 255];

      let y = 0;

      // Header band (red)
      doc.setFillColor(...PRIMARY);
      doc.rect(0, 0, pageW, 96, 'F');
      doc.setTextColor(...WHITE);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text((config.brand.org || 'Ryleigh Wealth Management').toUpperCase(), margin, 38);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(20);
      doc.text(config.pdf?.title || config.brand.product || '', margin, 70);
      y = 132;

      // Recipient line
      doc.setTextColor(...INK_MUTED);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Prepared for ${state.firstName} · ${dateStr}`, margin, y);
      y += 28;

      // Tier callout
      if (r.tierLabel) {
        const cardH = 92 + (r.tierBlurb ? 36 : 0);
        doc.setFillColor(...GOLD_PALE);
        doc.roundedRect(margin, y, contentW, cardH, 8, 8, 'F');
        doc.setDrawColor(...GOLD);
        doc.setLineWidth(0.8);
        doc.roundedRect(margin, y, contentW, cardH, 8, 8, 'S');

        let ty = y + 26;
        if (r.tierOverline) {
          doc.setTextColor(...GOLD);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text(r.tierOverline.toUpperCase(), margin + 18, ty);
          ty += 16;
        }
        doc.setTextColor(...PRIMARY);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(r.tierLabel, margin + 18, ty);
        ty += 22;
        if (r.tierBlurb) {
          doc.setTextColor(...INK);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          const lines = doc.splitTextToSize(r.tierBlurb, contentW - 36);
          doc.text(lines, margin + 18, ty);
        }
        y += cardH + 24;
      }

      // Blocks
      (r.blocks || []).forEach(b => {
        y = ensureSpace(doc, y, 80, pageH, margin);
        if (b.title) {
          doc.setTextColor(...INK);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          doc.text(b.title, margin, y);
          y += 18;
        }
        y = renderPdfBlock(doc, b, y, margin, contentW, pageH, { PRIMARY, GOLD, GOLD_PALE, INK, INK_MUTED, WHISPER, WHITE });
        y += 20;
      });

      // Footer
      const footer = config.pdf?.footer || `${config.brand.org || ''} · ryleighwm.com`;
      doc.setTextColor(...INK_MUTED);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(footer, margin, pageH - 32);

      // Optional disclosure on last page
      if (r.disclosure) {
        const dy = pageH - 60;
        doc.setTextColor(...INK_MUTED);
        doc.setFontSize(8);
        const lines = doc.splitTextToSize(r.disclosure, contentW);
        doc.text(lines, margin, dy);
      }

      const slug = (config.id || 'results').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      doc.save(`${slug}-${(state.firstName || 'results').toLowerCase().replace(/\s+/g, '-')}.pdf`);
    }

    function ensureSpace(doc, y, needed, pageH, margin) {
      if (y + needed > pageH - 80) {
        doc.addPage();
        return margin + 20;
      }
      return y;
    }

    function renderPdfBlock(doc, b, y, margin, contentW, pageH, C) {
      switch (b.kind) {
        case 'snapshot':       return pdfSnapshot(doc, b, y, margin, contentW, pageH, C);
        case 'priority-list':  return pdfPriority(doc, b, y, margin, contentW, pageH, C);
        case 'checklist':      return pdfChecklist(doc, b, y, margin, contentW, pageH, C);
        case 'paired-list':    return pdfPaired(doc, b, y, margin, contentW, pageH, C);
        default: return y;
      }
    }
    function pdfSnapshot(doc, b, y, margin, contentW, pageH, C) {
      doc.setDrawColor(...C.WHISPER);
      doc.setLineWidth(0.6);
      const rows = b.rows || [];
      const rowH = 38;
      const totalH = rows.length * rowH;
      doc.roundedRect(margin, y, contentW, totalH, 6, 6, 'S');
      rows.forEach((row, i) => {
        const ry = y + i * rowH;
        if (i > 0) doc.line(margin + 1, ry, margin + contentW - 1, ry);
        doc.setTextColor(...C.INK);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(row.label, margin + 16, ry + 16);
        if (row.detail) {
          doc.setTextColor(...C.INK_MUTED);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.text(doc.splitTextToSize(row.detail, contentW - 220), margin + 16, ry + 28);
        }
        if (row.band) {
          const bw = doc.getTextWidth(row.band.label) + 16;
          const bx = margin + contentW - 16 - bw;
          const by = ry + 8;
          doc.setFillColor(...bandColor(row.band.kind, C));
          doc.roundedRect(bx, by, bw, 18, 9, 9, 'F');
          doc.setTextColor(...bandTextColor(row.band.kind, C));
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(row.band.label.toUpperCase(), bx + 8, by + 12);
        }
      });
      return y + totalH;
    }
    function bandColor(kind, C) {
      switch (kind) {
        case 'good':    return [232, 245, 233];
        case 'warn':    return [255, 243, 224];
        case 'bad':     return [253, 236, 234];
        case 'unknown': return [236, 236, 236];
        default:        return C.GOLD_PALE;
      }
    }
    function bandTextColor(kind, C) {
      switch (kind) {
        case 'good':    return [46, 125, 50];
        case 'warn':    return [178, 106, 0];
        case 'bad':     return [198, 40, 40];
        case 'unknown': return [85, 85, 85];
        default:        return C.GOLD;
      }
    }
    function pdfPriority(doc, b, y, margin, contentW, pageH, C) {
      (b.items || []).forEach((it, i) => {
        const headLines = doc.splitTextToSize(it.heading || '', contentW - 60);
        const bodyLines = it.body ? doc.splitTextToSize(it.body, contentW - 60) : [];
        const cardH = 18 + headLines.length * 14 + (bodyLines.length ? bodyLines.length * 13 + 6 : 0) + 14;
        y = ensureSpace(doc, y, cardH + 8, pageH, margin);
        doc.setDrawColor(...C.WHISPER);
        doc.setLineWidth(0.6);
        doc.roundedRect(margin, y, contentW, cardH, 6, 6, 'S');
        // Number circle
        doc.setFillColor(...C.GOLD_PALE);
        doc.circle(margin + 22, y + 22, 11, 'F');
        doc.setTextColor(...C.PRIMARY);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(String(i + 1), margin + 22, y + 26, { align: 'center' });
        // Heading
        doc.setTextColor(...C.INK);
        doc.setFontSize(11);
        doc.text(headLines, margin + 44, y + 18);
        // Body
        if (bodyLines.length) {
          doc.setTextColor(...C.INK_MUTED);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(bodyLines, margin + 44, y + 18 + headLines.length * 14 + 4);
        }
        y += cardH + 8;
      });
      return y;
    }
    function pdfChecklist(doc, b, y, margin, contentW, pageH, C) {
      doc.setDrawColor(...C.WHISPER);
      doc.setLineWidth(0.6);
      const items = b.items || [];
      // Pre-compute heights
      const lineSets = items.map(it => doc.splitTextToSize(it, contentW - 60));
      const itemHs = lineSets.map(ls => Math.max(28, ls.length * 13 + 14));
      const totalH = itemHs.reduce((a, b) => a + b, 0);
      y = ensureSpace(doc, y, totalH + 4, pageH, margin);
      doc.roundedRect(margin, y, contentW, totalH, 6, 6, 'S');
      let cy = y;
      items.forEach((it, i) => {
        if (i > 0) doc.line(margin + 1, cy, margin + contentW - 1, cy);
        // Checkbox
        doc.setDrawColor(...C.GOLD);
        doc.setLineWidth(1);
        doc.roundedRect(margin + 18, cy + 10, 12, 12, 2, 2, 'S');
        doc.setDrawColor(...C.WHISPER);
        doc.setLineWidth(0.6);
        // Text
        doc.setTextColor(...C.INK);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.text(lineSets[i], margin + 40, cy + 18);
        cy += itemHs[i];
      });
      return cy;
    }
    function pdfPaired(doc, b, y, margin, contentW, pageH, C) {
      (b.items || []).forEach(it => {
        const stmtLines = doc.splitTextToSize(it.heading || '', contentW - 36);
        const reframeLines = it.reframe ? doc.splitTextToSize(it.reframe, contentW - 36) : [];
        const actionLines = it.action ? doc.splitTextToSize(it.action, contentW - 56) : [];
        const cardH = 22
          + stmtLines.length * 16
          + (it.scriptureRef ? 18 : 0)
          + (reframeLines.length ? reframeLines.length * 13 + 8 : 0)
          + (actionLines.length ? actionLines.length * 13 + 28 : 0);
        y = ensureSpace(doc, y, cardH + 10, pageH, margin);
        doc.setDrawColor(...C.WHISPER);
        doc.setLineWidth(0.6);
        doc.roundedRect(margin, y, contentW, cardH, 6, 6, 'S');
        let cy = y + 22;
        doc.setTextColor(...C.INK);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(stmtLines, margin + 18, cy);
        cy += stmtLines.length * 16 + 2;
        if (it.scriptureRef) {
          doc.setTextColor(...C.GOLD);
          doc.setFontSize(9);
          doc.text(it.scriptureRef.toUpperCase(), margin + 18, cy);
          cy += 16;
        }
        if (reframeLines.length) {
          doc.setTextColor(...C.INK);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          doc.text(reframeLines, margin + 18, cy);
          cy += reframeLines.length * 13 + 8;
        }
        if (actionLines.length) {
          doc.setFillColor(...C.GOLD_PALE);
          const actH = actionLines.length * 13 + 18;
          doc.roundedRect(margin + 14, cy, contentW - 28, actH, 4, 4, 'F');
          doc.setTextColor(...C.GOLD);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('ONE STEP', margin + 24, cy + 12);
          doc.setTextColor(...C.INK);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10.5);
          doc.text(actionLines, margin + 24, cy + 24);
          cy += actH + 4;
        }
        y += cardH + 12;
      });
      return y;
    }
  } // mount

  window.RWMQuiz = { mount };
})();
