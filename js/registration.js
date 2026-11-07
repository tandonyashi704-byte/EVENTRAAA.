document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form'), E = form.elements, sel = E.event, params = new URLSearchParams(location.search);
  sel.innerHTML = '<option value="">Choose an event</option>' + EVENTS.map(e => `<option value="${e.id}">${esc(e.title)} (${fmtDate(e.date)})</option>`).join('');
  if (EVENT_BY_ID(params.get('event'))) sel.value = params.get('event');
  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email, like name@college.edu.',
    phone: v => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, '')) ? '' : 'Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.',
    event: v => v ? '' : 'Select the event you want to attend.'
  };
  const fields = [...form.elements].filter(f => rules[f.name]);
  const check = f => { const msg = rules[f.name](f.value), er = document.getElementById('err-' + f.name); er.textContent = msg; f.setAttribute('aria-invalid', !!msg); return !msg; };
  fields.forEach(f => { f.addEventListener('blur', () => check(f)); f.addEventListener('input', () => f.getAttribute('aria-invalid') === 'true' && check(f)); });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const bad = fields.filter(f => !check(f)); if (bad.length) { bad[0].focus(); return; }
    const status = document.getElementById('status'), btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Registering…'; status.textContent = '';
    setTimeout(() => {
      const r = Store.addRegistration({ name: E.name.value.trim(), email: E.email.value, phone: E.phone.value.trim(), eventId: sel.value });
      btn.disabled = false; btn.textContent = 'Complete registration';
      if (!r.ok) { status.textContent = r.reason === 'duplicate' ? 'This email is already registered for that event on this device.' : 'Could not save. Check that browser storage is enabled and try again.'; return; }
      const e = EVENT_BY_ID(r.rec.eventId), t = document.getElementById('ticket');
      t.innerHTML = `<h1>You're in.</h1><p class="lede">${esc(r.rec.name)}, your spot at <strong>${esc(e.title)}</strong> is saved.</p>
        <dl class="panel"><div><dt>Confirmation</dt><dd>${r.rec.id}</dd></div><div><dt>When</dt><dd>${fmtDate(e.date, { day: 'numeric', month: 'long', year: 'numeric' })}, ${fmtTime(e.date)}</dd></div><div><dt>Where</dt><dd>${esc(e.venue)}</dd></div></dl>
        <p class="note">Registrations are stored in this browser only (LocalStorage). They are not sent to a server.</p><a class="btn" href="index.html#explore">Explore more events</a>`;
      form.hidden = true; t.hidden = false; t.focus();
    }, 600);
  });
});
