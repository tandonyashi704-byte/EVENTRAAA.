/* Storage + theme. Loaded in <head> so the theme applies before first paint. */
const Store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  registrations() { return Store.get('eventra:regs', []); },
  addRegistration(r) {
    const all = Store.registrations();
    const email = r.email.trim().toLowerCase();
    if (all.some(x => x.email === email && x.eventId === r.eventId)) return { ok: false, reason: 'duplicate' };
    const rec = { ...r, email, id: 'EVT-' + Date.now().toString(36).toUpperCase(), at: new Date().toISOString() };
    return Store.set('eventra:regs', [...all, rec]) ? { ok: true, rec } : { ok: false, reason: 'storage' };
  }
};
(function () {
  const saved = Store.get('eventra:theme', null);
  document.documentElement.dataset.theme = saved || 'dark';
})();
function toggleTheme() {
  const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = n; Store.set('eventra:theme', n);
}
