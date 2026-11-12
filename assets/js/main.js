(() => {
  /* ==========================================================
     Helpers
  ========================================================== */
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const body = document.body;
  const reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ==========================================================
     PROJECTS  (hero slider + "Selected work" grid use this)
     n   = name            u  = live URL
     k   = small label     t  = headline (can contain <em>)
     d   = description     tag = tech stack line
     c1,c2 = hero gradient pg = mock page bg  ac = accent color
     Tip: keep the text before " — " in `d` short (under ~120
     characters). The hero caption uses only that part.
  ========================================================== */
  const P = [
    {
      n: 'Activate Advocacy',
      u: 'https://activateadvocacy.co',
      k: 'ADVOCACY THAT MOVES CHANGE',
      t: 'Make your <em>voice matter.</em>',
      d: 'A fully dynamic WordPress site built with ACF and custom PHP, so the client can update complex content easily — with a hand-crafted UI beyond what standard builders offer.',
      c1: '#3b6f8a', c2: '#12303d', pg: '#f1efe8', ac: '#c4552d',
      tag: 'Full-stack WordPress · PHP · ACF · Custom CSS'
    },
    {
      n: 'Kloudify',
      u: 'https://kloudify.com',
      k: 'SMARTER DIGITAL EXPERIENCES',
      t: 'Make work <em>flow better.</em>',
      d: 'Led WordPress development in Bricks Builder with PHP, BEM-structured custom CSS and JavaScript — focused on speed, clean code architecture and responsive design.',
      c1: '#4a5fb0', c2: '#16213f', pg: '#e8edf6', ac: '#3159d8',
      tag: 'Bricks Builder · PHP · CSS (BEM) · JavaScript'
    },
    {
      n: 'Dry Fish BD',
      u: 'https://dryfish.bd',
      k: 'PURE, CHEMICAL-FREE SHUTKI',
      t: 'Taste the <em>real tradition.</em>',
      d: 'A Bengali WooCommerce store for chemical-free, sun-dried fish — products are grouped by type (shrimp, kachki, chela, loitta) with Regular and Premium grades, 250g / 500g / 1kg options, a slide-out cart, bKash, Nagad and cash on delivery, and WhatsApp ordering.',
      c1: '#a0522d', c2: '#3a1d0f', pg: '#f6ede0', ac: '#c2410c',
      tag: 'WordPress · Bricks Builder · WooCommerce · Custom CSS'
    },
    {
      n: 'Bunon BD',
      u: 'https://bunon.bd',
      k: 'HANDLOOM · TANGAIL',
      t: 'Woven by hand, <em>worn with pride.</em>',
      d: 'An e-commerce site for handloom sarees and handicrafts from Tangail — with colour and fabric filters (muslin, baluchuri, cotton, jamdani), product carousels, a wishlist, back-in-stock alerts, an artisan story section and a blog.',
      c1: '#8c2f39', c2: '#3a1118', pg: '#f5ece4', ac: '#8c2f39',
      tag: 'WordPress · Bricks Builder · WooCommerce · Custom CSS'
    },
    {
      n: 'TekHive',
      u: 'https://tekhive.net',
      k: 'PRECISION DIGITAL OPERATIONS',
      t: 'Your fractional <em>digital ops partner.</em>',
      d: 'A marketing site for a fractional digital-ops agency covering web engineering, creative ops and technical SEO — with a pricing page, case studies and a free 5-point site audit request form.',
      c1: '#2b3a55', c2: '#0d1424', pg: '#eef1f6', ac: '#f59e0b',
      tag: 'WordPress · Bricks Builder · JavaScript · Custom CSS'
    },
    {
      n: 'Fresh Ready Thailand',
      u: 'https://freshreadythailand.com',
      k: 'FARM-TO-HOME HEALTHY MEALS',
      t: 'Served <em>with love.</em>',
      d: 'A bilingual (Thai / English) site for a healthy ready-to-cook food brand — built around farm-to-home sourcing, nutritionist-designed meal plans, a recipe and community blog, a membership programme and LINE ordering.',
      c1: '#3f8f5a', c2: '#14341f', pg: '#eaf3e6', ac: '#2f9e44',
      tag: 'WordPress · Bricks Builder · WPML · SEO'
    }
  ];

  /* ==========================================================
     Render: hero scenes, floating windows and project grid
  ========================================================== */
  const pageMarkup = p =>
    `<small>${p.k}</small><strong>${p.t}</strong><div class="ln"><i></i><i></i><i></i></div><b>Explore our work ↗</b><span class="blob"></span>`;

  $('#scenes').innerHTML = P.map(p =>
    `<div class="scene" style="--c1:${p.c1};--c2:${p.c2}"></div>`
  ).join('');

  $('#wins').innerHTML = P.map(p =>
    `<a class="win" href="${p.u}" target="_blank" rel="noopener noreferrer" style="--pg:${p.pg};--ac:${p.ac}" aria-label="Visit ${p.n}">
       <div class="time"><span></span></div>
       <div class="bar"><i></i><i></i><i></i> ${p.u.replace('https://', '')}</div>
       <div class="page">${pageMarkup(p)}</div>
     </a>`
  ).join('');

  $('#grid').innerHTML = P.map(p =>
    `<article class="item rv">
       <a class="pic" href="${p.u}" target="_blank" rel="noopener noreferrer" style="--pg:${p.pg};--ac:${p.ac}" aria-label="Visit ${p.n}">
         <span class="nm">${p.n.toUpperCase()}</span>
         <strong>${p.t}</strong>
         <span class="blob"></span>
       </a>
       <div class="wh">
         <div><p class="eyebrow">Completed website</p><h3>${p.n}</h3></div>
         <a href="${p.u}" target="_blank" rel="noopener noreferrer">Visit site</a>
       </div>
       <p>${p.d}<br><br><b>${p.tag}</b></p>
     </article>`
  ).join('');

  /* ==========================================================
     Hero slider
  ========================================================== */
  const scenes = $$('.scene');
  const wins = $$('.win');
  const SLIDE_MS = 6500;
  let cur = 0, timer, startTime, raf;

  function show(i) {
    cur = (i + P.length) % P.length;
    const p = P[cur];
    const next = P[(cur + 1) % P.length];

    scenes.forEach((s, k) => s.classList.toggle('on', k === cur));
    wins.forEach((w, k) => w.classList.toggle('on', k === cur));

    $('#cn').textContent = `0${cur + 1} / 0${P.length} · PROJECT`;
    $('#ct').textContent = p.n;
    $('#cd').textContent = p.d.split(' — ')[0].slice(0, 120) + '…';
    $('#cl').href = p.u;

    $('#ni').style.setProperty('--c1', next.c1);
    $('#ni').style.setProperty('--c2', next.c2);
    $('#ni').style.background = `linear-gradient(135deg,${next.c1},${next.c2})`;
    $('#nn').textContent = next.n;

    clearTimeout(timer);
    cancelAnimationFrame(raf);

    const timeBar = wins[cur].querySelector('.time span');
    timeBar.style.width = '0';
    if (reduceMotion) return;

    startTime = performance.now();
    (function tick(t) {
      const k = Math.min(1, (t - startTime) / SLIDE_MS);
      timeBar.style.width = k * 100 + '%';
      if (k < 1) raf = requestAnimationFrame(tick);
      else show(cur + 1);
    })(startTime);
  }

  $('#pv').onclick = () => show(cur - 1);
  $('#nx').onclick = $('#nb').onclick = () => show(cur + 1);
  show(0);

  /* ==========================================================
     Expertise tabs
     [tab label, heading, description, tags]
  ========================================================== */
  const E = [
    ['WordPress themes', 'Custom theme development',
      'Fully custom WordPress themes written in PHP, with hooks and functions that extend what page builders can do — plus theme customisation and MySQL database management.',
      ['PHP', 'Custom hooks', 'MySQL', 'ACF']],
    ['Page builders', 'Bricks, Elementor, Divi',
      'High-performance, SEO-optimised websites with ultra-fast loading and responsive layouts, built in the page builder that suits the project.',
      ['Bricks Builder', 'Elementor Pro', 'Divi']],
    ['Design to code', 'Figma → website',
      'Complex Figma and Canva prototypes turned into functional interfaces with 100% design fidelity and tested across devices.',
      ['Figma', 'HTML5 / CSS3', 'Responsive']],
    ['Performance', 'Speed and clean code',
      'Speed optimisation, clean code architecture and cross-browser compatibility so every site feels fast and stays maintainable.',
      ['Core Web Vitals', 'BEM CSS', 'Git / GitHub']]
  ];

  $('#tabs').innerHTML = E.map((e, i) =>
    `<button role="tab" id="t${i}" aria-controls="p${i}" aria-selected="${!i}" tabindex="${i ? -1 : 0}">${e[0]}</button>`
  ).join('');

  $('#panels').innerHTML = E.map((e, i) =>
    `<div class="panel" role="tabpanel" id="p${i}" aria-labelledby="t${i}" ${i ? 'hidden' : ''}>
       <div class="dia" aria-hidden="true"><span></span><i></i><span></span><i></i><span></span></div>
       <h3>${e[1]}</h3>
       <p>${e[2]}</p>
       <ul>${e[3].map(x => `<li>${x}</li>`).join('')}</ul>
       <a class="tlink" href="#contact"><span>Ask about this</span><i class="mark"></i></a>
     </div>`
  ).join('');

  const tabs = $$('[role=tab]');
  tabs.forEach((tab, i) => {
    tab.onclick = () => {
      tabs.forEach((x, k) => {
        x.setAttribute('aria-selected', k === i);
        x.tabIndex = k === i ? 0 : -1;
        $('#p' + k).hidden = k !== i;
      });
    };
    tab.onkeydown = e => {
      const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (dir) {
        e.preventDefault();
        const nextTab = tabs[(i + dir + tabs.length) % tabs.length];
        nextTab.focus();
        nextTab.click();
      }
    };
  });

  /* ==========================================================
     Mobile menu
  ========================================================== */
  const menuBtn = $('#mb');
  const menu = $('#menu');

  const toggleMenu = open => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open);
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  menuBtn.onclick = () => toggleMenu(menu.hidden);
  menu.querySelectorAll('a').forEach(a => a.onclick = () => toggleMenu(false));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) {
      toggleMenu(false);
      menuBtn.focus();
    }
  });

  /* ==========================================================
     Reveal on scroll
  ========================================================== */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.rv').forEach(el => revealObserver.observe(el));

  /* ==========================================================
     Scroll progress + animated background color per section
  ========================================================== */
  const palette = {
    chalk: [243, 243, 239],
    mist: [217, 230, 232],
    blue: [40, 61, 157],
    carbon: [17, 25, 27],
    linen: [232, 224, 210],
    sage: [213, 225, 216],
    lavender: [225, 224, 237]
  };

  const toneSections = $$('[data-tone]');
  const progress = $('#pg');

  // relative luminance, used to pick white or dark text
  const luminance = c =>
    c.map(n => {
      n /= 255;
      return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);

  function paint() {
    const y = scrollY;
    const focus = y + innerHeight * 0.5;

    body.classList.toggle('top', y < innerHeight * 0.6);
    progress.style.width =
      (y / (document.documentElement.scrollHeight - innerHeight) * 100 || 0) + '%';

    const stops = toneSections.map(s => ({
      y: s.getBoundingClientRect().top + y,
      c: palette[s.dataset.tone]
    }));

    let i = 0;
    while (i < stops.length - 1 && stops[i + 1].y <= focus) i++;
    let color = stops[i].c;

    if (!reduceMotion && i < stops.length - 1) {
      const span = Math.max(1, Math.min(innerHeight * 1.1, (stops[i + 1].y - stops[i].y) * 0.78));
      let t = Math.max(0, Math.min(1, (focus - (stops[i + 1].y - span)) / span));
      t = t * t * (3 - 2 * t); // smoothstep
      color = color.map((n, k) => Math.round(n + (stops[i + 1].c[k] - n) * t));
    }

    body.style.setProperty('--bg', 'rgb(' + color + ')');
    body.style.setProperty('--ink', luminance(color) < 0.3 ? '#fff' : '#11191b');
  }

  addEventListener('scroll', () => requestAnimationFrame(paint), { passive: true });
  addEventListener('resize', paint);
  paint();
})();
