/* Central event data + shared helpers */
const IMG = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`;
const EVENTS = [
  { id: 'k-lumina', title: 'K-Lumina Diwali Night', cat: 'Music & Festivals', date: '2026-11-14T18:00', venue: 'KIIT Campus 6 Grounds', city: 'Bhubaneswar', img: IMG('1470229722913-7c0e2dbbafd3'), org: 'Binary Boppers', featured: true,
    desc: 'The campus lights up for Diwali: live bands, a lantern walk, food stalls and a closing set under a thousand diyas.', highlights: ['Three live acts', 'Lantern walk at dusk', 'Student food market', 'Open to all campuses'] },
  { id: 'hack-sprint', title: 'SprintHack 36', cat: 'Hackathons', date: '2026-11-21T09:00', venue: 'Convention Centre, Hall B', city: 'Bhubaneswar', img: IMG('1531482615713-2afd69097998'), org: 'KIIT Developer Club', featured: true,
    desc: 'Thirty-six hours to build something that works. Teams of up to four pick a track, ship a prototype and demo to a live jury.', highlights: ['36-hour build', 'Mentors on call', 'Jury demo round', 'Prize pool of ₹1,50,000'] },
  { id: 'startup-pitch', title: 'Pitch Pit: Founders Edition', cat: 'Entrepreneurship', date: '2026-11-28T14:00', venue: 'E-Cell Auditorium', city: 'Bhubaneswar', img: IMG('1505373877841-8d25f7d46678'), org: 'KIIT E-Cell', featured: true,
    desc: 'Five minutes, one deck, a panel of investors. Early-stage student startups pitch for seed support and mentorship.', highlights: ['Investor panel', 'Live Q&A', 'Seed grants', 'Networking hour'] },
  { id: 'frame-lab', title: 'Frame Lab: Cinematography Workshop', cat: 'Workshops', date: '2026-12-05T10:00', venue: 'Media Studio 2', city: 'Bhubaneswar', img: IMG('1492684223066-81342ee5ff30'), org: 'Film Society',
    desc: 'A hands-on day on lighting, lens choice and camera movement, ending with a shot-for-shot recreation challenge.', highlights: ['Bring your own camera', 'Lighting kits provided', 'Shot recreation challenge'] },
  { id: 'ai-summit', title: 'Applied AI Summit', cat: 'Technology', date: '2026-12-12T09:30', venue: 'Main Auditorium', city: 'Bhubaneswar', img: IMG('1517048676732-d65bc937f952'), org: 'Tech Council',
    desc: 'Engineers talk about models that shipped. Talks cover agents, computer vision and deployment on a budget.', highlights: ['Six speakers', 'Live demos', 'Career corner'] },
  { id: 'inter-cricket', title: 'Inter-College Cricket Cup', cat: 'Sports', date: '2026-12-19T08:00', venue: 'University Cricket Ground', city: 'Bhubaneswar', img: IMG('1461896836934-ffe607ba8211'), org: 'Sports Board',
    desc: 'Sixteen colleges, T20 knockout format, floodlit finals. Spectators welcome for every match.', highlights: ['16 teams', 'Floodlit final', 'Live scoreboard'] },
  { id: 'mural-walk', title: 'Wall Stories: Mural Festival', cat: 'Art & Culture', date: '2027-01-09T11:00', venue: 'Old Town Lanes', city: 'Bhubaneswar', img: IMG('1460661419201-fd4cecdf8a8b'), org: 'Kala Collective',
    desc: 'Twenty artists paint the lanes over two days. Walk the route, meet the artists and try a spray-can session.', highlights: ['Guided walk', 'Artist meet-ups', 'Open paint wall'] },
  { id: 'iot-build', title: 'Build Night: IoT Workshop', cat: 'Workshops', date: '2027-01-16T17:00', venue: 'Electronics Lab 3', city: 'Bhubaneswar', img: IMG('1504384308090-c894fdcc538d'), org: 'Robotics Club',
    desc: 'Wire up a sensor node, push data to the cloud and leave with a working kit.', highlights: ['Kit included', 'Beginner friendly', 'Certificate'] },
  { id: 'dev-conf', title: 'DevConf East', cat: 'Technology', date: '2027-01-30T09:00', venue: 'Convention Centre', city: 'Bhubaneswar', img: IMG('1511578314322-379afb476865'), org: 'Open Source Eastern India',
    desc: 'A one-day developer conference on web, systems and open source, with workshops running in parallel.', highlights: ['Parallel tracks', 'Open source clinic', 'Speaker AMA'] },
  { id: 'sound-yard', title: 'Sound Yard Live', cat: 'Music & Festivals', date: '2027-02-06T19:00', venue: 'Open Air Theatre', city: 'Bhubaneswar', img: IMG('1540039155733-5bb30b53aa14'), org: 'Cultural Committee',
    desc: 'An evening of indie and electronic sets from student bands and two touring headliners.', highlights: ['Two headliners', 'Student stage', 'Late-night food'] },
  { id: 'ideathon', title: 'Ideathon: Climate Edition', cat: 'Hackathons', date: '2027-02-13T10:00', venue: 'Innovation Hub', city: 'Bhubaneswar', img: IMG('1519389950473-47ba0277781c'), org: 'KIIT E-Cell',
    desc: 'A one-day sprint to design solutions for urban climate problems, judged on feasibility and impact.', highlights: ['Team of 2–4', 'Expert feedback', 'Incubation fast-track'] }
];
const EVENT_BY_ID = id => EVENTS.find(e => e.id === id);
const fmtDate = (iso, o = { day: 'numeric', month: 'short' }) => new Date(iso).toLocaleDateString('en-IN', o);
const fmtTime = iso => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function eventRow(e) {
  const d = new Date(e.date);
  return `<li class="row"><a href="event.html?id=${e.id}" aria-label="${esc(e.title)}, ${fmtDate(e.date)}">
    <time datetime="${e.date}"><b>${d.getDate()}</b>${fmtDate(e.date, { month: 'short' })}</time>
    <span class="row-main"><strong>${esc(e.title)}</strong><small>${esc(e.cat)} · ${esc(e.venue)}</small></span>
    <img src="${e.img}" alt="" loading="lazy" width="160" height="100" onerror="this.remove()">
    <span class="row-go">View event</span></a></li>`;
}
