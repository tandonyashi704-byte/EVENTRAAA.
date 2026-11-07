document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  const event = EVENT_BY_ID(id);
  const root = document.getElementById('detail');

  if (!event) {
    document.title = 'Event not found · EVENTRA';
    root.innerHTML = `<div class="wrap notfound"><h1>Event not found</h1><p>That link doesn't match any event. Browse the full list instead.</p><a class="btn" href="index.html#explore">Explore events</a></div>`;
    return;
  }

  document.title = `${event.title} · EVENTRA`;
  const alreadyRegistered = Store.registrations().some(registration =>
    registration.eventId === event.id
  );

  root.innerHTML = `
    <div class="detail-hero">
      <img src="${event.img}" alt="${esc(event.title)}" onerror="this.remove()">
    </div>
    <div class="wrap detail-body">
      <div>
        <p class="meta">${esc(event.cat)}</p>
        <h1>${esc(event.title)}</h1>
        <p class="lede">${esc(event.desc)}</p>
        <h2>Highlights</h2>
        <ul class="hl">${event.highlights.map(highlight => `<li>${esc(highlight)}</li>`).join('')}</ul>
      </div>
      <aside class="panel">
        <dl>
          <div><dt>Date</dt><dd>${fmtDate(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
          <div><dt>Time</dt><dd>${fmtTime(event.date)} IST</dd></div>
          <div><dt>Venue</dt><dd>${esc(event.venue)}, ${esc(event.city)}</dd></div>
          <div><dt>Organizer</dt><dd>${esc(event.org)}</dd></div>
        </dl>
        <div class="countdown-block" aria-label="Event countdown">
          <p class="countdown-label">TIME UNTIL EVENT</p>
          <div class="countdown" id="event-countdown" role="timer" aria-live="off">
            <span class="countdown-state">Calculating countdown…</span>
          </div>
        </section>
        <a class="btn mag" href="register.html?event=${encodeURIComponent(event.id)}">${alreadyRegistered ? 'Registered on this device' : 'Register now'}</a>
      </aside>
    </div>`;

  const countdown = document.getElementById('event-countdown');

  // Event dates are stored as local venue time (Bhubaneswar / IST), without a UTC suffix.
  // Parse that format explicitly so the countdown does not shift between browsers.
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(event.date);
  const eventTime = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5])).getTime()
    : new Date(event.date).getTime();

  if (!Number.isFinite(eventTime)) {
    countdown.innerHTML = '<span class="countdown-state">Event time unavailable</span>';
    return;
  }

  let timerId;
  const updateCountdown = () => {
    const remaining = eventTime - Date.now();

    if (remaining <= 0) {
      if (timerId) clearInterval(timerId);
      countdown.innerHTML = '<span class="countdown-state countdown-ended">The event has started</span>';
      return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    const units = [
      ['DAYS', days],
      ['HRS', hours],
      ['MIN', minutes],
      ['SEC', seconds]
    ];

    countdown.innerHTML = units.map(([label, value]) => `
      <span class="countdown-unit">
        <b>${String(value).padStart(2, '0')}</b>
        <small>${label}</small>
      </span>
    `).join('');
  };

  updateCountdown();
  timerId = window.setInterval(updateCountdown, 1000);
});
