const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded', () => {
  $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => { toggleTheme(); b.setAttribute('aria-pressed', document.documentElement.dataset.theme === 'light'); }));
  const nav = $('.nav'), menu = $('#menu'), burger = $('.burger');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40); onScroll(); addEventListener('scroll', onScroll, { passive: true });
  const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); document.body.classList.toggle('lock', open); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  $('.to-top')?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  if (!reduce && matchMedia('(hover:hover)').matches) $$('.mag').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
  if (!$('#featured')) return;
  const cats = ['Technology', 'Hackathons', 'Music & Festivals', 'Workshops', 'Sports', 'Entrepreneurship', 'Art & Culture'];
  const state = { q: '', cat: 'All', sort: 'asc' };
  $('#cat-list').innerHTML = cats.map(c => `<li><button class="cat" data-cat="${c}"><span>${c}</span><em>${(l=>`${l.length} ${l.length===1?'event':'events'}, next ${fmtDate(l.map(e=>e.date).sort()[0])}`)(EVENTS.filter(e => e.cat === c))}</em></button></li>`).join('');
  $('#cat-list').addEventListener('click', e => { const b = e.target.closest('.cat'); if (!b) return; state.cat = b.dataset.cat; syncChips(); render(); $('#explore').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
  const prev = $('.cat-prev'), pimg = $('img', prev);
  const showPrev = b => { const ev = EVENTS.find(e => e.cat === b.dataset.cat); if (ev) { pimg.src = ev.img; prev.classList.add('on'); } };
  $('#cat-list').addEventListener('mouseover', e => { const b = e.target.closest('.cat'); if (b) showPrev(b); });
  $('#cat-list').addEventListener('focusin', e => { const b = e.target.closest('.cat'); if (b) showPrev(b); });
  $('#cat-list').addEventListener('mouseleave', () => prev.classList.remove('on'));
  $('#cat-list').addEventListener('focusout', () => prev.classList.remove('on'));
  const f = EVENTS.filter(e => e.featured), big = f[0];
  $('#featured').innerHTML = `
    <a class="feat-big" href="event.html?id=${big.id}"><img src="${big.img}" alt="${esc(big.title)}" loading="lazy" onerror="this.remove()"><div><time class="stamp">${fmtDate(big.date)}</time><p>${esc(big.cat)} · ${esc(big.venue)}</p><h3>${esc(big.title)}</h3><p class="lede">${esc(big.desc)}</p><span class="btn">View event</span></div></a>
    <div class="feat-side">${f.slice(1).map((e, i) => `<a class="feat-s s${i}" href="event.html?id=${e.id}"><img src="${e.img}" alt="${esc(e.title)}" loading="lazy" onerror="this.remove()"><time class="stamp">${fmtDate(e.date)}</time><h3>${esc(e.title)}</h3><p>${esc(e.cat)} · ${esc(e.venue)}</p></a>`).join('')}</div>`;
  const chips = $('#chips'); chips.innerHTML = ['All', ...cats].map(c => `<button class="chip" data-cat="${c}" aria-pressed="false">${c}</button>`).join('');
  function syncChips() { $$('.chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.cat === state.cat)); }
  chips.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) { state.cat = c.dataset.cat; syncChips(); render(); } });
  $('#q').addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); render(); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  const clear = () => { state.q = ''; state.cat = 'All'; state.sort = 'asc'; $('#q').value = ''; $('#sort').value = 'asc'; syncChips(); render(); };
  $('#clear').addEventListener('click', clear); $('#empty-clear').addEventListener('click', clear);
  function render() {
    const list = EVENTS.filter(e => (state.cat === 'All' || e.cat === state.cat) && (!state.q || [e.title, e.cat, e.venue, e.org, e.desc].join(' ').toLowerCase().includes(state.q)))
      .sort((a, b) => state.sort === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    $('#count').textContent = `${list.length} ${list.length === 1 ? 'event' : 'events'}`;
    $('#results').innerHTML = list.map(eventRow).join('');
    $('#empty').hidden = list.length > 0;
    $('#clear').hidden = !(state.q || state.cat !== 'All' || state.sort !== 'asc');
  }
  syncChips(); render();
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .12 });
    $$('.reveal').forEach(el => io.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('in'));
});
