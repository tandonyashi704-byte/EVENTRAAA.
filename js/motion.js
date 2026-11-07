/* Motion layer: split text, scroll reveals, parallax, cursor, tilt. Skipped entirely for reduced-motion users. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  function words(h) { const t = h.textContent.trim().replace(/\s+/g, ' '); h.setAttribute('aria-label', t); h.textContent = '';
    t.split(' ').forEach((w, i, a) => { const m = el('span', 'wm'), n = el('span', 'wi', w); m.setAttribute('aria-hidden', 'true'); n.style.setProperty('--i', i); m.append(n); h.append(m); if (i < a.length - 1) h.append(' '); }); h.classList.add('split'); }
  function chars(h, cls) { const t = h.textContent; h.setAttribute('aria-label', t); h.textContent = ''; [...t].forEach(c => h.append(el('span', cls, c))); }
  document.addEventListener('DOMContentLoaded', () => {
    // hero headline: per-character entrance (lines keep their layout)
    const h1 = q('.hero h1'); let n = 0;
    if (h1) { h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
      qa(':scope > span', h1).forEach(line => { const t = line.textContent.trim(); line.textContent = ''; line.setAttribute('aria-hidden', 'true');
        t.split(' ').forEach((w, i, a) => { const wd = el('span', 'w'); [...w].forEach(c => { const s = el('span', 'ch', c); s.style.setProperty('--i', n++); wd.append(s); }); line.append(wd); if (i < a.length - 1) line.append(' '); }); }); }
    // section + page headings: masked word rise
    const heads = qa('h2, .reg h1, .detail-body h1, .notfound h1'); heads.forEach(words);
    // scroll-triggered reveals
    const stag = [['.cat-list li', 60], ['.feat-big', 0], ['.feat-s', 160], ['.tools', 0], ['.chips', 80], ['.count-line', 140], ['.about .meta', 0], ['.foot > div', 90], ['.legal', 0]];
    const rv = []; stag.forEach(([s, d]) => qa(s).forEach((e, i) => { e.classList.add('rv'); e.style.setProperty('--d', (d * i / 1000) + 's'); rv.push(e); }));
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .12, rootMargin: '0px 0px -2% 0px' });
    [...rv, ...heads].forEach(e => io.observe(e));
    // scrubbed about text
    const ap = q('.about p:not(.meta)'), aw = [];
    if (ap) { const t = ap.textContent.trim(); ap.setAttribute('aria-label', t); ap.textContent = ''; t.split(' ').forEach((w, i, a) => { const s = el('span', 'aw', w); s.setAttribute('aria-hidden', 'true'); ap.append(s); aw.push(s); if (i < a.length - 1) ap.append(' '); }); }
    // footer wordmark: hoverable letters
    const big = q('.foot .big'); if (big) chars(big, 'c');
    // progress bar
    const prog = el('div', 'progress'); prog.setAttribute('aria-hidden', 'true'); document.body.append(prog);
    // custom cursor ring (mouse devices only)
    let cx = -100, cy = -100, tx = -100, ty = -100, ring = null;
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      ring = el('div', 'cursor'); ring.setAttribute('aria-hidden', 'true'); document.body.append(ring);
      addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; ring.classList.add('vis'); ring.classList.toggle('hot', !!e.target.closest('a,button,input,select,.cat')); });
      document.documentElement.addEventListener('mouseleave', () => ring.classList.remove('vis'));
      // card tilt + image drift
      qa('.feat-big, .feat-s').forEach(c => {
        c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          c.style.setProperty('--mx', px * 2); c.style.setProperty('--my', py * 2); c.style.transform = `perspective(1000px) rotateX(${-py * 4}deg) rotateY(${px * 5}deg)`; });
        c.addEventListener('pointerleave', () => { c.style.transform = ''; c.style.setProperty('--mx', 0); c.style.setProperty('--my', 0); });
      });
    }
    // result count bump
    const cnt = q('#count'); if (cnt) new MutationObserver(() => { cnt.classList.remove('bump'); void cnt.offsetWidth; cnt.classList.add('bump'); }).observe(cnt, { childList: true, characterData: true, subtree: true });
    // theme toggle: spin icon + eased colour change
    qa('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => {
      const root = document.documentElement; root.classList.add('theme-anim'); clearTimeout(window.__tt); window.__tt = setTimeout(() => root.classList.remove('theme-anim'), 800);
      const s = q('svg', b); if (s) { const r = (+s.dataset.r || 0) + 180; s.dataset.r = r; s.style.rotate = r + 'deg'; } }));
    // one rAF loop: progress, hero parallax, marquee speed from scroll velocity, about scrub, cursor follow
    const hImg = q('.hero-img'), l2 = q('.hero h1 .l2'), l3 = q('.hero h1 .l3'), track = q('.track');
    const anim = track && track.getAnimations ? track.getAnimations()[0] : null; let last = scrollY, rate = 1;
    (function loop() {
      if (!document.hidden) {
        const y = scrollY, v = Math.abs(y - last); last = y;
        prog.style.scale = (y / Math.max(1, document.documentElement.scrollHeight - innerHeight)) + ' 1';
        if (hImg && y < innerHeight * 1.3) { hImg.style.translate = `0 ${-y * .07}px`; if (l2) l2.style.translate = `${y * .14}px 0`; if (l3) l3.style.translate = `${-y * .1}px 0`; }
        if (anim) { rate += (1 + Math.min(v * .7, 12) - rate) * .1; anim.playbackRate = rate; }
        if (aw.length) { const r = ap.getBoundingClientRect(), p = clamp((innerHeight * .92 - r.top) / (innerHeight * .5)); aw.forEach((s, i) => { s.style.opacity = (.18 + .82 * clamp(p * aw.length * 1.15 - i)).toFixed(2); }); }
        if (ring) { cx += (tx - cx) * .2; cy += (ty - cy) * .2; ring.style.translate = `${cx}px ${cy}px`; }
      }
      requestAnimationFrame(loop);
    })();
    // page headings that load in view
    requestAnimationFrame(() => heads.forEach(h => { if (h.closest('.reg, .detail-body, .notfound')) h.classList.add('in'); }));
  });
})();
