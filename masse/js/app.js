import * as P from './program.js';
import * as S from './store.js';

// ---------- Utilitaires ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fr = (n, d = 1) => (n == null || isNaN(n) ? '–' : String(Math.round(n * 10 ** d) / 10 ** d).replace('.', ','));
const kgStr = (n) => (n == null || n === '' || isNaN(n) ? '–' : fr(n, 2));
const DMY = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
const DFULL = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const dshort = (iso) => DMY.format(S.parseISO(iso)).replace('.', '');
const mmss = (sec) => { sec = Math.max(0, Math.round(sec)); const m = Math.floor(sec / 60); return `${m}:${String(sec % 60).padStart(2, '0')}`; };
const hm = (ms) => { const m = Math.round(ms / 60000); return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}` : `${m} min`; };
const repsLabel = (e) => (e.lo === e.hi ? `${e.lo}` : `${e.lo}-${e.hi}`);
const restLabel = (sec) => (sec >= 60 ? `${Math.floor(sec / 60)}'${sec % 60 ? String(sec % 60).padStart(2, '0') : ''}` : `${sec} s`);
const haptic = () => { try { navigator.vibrate && navigator.vibrate(12); } catch (e) { /* iOS */ } };

const I = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10.5L12 3.5l8.5 7"/><path d="M5.5 9v10.5a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1V9"/></svg>',
  chev: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  coach: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z"/><path d="M8.5 9.5h7M8.5 12.5h4"/></svg>',
  prog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="4.5" width="17" height="16" rx="3"/><path d="M8 2.5v4M16 2.5v4M3.5 9.5h17"/><circle cx="8.5" cy="14" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="14" r="1.2" fill="currentColor" stroke="none"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 19.5h17"/><path d="M5 15l4.5-4.5 3.5 3 6.5-7"/><path d="M15 6.5h4.5V11"/></svg>',
  body: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="4" width="17" height="16.5" rx="4.5"/><path d="M8 9.5a5 5 0 0 1 8 0"/><path d="M12 9.5l1.6-2"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4L3 8l4 4"/><path d="M3 8h13"/><path d="M17 20l4-4-4-4"/><path d="M21 16H8"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  fork: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 3c-2 2-2.5 5-2.5 8h2.5v10"/></svg>',
};

// ---------- État de l'interface ----------
const ui = {
  tab: 'coach', progType: 'A', faq: [], sid: null, openEx: null,
  wDraft: null, entry: null, loaderSeen: {}, clock: null, wake: null, audio: null, restFired: false,
};

const view = $('#view');
const sessionEl = $('#session');
const restEl = $('#rest');

function theme(week) {
  document.documentElement.dataset.block = String(P.blockOf(week).id);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = '#101316';
}

// ---------- Rendu des onglets ----------
function render() {
  const w = ui.sid && S.state.sessions[ui.sid] ? S.state.sessions[ui.sid].week : S.currentWeek();
  theme(w);
  const fn = { coach: viewToday, programme: viewProgramme, progres: viewProgres, corps: viewCorps }[ui.tab];
  view.innerHTML = fn();
  document.querySelectorAll('.tabbar button').forEach((b) => b.setAttribute('aria-current', b.dataset.tab === ui.tab ? 'page' : 'false'));
}

function ribbon(cw) {
  return `<button class="ribbon" data-act="tab" data-tab="programme" aria-label="Voir le programme">${P.BLOCKS.map((b) => {
    let cells = '';
    for (let w = b.weeks[0]; w <= b.weeks[1]; w++) {
      const n = ['A', 'B', 'C'].filter((t) => S.isDone(S.sessionId(w, t))).length;
      const cls = [n === 3 ? 'full' : n ? 'part' : '', w === cw ? 'now' : '', P.isDeload(w) ? 'deload' : ''].join(' ');
      cells += `<i class="${cls}" style="--bc:${b.color};--pct:${Math.round((n / 3) * 100)}%"></i>`;
    }
    return `<span class="blk">${cells}</span>`;
  }).join('')}</button>`;
}

function plateBadge(block, size) {
  return `<span class="plate-badge" style="--pc:${block.color}${size ? `;width:${size}px;height:${size}px` : ''}" aria-hidden="true"><span>${block.plate}</span></span>`;
}

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Salut' : 'Bonsoir';
}

function bubble(html, cls = 'coach') { return `<div class="msg ${cls}">${html}</div>`; }

// Un seul message du coach, le plus utile du moment
function coachTip(cw, info, nx) {
  const st = S.state; const today = S.todayISO();
  const doneThisWeek = ['A', 'B', 'C'].filter((t) => S.isDone(S.sessionId(cw, t))).length;
  const cal = S.calendarWeek();
  const done = S.doneSessions(); const last = done[done.length - 1];
  const lastB = st.lastBackup ? Date.now() - new Date(st.lastBackup).getTime() : Infinity;
  const adv = S.weightAdvice();
  if (today < st.settings.start) return { text: `Le programme démarre ${DFULL.format(S.parseISO(st.settings.start))}. D'ici là, cale tes repas : 4 par jour, ${st.settings.protein} g de protéines.` };
  if (today >= st.settings.start && cal - cw >= 2 && cal <= 32) return { text: `Le calendrier dit semaine ${cal}. On reprend là où tu t'es arrêté, avec 5 % de moins sur les charges après une pause.`, btn: `<button class="btn small" data-act="catchup" data-to="${cal}">Passer à la semaine ${cal}</button>` };
  if (last && last.endedAt && Date.now() - last.endedAt < 20 * 3600000) {
    const recs = S.records(last);
    if (recs.length) return { text: `${recs.length === 1 ? 'Un record' : `${recs.length} records`} à ta dernière séance : ${recs.slice(0, 2).map((r) => `${r.name.toLowerCase()} ${kgStr(r.kg)} × ${r.reps}`).join(', ')}. Continue comme ça.` };
  }
  if (info.wib === 1 && doneThisWeek === 0 && !nx.inProgress) return { text: `Nouveau bloc : ${info.block.name}. ${info.block.goal}` };
  if (info.deload && doneThisWeek === 0) return { text: 'Semaine de déload : moitié des séries, charges -10 %, RIR 4. Tu dois sortir de la salle frais.' };
  if (adv && adv.verdict !== 'keep') return { text: adv.verdict === 'up' ? `Ta moyenne bouge de ${fr(adv.delta, 2)} kg par semaine, c'est trop lent. Ajoute 200 kcal par jour : un verre de lait et 30 g de beurre de cacahuète.` : `Tu prends ${fr(adv.delta, 2)} kg par semaine, c'est un peu rapide. Retire 150 kcal par jour.` };
  if (done.length >= 2 && lastB > 7 * 86400000) return { text: 'Tes données restent sur ce téléphone. Fais une sauvegarde de temps en temps dans iCloud Drive.', btn: '<button class="btn small" data-act="export">Sauvegarder</button>' };
  if (adv) return { text: `Tu prends ${fr(adv.delta, 2)} kg par semaine : pile dans la cible. ${info.consigne}` };
  return { text: info.consigne };
}

function viewToday() {
  const st = S.state;
  const cw = S.currentWeek();
  const info = P.weekInfo(cw);
  const nx = S.nextSession();
  const today = S.todayISO();
  const tpl = S.template(nx.week, nx.type);
  const id = S.sessionId(nx.week, nx.type);
  const log = S.getLog(id);
  const dur = P.sessionDurationEstimate(tpl);
  const total = tpl.exercises.reduce((a, e) => a + e.sets, 0);
  const progress = log ? log.ex.reduce((a, x) => a + x.sets.filter((s) => s.done).length, 0) : 0;

  // Liste des exercices avec la charge visée
  const lines = tpl.exercises.map((e) => {
    const x = log && log.ex.find((l) => l.slot === e.slot);
    const doneN = x ? x.sets.filter((s) => s.done).length : 0;
    const sg = S.suggestion(e, id);
    const right = sg.kg != null ? `${kgStr(sg.kg)}<small>×</small>${sg.reps}` : '<small>à caler</small>';
    return `<li class="${x && doneN === x.sets.length && doneN ? 'ok' : ''}"><span class="sl num">${esc(e.slot)}</span><span class="en">${esc(e.name)}</span><span class="tg num">${right}</span></li>`;
  }).join('');

  // Cette semaine
  const tiles = ['A', 'B', 'C'].map((t) => {
    const sid = S.sessionId(cw, t); const l = S.getLog(sid);
    const isNext = nx.week === cw && nx.type === t;
    const status = S.isDone(sid) ? `Faite ${l.date ? dshort(l.date) : ''}` : S.isSkipped(sid) ? 'Passée' : l ? 'En cours' : isNext ? 'Aujourd\'hui' : 'À faire';
    const cls = S.isDone(sid) ? 'done' : S.isSkipped(sid) ? 'skip' : isNext ? 'next' : '';
    return `<button class="tile ${cls}" data-act="preview" data-w="${cw}" data-t="${t}"><span class="tl num">${t}</span><b>${P.SESSION_META[t].name}</b><small>${status}</small></button>`;
  }).join('');

  // Ma journée
  const lw = S.lastWeight();
  if (ui.wDraft == null) ui.wDraft = st.weights[today] ?? (lw ? lw.kg : st.settings.weight0);
  const weighed = st.weights[today] != null;
  const h = st.habits[today] || {};
  const habitsDef = [['meals', '4 repas'], ['protein', `${st.settings.protein} g de protéines`], ['creatine', 'Créatine']];
  const nDay = (weighed ? 1 : 0) + habitsDef.filter(([k]) => h[k]).length;
  const tip = coachTip(cw, info, nx);

  return `
    <header class="today-head">
      <span class="today-date">${greeting()} ${esc(st.settings.name)}, on est ${esc(DFULL.format(new Date()))}.</span>
      <button class="icon-btn" data-act="settings" aria-label="Réglages">${I.gear}</button>
    </header>
    <button class="week-strip" data-act="tab" data-tab="programme" aria-label="Voir le programme">
      ${plateBadge(info.block, 40)}
      <span class="ws-txt"><b class="ws-h">Semaine ${cw}<span> sur 32</span></b><small>Bloc ${info.block.id}, ${esc(info.block.name)}, RIR ${esc(info.rir)}</small></span>
      <span class="ws-arrow">${I.chev}</span>
    </button>
    ${ribbon(cw)}

    <section class="session-card">
      <div class="sc-top">
        <span class="sc-letter num">${nx.type}</span>
        <div class="sc-title">
          <span class="sc-kicker">${nx.inProgress ? 'Séance en cours' : nx.week === cw ? 'Prochaine séance' : `Semaine ${nx.week}`}</span>
          <h2>${esc(tpl.meta.name)}</h2>
          <span class="sc-sub">${nx.inProgress ? `${progress} séries sur ${total}` : `${tpl.exercises.length} exercices, environ ${dur} min`}</span>
        </div>
      </div>
      <ol class="sc-list">${lines}</ol>
      <div class="sc-actions">
        ${nx.inProgress
    ? '<button class="btn primary grow big" data-act="resume">Reprendre la séance</button>'
    : `<button class="btn primary grow big" data-act="start" data-w="${nx.week}" data-t="${nx.type}">Démarrer la séance</button>`}
      </div>
    </section>

    <div class="section-title"><h2>Cette semaine</h2><span>${['A', 'B', 'C'].filter((t) => S.isDone(S.sessionId(cw, t))).length} sur 3</span></div>
    <div class="tiles">${tiles}</div>

    <div class="section-title"><h2>Ma journée</h2><span>${nDay} sur 4</span></div>
    <div class="day card">
      <div class="day-row weigh-row ${weighed ? 'on' : ''}">
        <span class="tick">${weighed ? I.check : ''}</span>
        <span class="dl">Pesée du matin<small>${weighed ? `Notée : ${fr(st.weights[today], 1)} kg` : lw ? `Dernière : ${fr(lw.kg, 1)} kg` : 'À jeun, après les toilettes'}</small></span>
        <span class="mini-step">
          <button data-act="wstep" data-d="-0.1" aria-label="Moins 100 g">−</button>
          <span class="num" id="wval">${fr(ui.wDraft, 1)}</span>
          <button data-act="wstep" data-d="0.1" aria-label="Plus 100 g">+</button>
        </span>
        <button class="btn small ${weighed ? '' : 'primary'}" data-act="wsave">${weighed ? 'Modifier' : 'Noter'}</button>
      </div>
      ${habitsDef.map(([k, label]) => `<button class="day-row ${h[k] ? 'on' : ''}" data-act="habit" data-k="${k}" aria-pressed="${!!h[k]}"><span class="tick">${h[k] ? I.check : ''}</span><span class="dl">${esc(label)}</span></button>`).join('')}
    </div>

    <div class="section-title"><h2>Le coach</h2></div>
    <div class="coach-card card">
      <span class="coach-dot" aria-hidden="true"></span>
      <div><p>${esc(tip.text)}</p>${tip.btn ? `<div class="btn-row" style="margin-top:10px">${tip.btn}</div>` : ''}</div>
    </div>
    <button class="ask" data-act="faqsheet">Poser une question au coach ${I.chev}</button>`;
}

function faqSheet(open = -1) {
  openSheet(`<h2>Questions au coach</h2><p class="lead">Les réponses tirées de ton programme.</p>
    <div class="faq">${P.FAQ.map((f, i) => `<details ${i === open ? 'open' : ''}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`);
}

// ---------- Programme ----------
function viewProgramme() {
  const cw = S.currentWeek();
  return `
    <div class="topbar"><h1>Programme</h1></div>
    <p class="muted" style="margin:0 2px 4px;font-size:14.5px">32 semaines, 4 blocs. Chaque bloc prend la couleur d'un disque : la charge monte, la couleur aussi.</p>
    ${P.BLOCKS.map((b) => {
    let rows = '';
    for (let w = b.weeks[0]; w <= b.weeks[1]; w++) {
      const info = P.weekInfo(w);
      const d = S.weekDates(w);
      const dots = ['A', 'B', 'C'].map((t) => {
        const id = S.sessionId(w, t);
        const cls = S.isDone(id) ? 'done' : S.isSkipped(id) ? 'skip' : S.state.active === id ? 'live' : '';
        return `<span class="dot ${cls}" style="--bc:${b.color}">${t}</span>`;
      }).join('');
      rows += `<button class="week-row ${w === cw ? 'now' : ''} ${info.deload ? 'deload' : ''}" data-act="week" data-w="${w}">
        <span class="wn num">S${w}</span>
        <span class="wd">${dshort(d.from)} – ${dshort(d.to)}<small>${info.test ? 'Tests et bilan' : info.deload ? 'Déload' : `RIR ${esc(info.rir)}`}${info.plus ? '' : ''}</small></span>
        <span class="dots">${dots}</span></button>`;
    }
    return `
      <div class="block-head">${plateBadge(b, 50)}<div><h2>Bloc ${b.id}, ${esc(b.name)}</h2><p>Semaines ${b.weeks[0]} à ${b.weeks[1]}, disque de ${b.plate} kg</p></div></div>
      <p class="block-goal">${esc(b.goal)}</p>
      <details class="why"><summary>Ce qui change et pourquoi</summary><ul>${b.why.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>
      <div class="weeks">${rows}</div>`;
  }).join('')}`;
}

// ---------- Progrès ----------
function sparkline(vals, color, w = 86, h = 30) {
  if (vals.length < 2) return `<svg class="chart" viewBox="0 0 ${w} ${h}"><circle cx="${w - 4}" cy="${h / 2}" r="3" fill="${color}"/></svg>`;
  const mn = Math.min(...vals); const mx = Math.max(...vals); const span = mx - mn || 1;
  const pts = vals.map((v, i) => [4 + (i * (w - 8)) / (vals.length - 1), h - 4 - ((v - mn) / span) * (h - 8)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const lp = pts[pts.length - 1];
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${lp[0]}" cy="${lp[1]}" r="3" fill="${color}"/></svg>`;
}

function lineChart(series, { w = 340, h = 170, yFmt = (v) => fr(v, 0), xLabels = [], guide = null } = {}) {
  // series: [{ pts:[{x,y}], color, dots, width, dash }]
  const all = series.flatMap((s) => s.pts);
  if (guide) all.push(...guide.pts);
  if (!all.length) return '<div class="empty">Pas encore de données.</div>';
  const xs = all.map((p) => p.x); const ys = all.map((p) => p.y);
  const x0 = Math.min(...xs); const x1 = Math.max(...xs, x0 + 1);
  let y0 = Math.min(...ys); let y1 = Math.max(...ys);
  const pad = (y1 - y0) * 0.12 || 1; y0 -= pad; y1 += pad;
  const L = 34; const R = 8; const T = 10; const B = 22;
  const sx = (x) => L + ((x - x0) / (x1 - x0)) * (w - L - R);
  const sy = (y) => T + (1 - (y - y0) / (y1 - y0)) * (h - T - B);
  let g = '';
  for (let i = 0; i <= 3; i++) {
    const v = y0 + ((y1 - y0) * i) / 3; const y = sy(v);
    g += `<line x1="${L}" x2="${w - R}" y1="${y}" y2="${y}" stroke="rgba(238,237,232,.07)"/><text x="${L - 6}" y="${y + 3.5}" text-anchor="end">${yFmt(v)}</text>`;
  }
  xLabels.forEach(({ x, label }) => { g += `<text x="${sx(x)}" y="${h - 5}" text-anchor="middle">${label}</text>`; });
  const path = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(' ');
  if (guide) g += `<path d="${path(guide.pts)}" fill="none" stroke="${guide.color}" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  series.forEach((s) => {
    if (s.line !== false && s.pts.length > 1) g += `<path d="${path(s.pts)}" fill="none" stroke="${s.color}" stroke-width="${s.width || 2.4}" stroke-linejoin="round" stroke-linecap="round"/>`;
    if (s.dots) s.pts.forEach((p) => { g += `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="${s.r || 3}" fill="${s.color}"/>`; });
  });
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${g}</svg>`;
}

function barChart(items, { w = 340, h = 150 } = {}) {
  // items: [{ x (semaine), v, color }]
  const max = Math.max(1, ...items.map((i) => i.v));
  const L = 6; const B = 20; const gap = 2;
  const n = 32; const bw = (w - L * 2) / n - gap;
  let g = '';
  items.forEach((it) => {
    const bh = (it.v / max) * (h - B - 8);
    const x = L + (it.x - 1) * (bw + gap);
    g += `<rect x="${x}" y="${h - B - bh}" width="${bw}" height="${Math.max(bh, it.v ? 2 : 0)}" rx="2" fill="${it.color}"/>`;
  });
  [1, 9, 17, 25, 32].forEach((wk) => { g += `<text x="${L + (wk - 1) * (bw + gap) + bw / 2}" y="${h - 5}" text-anchor="middle">S${wk}</text>`; });
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${g}</svg>`;
}

function exerciseNamesFor(type) {
  const names = [];
  S.template(S.currentWeek(), type).exercises.forEach((e) => { if (!names.includes(e.name)) names.push(e.name); });
  Object.values(S.state.sessions).filter((l) => l.type === type).forEach((l) => l.ex.forEach((x) => { if (!names.includes(x.name)) names.push(x.name); }));
  return names;
}

function metricOf(h, name) {
  const pdc = (P.EX[name] || {}).eq === 'pdc';
  if (pdc && h.best === 0) return { v: Math.max(...h.sets.map((s) => s.reps)), unit: 'reps' };
  return { v: h.best, unit: 'kg' };
}

// ---------- Stats semaine par semaine ----------
function weekStats(w) {
  const logs = ['A', 'B', 'C'].map((t) => S.getLog(S.sessionId(w, t))).filter((l) => l && l.done);
  const sets = logs.reduce((a, l) => a + l.ex.reduce((b, x) => b + x.sets.filter((q) => q.done).length, 0), 0);
  const planned = ['A', 'B', 'C'].reduce((a, t) => a + S.template(w, t).exercises.reduce((b, e) => b + e.sets, 0), 0);
  const ton = {}; logs.forEach((l) => { ton[l.type] = S.sessionTonnage(l); });
  const durs = logs.filter((l) => l.endedAt && l.startedAt).map((l) => (l.endedAt - l.startedAt) / 60000);
  const prs = logs.reduce((a, l) => a + S.records(l).length, 0);
  const d = S.weekDates(w);
  const ws = S.weightEntries().filter((x) => x.date >= d.from && x.date <= d.to);
  const best = (re) => { let m = 0; logs.forEach((l) => l.ex.forEach((x) => { if (re.test(x.name)) x.sets.forEach((q) => { if (q.done) m = Math.max(m, S.e1rm(q.kg, q.reps)); }); })); return m || null; };
  return {
    w, n: logs.length, sets, planned, ton, tonnage: Object.values(ton).reduce((a, b) => a + b, 0),
    dur: durs.length ? durs.reduce((a, b) => a + b, 0) / durs.length : null, prs,
    weight: ws.length ? ws.reduce((a, x) => a + x.kg, 0) / ws.length : null,
    bench: best(/^Développé couché barre/), squat: best(/^Squat barre/),
  };
}

function stackedBars(rows, { w = 340, h = 160 } = {}) {
  // rows: [{ x, parts: [{ v, color }] }] pour les semaines 1 à 32
  const max = Math.max(1, ...rows.map((r) => r.parts.reduce((a, p) => a + p.v, 0)));
  const L = 6; const B = 20; const gap = 2; const bw = (w - L * 2) / 32 - gap;
  let g = '';
  rows.forEach((r) => {
    let y = h - B; const x = L + (r.x - 1) * (bw + gap);
    r.parts.forEach((p) => { const bh = (p.v / max) * (h - B - 8); if (bh <= 0) return; y -= bh; g += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${p.color}" fill-opacity="${p.op ?? 1}" stroke="#1a1f24" stroke-width=".6"/>`; });
  });
  [1, 9, 17, 25, 32].forEach((wk) => { g += `<text x="${L + (wk - 1) * (bw + gap) + bw / 2}" y="${h - 5}" text-anchor="middle">S${wk}</text>`; });
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${g}</svg>`;
}

function setsBars(rows, { w = 340, h = 130 } = {}) {
  const max = Math.max(1, ...rows.map((r) => Math.max(r.planned, r.sets)));
  const L = 6; const B = 20; const gap = 2; const bw = (w - L * 2) / 32 - gap;
  let g = '';
  rows.forEach((r) => {
    const x = L + (r.w - 1) * (bw + gap);
    const ph = (r.planned / max) * (h - B - 8); const sh = (r.sets / max) * (h - B - 8);
    g += `<rect x="${x}" y="${h - B - ph}" width="${bw}" height="${ph}" fill="none" stroke="rgba(238,237,232,.18)" stroke-width="1"/>`;
    if (sh) g += `<rect x="${x}" y="${h - B - sh}" width="${bw}" height="${sh}" fill="${P.blockOf(r.w).color}"/>`;
  });
  [1, 9, 17, 25, 32].forEach((wk) => { g += `<text x="${L + (wk - 1) * (bw + gap) + bw / 2}" y="${h - 5}" text-anchor="middle">S${wk}</text>`; });
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${g}</svg>`;
}

function deltaCell(cur, prev, fmt, unit = '', invert = false) {
  if (cur == null) return '<span class="dv faint">–</span>';
  let d = '';
  if (prev != null && prev !== 0) {
    const diff = cur - prev;
    if (Math.abs(diff) > 1e-9) d = `<small class="${(diff > 0) !== invert ? 'up' : 'down'}">${diff > 0 ? '+' : '−'}${fmt(Math.abs(diff))}${unit}</small>`;
  }
  return `<span class="dv num">${fmt(cur)}${unit ? `<i>${unit}</i>` : ''}</span>${d}`;
}

function weeklySection() {
  const cw = S.currentWeek();
  const rows = []; for (let w = 1; w <= Math.min(32, cw); w++) rows.push(weekStats(w));
  // Semaine en cours si elle a déjà une séance, sinon la dernière semaine terminée
  let ci = rows.length - 1; if (!rows[ci].n && ci > 0) ci--;
  const cur = rows[ci]; const prev = ci > 0 ? rows[ci - 1] : null;
  const any = rows.some((r) => r.n);
  if (!any) return '<div class="section-title"><h2>Semaine par semaine</h2></div><div class="card empty">Les comparaisons apparaissent après ta première séance.</div>';
  const t = (v) => fr(v / 1000, 1);
  const cmp = [
    ['Séances', cur.n, prev && prev.n, (v) => String(v), ''],
    ['Séries', cur.sets, prev && prev.sets, (v) => String(v), ''],
    ['Tonnage', cur.tonnage || null, prev && prev.tonnage, t, ' t'],
    ['Durée moyenne', cur.dur, prev && prev.dur, (v) => fr(v, 0), ' min'],
    ['Records', cur.prs, prev && prev.prs, (v) => String(v), ''],
    ['Poids moyen', cur.weight, prev && prev.weight, (v) => fr(v, 1), ' kg'],
  ];
  const shade = { A: 1, B: 0.68, C: 0.42 };
  const stacked = rows.filter((r) => r.n).map((r) => ({ x: r.w, parts: ['A', 'B', 'C'].map((ty) => ({ v: r.ton[ty] || 0, color: P.blockOf(r.w).color, op: shade[ty] })) }));
  const strength = [
    { pts: rows.filter((r) => r.bench).map((r) => ({ x: r.w, y: r.bench })), color: 'var(--acc)', dots: true },
    { pts: rows.filter((r) => r.squat).map((r) => ({ x: r.w, y: r.squat })), color: 'var(--chalk)', dots: true },
  ];
  const durs = rows.filter((r) => r.dur).map((r) => ({ x: r.w, y: r.dur }));
  const ws = rows.filter((r) => r.n).map((r) => r.w); const stepX = Math.max(1, Math.ceil(ws.length / 6));
  const xl = ws.filter((_, i) => i % stepX === 0 || i === ws.length - 1).map((x) => ({ x, label: `S${x}` }));
  return `
    <div class="section-title"><h2>Semaine par semaine</h2><span>S${cur.w} comparée à S${prev ? prev.w : '–'}</span></div>
    <div class="cmp">${cmp.map(([l, c, p, f, u]) => `<div class="cmp-cell"><span class="cl">${l}</span>${deltaCell(c, p, f, u)}</div>`).join('')}</div>
    <div class="card" style="margin-top:10px"><div class="chart-h"><b>Tonnage par semaine</b><span class="legend"><i style="opacity:1"></i>A <i style="opacity:.68"></i>B <i style="opacity:.42"></i>C</span></div>${stackedBars(stacked)}</div>
    <div class="card" style="margin-top:10px"><div class="chart-h"><b>Séries faites</b><span class="legend"><i class="outline"></i>prévues</span></div>${setsBars(rows)}</div>
    ${strength.some((x) => x.pts.length) ? `<div class="card" style="margin-top:10px"><div class="chart-h"><b>Force estimée (1RM, kg)</b><span class="legend"><i></i>Couché <i class="chalk"></i>Squat</span></div>${lineChart(strength.filter((x) => x.pts.length), { yFmt: (v) => fr(v, 0), xLabels: xl })}</div>` : ''}
    ${durs.length > 1 ? `<div class="card" style="margin-top:10px"><div class="chart-h"><b>Durée moyenne des séances (min)</b></div>${lineChart([{ pts: durs, color: 'var(--acc)', dots: true }], { h: 130, yFmt: (v) => fr(v, 0), xLabels: xl })}</div>` : ''}
    <div class="card" style="margin-top:10px;padding:8px 12px">
      <table class="table wk-table"><tr><th>Sem.</th><th class="r">Séances</th><th class="r">Séries</th><th class="r">Tonnes</th><th class="r">Min</th><th class="r">PR</th><th class="r">Poids</th></tr>
      ${rows.slice().reverse().map((r) => `<tr class="${P.isDeload(r.w) ? 'dl' : ''}"><td class="num">S${r.w}</td><td class="num">${r.n}/3</td><td class="num">${r.sets || '–'}</td><td class="num">${r.tonnage ? fr(r.tonnage / 1000, 1) : '–'}</td><td class="num">${r.dur ? fr(r.dur, 0) : '–'}</td><td class="num">${r.prs || '–'}</td><td class="num">${r.weight ? fr(r.weight, 1) : '–'}</td></tr>`).join('')}
      </table>
    </div>`;
}

function viewProgres() {
  const t = ui.progType;
  const cw = S.currentWeek();
  const done = S.doneSessions();
  // Régularité
  let grid = '';
  for (const ty of ['A', 'B', 'C']) {
    for (let w = 1; w <= 32; w++) {
      const id = S.sessionId(w, ty);
      grid += `<i class="${S.isDone(id) ? 'on' : S.isSkipped(id) ? 'sk' : ''}" style="--bc:${P.blockOf(w).color}" title="S${w} ${ty}"></i>`;
    }
  }
  let prCount = 0;
  done.forEach((l) => { prCount += S.records(l).length; });

  // Tonnage par semaine pour la séance choisie
  const bars = [];
  for (let w = 1; w <= 32; w++) {
    const log = S.getLog(S.sessionId(w, t));
    if (log && log.done) bars.push({ x: w, v: S.sessionTonnage(log), color: P.blockOf(w).color });
  }

  const names = exerciseNamesFor(t);
  const items = names.map((name) => {
    const hist = S.exerciseHistory(name);
    if (!hist.length) return { name, html: `<button class="ex-item" data-act="exdetail" data-name="${esc(name)}"><span><b>${esc(name)}</b><small>Pas encore fait</small></span><span></span></button>`, has: false };
    const last = hist[hist.length - 1];
    const m = hist.map((h) => metricOf(h, name));
    const top = last.sets.reduce((a, s) => ((s.kg || 0) * 100 + s.reps > (a.kg || 0) * 100 + a.reps ? s : a), last.sets[0]);
    const best = Math.max(...m.map((x) => x.v));
    return {
      name, has: true,
      html: `<button class="ex-item" data-act="exdetail" data-name="${esc(name)}"><span><b>${esc(name)}</b><small>${m[0].unit === 'reps' ? `Record <span class="num">${best}</span> reps` : `1RM est. <span class="num">${fr(best, 1)}</span> kg`}, dernière <span class="num">${kgStr(top.kg)}</span>×<span class="num">${top.reps}</span></small></span>${sparkline(m.map((x) => x.v), 'var(--acc)')}</button>`,
    };
  });
  items.sort((a, b) => Number(b.has) - Number(a.has));

  // Séries par muscle cette semaine
  const plan = {}; const doneM = {};
  ['A', 'B', 'C'].forEach((ty) => {
    S.template(cw, ty).exercises.forEach((e) => { plan[e.meta.m] = (plan[e.meta.m] || 0) + e.sets; });
    const log = S.getLog(S.sessionId(cw, ty));
    if (log) log.ex.forEach((x) => { const m = S.muscleOf(x.name); doneM[m] = (doneM[m] || 0) + x.sets.filter((s) => s.done).length; });
  });
  const muscles = Object.keys(plan).sort((a, b) => plan[b] - plan[a]);

  return `
    <div class="topbar"><h1>Progrès</h1></div>
    <div class="stats">
      <div class="stat"><div class="v num">${done.length}<span class="faint" style="font-size:18px">/96</span></div><div class="l">Séances faites</div></div>
      <div class="stat"><div class="v num">${S.streakWeeks()}</div><div class="l">Semaines 3/3 d'affilée</div></div>
      <div class="stat"><div class="v num">${prCount}</div><div class="l">Records battus</div></div>
    </div>
    <div class="section-title"><h2>Régularité</h2><span>A, B, C sur 32 semaines</span></div>
    <div class="card"><div class="consistency">${grid}</div><div class="consistency-legend"><span>S1</span><span>S9</span><span>S17</span><span>S25</span><span>S32</span></div></div>
    ${weeklySection()}
    <div class="section-title"><h2>Par séance</h2></div>
    <div class="seg" role="group">${['A', 'B', 'C'].map((x) => `<button data-act="ptype" data-t="${x}" aria-pressed="${x === t}">${x}, ${P.SESSION_META[x].name}</button>`).join('')}</div>
    <div class="card" style="margin-top:10px"><div class="muted" style="font-size:13px;margin-bottom:6px">Tonnage de la séance ${t}, en kg</div>${bars.length ? barChart(bars) : '<div class="empty">Fais ta première séance ' + t + ' pour voir la courbe.</div>'}</div>
    <div class="ex-list" style="margin-top:10px">${items.map((i) => i.html).join('')}</div>
    <div class="section-title"><h2>Séries cette semaine</h2><span>Semaine ${cw}</span></div>
    <div class="card bars">${muscles.map((m) => `<div class="bar-row"><span>${esc(m)}</span><span class="track"><span class="fill" style="width:${Math.min(100, ((doneM[m] || 0) / plan[m]) * 100)}%"></span></span><span class="num">${doneM[m] || 0}/${plan[m]}</span></div>`).join('')}</div>`;
}

// ---------- Corps ----------
function viewCorps() {
  const st = S.state;
  const today = S.todayISO();
  const lw = S.lastWeight();
  if (ui.wDraft == null) ui.wDraft = st.weights[today] ?? (lw ? lw.kg : st.settings.weight0);
  const entries = S.weightEntries();
  const wa = S.weeklyAverages();
  const adv = S.weightAdvice();
  const last7 = entries.filter((e) => e.date > S.addDays(today, -7));
  const avg7 = last7.length ? last7.reduce((a, e) => a + e.kg, 0) / last7.length : null;
  const gain = avg7 != null ? avg7 - st.settings.weight0 : null;

  // Courbe : points quotidiens + moyenne hebdo + trajectoire visée (+0,3 kg/sem)
  const startD = S.parseISO(st.settings.start);
  const dx = (iso) => (S.parseISO(iso) - startD) / 86400000 / 7 + 1;
  const daily = entries.map((e) => ({ x: dx(e.date), y: e.kg }));
  const weekly = wa.map((a) => ({ x: a.week + 0.5, y: a.avg }));
  const xmax = Math.max(4, ...daily.map((p) => p.x)) + 1;
  const guide = { pts: [{ x: 1, y: st.settings.weight0 }, { x: xmax, y: st.settings.weight0 + 0.3 * (xmax - 1) }], color: 'rgba(238,237,232,.28)' };
  const chart = entries.length
    ? lineChart([{ pts: daily, color: 'rgba(238,237,232,.35)', dots: true, line: false, r: 2.4 }, { pts: weekly, color: 'var(--acc)', dots: true, width: 2.6 }],
      { guide, yFmt: (v) => fr(v, 1), xLabels: [1, 8, 16, 24, 32].filter((x) => x <= xmax).map((x) => ({ x, label: `S${x}` })) })
    : '<div class="empty">Ta courbe apparaîtra après ta première pesée.</div>';

  const habitsDef = [['meals', '4 repas'], ['protein', `${st.settings.protein} g de protéines`], ['creatine', 'Créatine']];
  const hToday = st.habits[today] || {};
  const habits = habitsDef.map(([k, label]) => {
    let dots = '';
    for (let i = 6; i >= 0; i--) { const d = S.addDays(today, -i); dots += `<i class="${(st.habits[d] || {})[k] ? 'on' : ''}"></i>`; }
    return `<button class="habit" data-act="habit" data-k="${k}" aria-pressed="${!!hToday[k]}"><b>${esc(label)}</b><span class="wk">${dots}</span></button>`;
  }).join('');

  const ms = st.measures.slice().sort((a, b) => b.date.localeCompare(a.date));
  const first = st.measures.slice().sort((a, b) => a.date.localeCompare(b.date))[0];
  const delta = (k, m) => (first && m !== first && m[k] != null && first[k] != null ? ` <small class="${m[k] - first[k] >= 0 ? '' : 'muted'}" style="font-family:var(--ui);font-size:11px;color:var(--acc)">${m[k] - first[k] >= 0 ? '+' : ''}${fr(m[k] - first[k], 1)}</small>` : '');

  let advTxt;
  if (adv) {
    advTxt = adv.verdict === 'up' ? `Tu prends ${fr(adv.delta, 2)} kg par semaine. C'est sous la cible : passe à ${st.settings.kcal + 200} kcal par jour.`
      : adv.verdict === 'down' ? `Tu prends ${fr(adv.delta, 2)} kg par semaine. C'est rapide : redescends à ${st.settings.kcal - 150} kcal par jour.`
        : `Tu prends ${fr(adv.delta, 2)} kg par semaine, dans la cible de ${fr(st.settings.gainMin, 1)} à ${fr(st.settings.gainMax, 1)} kg. Garde ${st.settings.kcal} kcal.`;
  } else {
    advTxt = `Cible : environ ${st.settings.kcal} kcal et ${st.settings.protein} g de protéines par jour, sur 4 repas. Je règle le tir dès que j'ai 2 semaines de pesées.`;
  }

  return `
    <div class="topbar"><h1>Corps</h1><button class="icon-btn" data-act="settings" aria-label="Réglages">${I.gear}</button></div>
    <div class="card weigh">
      <div class="label">Poids du matin, ${esc(DFULL.format(new Date()))}</div>
      <div class="stepper">
        <button class="round" data-act="wstep" data-d="-0.1" aria-label="Moins 100 g">−</button>
        <div class="val num" id="wval">${fr(ui.wDraft, 1)}<small>kg</small></div>
        <button class="round" data-act="wstep" data-d="0.1" aria-label="Plus 100 g">+</button>
      </div>
      <div class="muted" style="font-size:13.5px;margin-bottom:12px">${avg7 != null ? `Moyenne 7 jours <b class="num" style="font-size:17px;color:var(--chalk)">${fr(avg7, 1)}</b> kg, ${gain >= 0 ? '+' : ''}${fr(gain, 1)} kg depuis le départ` : 'Pas encore de pesée'}</div>
      <button class="btn primary block" data-act="wsave">${st.weights[today] != null ? 'Mettre à jour' : 'Enregistrer'}</button>
    </div>
    <div class="card advice" style="margin-top:10px"><span class="ico">${I.fork}</span><p>${advTxt}</p></div>
    <div class="section-title"><h2>Courbe de poids</h2><span>Pointillés : +0,3 kg/sem</span></div>
    <div class="card">${chart}</div>
    <div class="section-title"><h2>Habitudes</h2><span>7 derniers jours</span></div>
    <div class="habits">${habits}</div>
    <div class="section-title"><h2>Mensurations</h2><span>Toutes les 4 semaines</span></div>
    <div class="card">
      ${ms.length ? `<table class="table"><tr><th>Date</th><th class="r">Bras</th><th class="r">Taille</th><th class="r">Épaules</th><th class="r">Cuisse</th></tr>
      ${ms.map((m) => `<tr><td>${dshort(m.date)}</td>${['arm', 'waist', 'shoulders', 'thigh'].map((k) => `<td class="num">${m[k] != null ? fr(m[k], 1) : '–'}${delta(k, m)}</td>`).join('')}</tr>`).join('')}</table>` : '<p class="muted" style="margin:0 0 12px;font-size:14.5px">Bras contracté, tour de taille au nombril, épaules, cuisse. Toujours dans les mêmes conditions, avec 3 photos : face, profil, dos.</p>'}
      <button class="btn block" style="margin-top:10px" data-act="measure">Ajouter des mensurations</button>
    </div>`;
}

// ---------- Feuilles ----------
let sheetEl = null; let scrimEl = null; let sheetClose = null;
function openSheet(html, onClose) {
  closeSheet(true);
  scrimEl = document.createElement('div'); scrimEl.className = 'scrim';
  sheetEl = document.createElement('div'); sheetEl.className = 'sheet'; sheetEl.setAttribute('role', 'dialog');
  sheetEl.innerHTML = `<div class="grab"></div><button class="sheet-x" data-act="closesheet" aria-label="Fermer">${I.close}</button>${html}`;
  document.body.append(scrimEl, sheetEl);
  sheetClose = onClose || null;
  scrimEl.addEventListener('click', () => closeSheet());
  requestAnimationFrame(() => { scrimEl.classList.add('on'); sheetEl.classList.add('on'); });
  // Glisser vers le bas pour fermer
  let y0 = null;
  sheetEl.addEventListener('touchstart', (e) => { if (sheetEl.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
  sheetEl.addEventListener('touchmove', (e) => { if (y0 == null) return; const dy = e.touches[0].clientY - y0; if (dy > 0) sheetEl.style.transform = `translateY(${dy}px)`; }, { passive: true });
  sheetEl.addEventListener('touchend', (e) => { if (y0 == null) return; const dy = e.changedTouches[0].clientY - y0; sheetEl.style.transform = ''; y0 = null; if (dy > 110) closeSheet(); });
  return sheetEl;
}
function setSheet(html) { if (sheetEl) sheetEl.innerHTML = `<div class="grab"></div><button class="sheet-x" data-act="closesheet" aria-label="Fermer">${I.close}</button>${html}`; }
function closeSheet(instant) {
  if (!sheetEl) return;
  const s = sheetEl; const sc = scrimEl; const cb = sheetClose;
  sheetEl = null; scrimEl = null; sheetClose = null;
  if (instant) { s.remove(); sc.remove(); } else {
    s.classList.remove('on'); sc.classList.remove('on');
    setTimeout(() => { s.remove(); sc.remove(); }, 380);
  }
  if (cb) cb();
}

let toastT = null;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200);
}

function previewSheet(week, type) {
  const tpl = S.template(week, type);
  const id = S.sessionId(week, type);
  const log = S.getLog(id);
  const status = S.isDone(id) ? 'done' : S.isSkipped(id) ? 'skip' : log ? 'live' : 'todo';
  const rows = tpl.exercises.map((e) => {
    const x = log && log.ex.find((l) => l.slot === e.slot);
    let right;
    if (x && x.sets.some((s) => s.done)) right = x.sets.filter((s) => s.done).map((s) => `${kgStr(s.kg)}×${s.reps}`).join('  ');
    else { const sg = S.suggestion(e, id); right = sg.kg != null ? `${kgStr(sg.kg)} kg` : ''; }
    return `<div class="list-btn" style="align-items:flex-start"><span><b style="font-weight:600">${esc(e.slot)}. ${esc(e.name)}</b><br><small>${e.sets} × ${repsLabel(e)}${e.plus ? ' (+1 série)' : ''}, ${e.ssPos === 'a' ? 'superset' : `repos ${restLabel(e.rest)}`}</small></span><small class="num" style="font-size:16px;color:var(--chalk);text-align:right">${right}</small></div>`;
  }).join('');
  const btns = status === 'done'
    ? `<button class="btn primary grow" data-act="open" data-id="${id}">Voir et modifier</button>`
    : status === 'skip'
      ? `<button class="btn grow" data-act="unskip" data-id="${id}">Rétablir la séance</button>`
      : `<button class="btn primary grow" data-act="start" data-w="${week}" data-t="${type}">${status === 'live' ? 'Reprendre' : 'Démarrer'}</button><button class="btn" data-act="skip" data-id="${id}">Passer</button>`;
  openSheet(`
    <h2>Séance ${type}, ${esc(tpl.meta.name)}</h2>
    <p class="lead">Semaine ${week}, ${esc(tpl.info.block.name)}. ${esc(tpl.info.consigne)}${status === 'done' && log.date ? ` Faite le ${dshort(log.date)}.` : ''}</p>
    ${rows}
    <div class="btn-row" style="margin-top:16px">${btns}</div>`);
}

function weekSheet(w) {
  const info = P.weekInfo(w); const d = S.weekDates(w);
  const rows = ['A', 'B', 'C'].map((t) => {
    const id = S.sessionId(w, t); const log = S.getLog(id);
    const st = S.isDone(id) ? `Faite le ${dshort(log.date)}, ${fr(S.sessionTonnage(log) / 1000, 1)} t` : S.isSkipped(id) ? 'Passée' : log ? 'En cours' : 'À faire';
    return `<button class="list-btn" data-act="preview" data-w="${w}" data-t="${t}"><span><b style="font-weight:600">${t}, ${P.SESSION_META[t].name}</b><br><small>${esc(P.SESSION_META[t].muscles)}</small></span><small>${st}</small></button>`;
  }).join('');
  openSheet(`<h2>Semaine ${w}</h2><p class="lead">Du ${dshort(d.from)} au ${dshort(d.to)}. Bloc ${esc(info.block.name)}, RIR ${esc(info.rir)}. ${esc(info.consigne)}</p>${rows}`);
}

function exDetailSheet(name) {
  const hist = S.exerciseHistory(name);
  const meta = P.EX[name] || {};
  if (!hist.length) { openSheet(`<h2>${esc(name)}</h2><p class="lead">${esc(meta.m || '')}. Pas encore d'historique : il se remplit à chaque séance.</p>`); return; }
  const m = hist.map((h) => metricOf(h, name));
  const unit = m[0].unit;
  const chart = lineChart([{ pts: hist.map((h, i) => ({ x: h.week, y: m[i].v })), color: 'var(--acc)', dots: true }],
    { yFmt: (v) => fr(v, 0), xLabels: [...new Set(hist.map((h) => h.week))].filter((_, i, a) => a.length < 7 || i % Math.ceil(a.length / 6) === 0).map((x) => ({ x, label: `S${x}` })) });
  openSheet(`<h2>${esc(name)}</h2><p class="lead">${unit === 'reps' ? 'Meilleure série en reps' : '1RM estimé (charge × (1 + reps / 30)), en kg'}.</p>
    <div class="card" style="padding:12px 10px">${chart}</div>
    <table class="table" style="margin-top:12px"><tr><th>Sem.</th><th>Séries</th><th class="r">${unit === 'reps' ? 'Max' : '1RM'}</th></tr>
    ${hist.slice().reverse().map((h, i) => `<tr><td class="num">S${h.week}</td><td>${h.sets.map((s) => `${kgStr(s.kg)}×${s.reps}`).join(', ')}</td><td class="num">${fr(m[m.length - 1 - i].v, unit === 'reps' ? 0 : 1)}</td></tr>`).join('')}</table>`);
}

function weighSheet() {
  ui.tab = 'corps'; render(); window.scrollTo({ top: 0, behavior: 'smooth' });
}

function measureSheet() {
  const lw = S.lastWeight();
  openSheet(`<h2>Mensurations</h2><p class="lead">Mêmes conditions à chaque fois : le matin, avant de manger. Bras contracté, tour de taille au nombril.</p>
    <div class="field"><label for="m-date">Date</label><input id="m-date" type="date" value="${S.todayISO()}"></div>
    <div class="grid2">
      <div class="field"><label for="m-arm">Bras contracté (cm)</label><input id="m-arm" inputmode="decimal"></div>
      <div class="field"><label for="m-waist">Taille au nombril (cm)</label><input id="m-waist" inputmode="decimal"></div>
      <div class="field"><label for="m-shoulders">Épaules (cm)</label><input id="m-shoulders" inputmode="decimal"></div>
      <div class="field"><label for="m-thigh">Cuisse (cm)</label><input id="m-thigh" inputmode="decimal"></div>
    </div>
    <div class="field"><label for="m-weight">Poids (kg)</label><input id="m-weight" inputmode="decimal" value="${lw ? fr(lw.kg, 1) : ''}"></div>
    <button class="btn primary block" data-act="msave">Enregistrer</button>`);
}

function settingsSheet() {
  const s = S.state.settings;
  openSheet(`<h2>Réglages</h2><p class="lead">Tout est enregistré sur ce téléphone, rien n'est envoyé ailleurs.</p>
    <div class="grid2">
      <div class="field"><label for="s-name">Prénom</label><input id="s-name" value="${esc(s.name)}"></div>
      <div class="field"><label for="s-start">Début (lundi S1)</label><input id="s-start" type="date" value="${s.start}"></div>
      <div class="field"><label for="s-w0">Poids de départ (kg)</label><input id="s-w0" inputmode="decimal" value="${fr(s.weight0, 1)}"></div>
      <div class="field"><label for="s-kcal">Calories (kcal/j)</label><input id="s-kcal" inputmode="numeric" value="${s.kcal}"></div>
      <div class="field"><label for="s-prot">Protéines (g/j)</label><input id="s-prot" inputmode="numeric" value="${s.protein}"></div>
      <div class="field"><label>Son en fin de repos</label><button class="switch" data-act="sound" role="switch" aria-checked="${s.sound}" aria-label="Son en fin de repos"></button></div>
    </div>
    <button class="btn primary block" data-act="ssave">Enregistrer les réglages</button>
    <div class="section-title"><h2>Données</h2>${S.state.lastBackup ? `<span>Sauvegardé le ${dshort(S.state.lastBackup.slice(0, 10))}</span>` : ''}</div>
    <button class="list-btn" data-act="export"><span>Sauvegarder mes données<br><small>Un fichier .json à garder dans Fichiers ou iCloud Drive</small></span></button>
    <label class="list-btn" style="cursor:pointer"><span>Restaurer une sauvegarde<br><small>Remplace les données actuelles</small></span><input type="file" accept="application/json,.json" data-input="import" hidden></label>
    <button class="list-btn" data-act="csv"><span>Exporter en tableau (CSV)<br><small>Toutes les séries, pour un tableur</small></span></button>
    <a class="list-btn" href="../" style="color:inherit;text-decoration:none"><span>Ancienne version (2.1)<br><small>Ton ancien programme et son historique</small></span></a>
    <button class="list-btn" data-act="reset" style="color:var(--bad)"><span>Tout effacer</span></button>`);
}

// ---------- Séance en direct ----------
function curLog() { return ui.sid ? S.state.sessions[ui.sid] : null; }

function pairs(log) {
  const tpl = S.template(log.week, log.type);
  return tpl.exercises.map((e) => ({ e, x: log.ex.find((l) => l.slot === e.slot) || log.ex.find((l) => l.name === e.name) })).filter((p) => p.x);
}

function isComplete(x) { return x.sets.length > 0 && x.sets.every((s) => s.done); }

function firstOpen(log) {
  const ps = pairs(log);
  const p = ps.find(({ x }) => !isComplete(x));
  return p ? p.e.slot : (ps[0] && ps[0].e.slot);
}

function openSession(id) {
  ui.sid = id;
  const log = curLog();
  ui.openEx = firstOpen(log); ui.selI = null; ui.askRir = null; ui.lastRendered = null;
  closeSheet(true);
  document.body.classList.add('in-session');
  renderSession();
  requestAnimationFrame(() => sessionEl.classList.add('on'));
  keepAwake(true);
  clearInterval(ui.clock);
  ui.clock = setInterval(tickClock, 1000);
}

function closeSession() {
  sessionEl.classList.remove('on'); ui.selI = null; ui.askRir = null;
  document.body.classList.remove('in-session');
  clearInterval(ui.clock);
  keepAwake(false);
  ui.sid = null;
  render();
}

function tickClock() {
  const log = curLog(); const el = $('#s-clock');
  if (!log || !el) return;
  if (!log.done) el.textContent = mmss((Date.now() - log.startedAt) / 1000);
}

async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && !ui.wake) {
      ui.wake = await navigator.wakeLock.request('screen');
      ui.wake.addEventListener('release', () => { ui.wake = null; });
    } else if (!on && ui.wake) { await ui.wake.release(); ui.wake = null; }
  } catch (e) { ui.wake = null; }
}

const PLATES = [[25, '#e5483f', 72, 15], [20, '#3a78e6', 72, 13], [15, '#f0be2c', 72, 11], [10, '#2fa55c', 72, 9], [5, '#e9e7e1', 50, 7], [2.5, '#3a4048', 40, 5.5], [1.25, '#b8bec6', 32, 4.5]];
function platesFor(total, bar) {
  let per = (total - bar) / 2; const out = [];
  if (per < 0) return null;
  for (const [kg] of PLATES) { while (per >= kg - 1e-9) { out.push(kg); per -= kg; } }
  return { plates: out, rest: per };
}
function plateLoader(total, bar, animate) {
  const pf = platesFor(total, bar);
  if (!pf) return `<div class="loader"><div class="cap"><span>Charge plus légère que la barre (${bar} kg)</span></div></div>`;
  let x = 40; let g = '';
  g += `<rect x="0" y="35" width="28" height="6" rx="2" fill="#7b828a"/>`;
  g += `<rect x="26" y="27" width="10" height="22" rx="2.5" fill="#9aa1a9"/>`;
  g += `<rect x="34" y="33.5" width="150" height="9" rx="3" fill="#8a9098"/>`;
  pf.plates.forEach((kg, i) => {
    const [, color, h, w] = PLATES.find((p) => p[0] === kg);
    g += `<rect class="${animate ? 'pl' : ''}" style="animation-delay:${i * 45}ms" x="${x}" y="${38 - h / 2}" width="${w}" height="${h}" rx="3" fill="${color}" stroke="rgba(0,0,0,.35)"/>`;
    x += w + 1.5;
  });
  if (pf.plates.length) g += `<rect x="${x + 2}" y="29" width="7" height="18" rx="2" fill="#c3c8ce"/>`;
  const label = pf.plates.length ? pf.plates.map((p) => kgStr(p)).join(' + ') : 'rien, barre seule';
  return `<div class="loader"><svg viewBox="0 0 190 76" preserveAspectRatio="xMinYMid meet" aria-hidden="true">${g}</svg><div class="cap"><span>Par côté : ${label}${pf.rest > 0.01 ? `, il manque ${kgStr(pf.rest * 2)} kg` : ''}</span><span>Barre ${bar} kg</span></div></div>`;
}

function warmupSets(kg, bar) {
  const pts = [[0, 10], [0.5, 6], [0.7, 4], [0.85, 2]];
  const out = [];
  pts.forEach(([p, r]) => {
    const w = p === 0 ? bar : Math.max(bar, S.roundTo(kg * p, 2.5));
    if (!out.some((o) => o.kg === w) && w < kg) out.push({ kg: w, reps: r });
  });
  return out;
}

const last0 = (sug) => !!sug.last;
function groupSets(sets) {
  const g = [];
  sets.forEach((s) => { const k = `${kgStr(s.kg)}×${s.reps}`; if (g.length && g[g.length - 1].k === k) g[g.length - 1].n++; else g.push({ k, n: 1 }); });
  return g.map((x) => (x.n > 1 ? `${x.n} × ${x.k}` : x.k)).join(', ');
}

// ---------- Mode focus : un exercice à la fois ----------
function shortName(n) {
  return n.replace(/^Développé /, '').replace(/^Extension triceps /, 'Triceps ').replace(/^Élévations latérales/, 'Latérales')
    .replace(/^Soulevé de terre roumain/, 'SDT roumain').replace(/^Tirage vertical /, 'Tirage ').replace(/^Mollets /, 'Mollets ')
    .replace(/ haltères| barre| machine| poulie/g, '').replace(/^Relevés de jambes suspendu/, 'Relevés jambes')
    .replace(/^Crunch poulie haute à genoux/, 'Crunch poulie').replace(/^(\S+ \S+).*$/, '$1');
}

function selSet(x) {
  if (ui.selI != null && x.sets[ui.selI]) return ui.selI;
  const i = x.sets.findIndex((s) => !s.done);
  return i;
}

function nextTargetLabel(log) {
  const p = findPair(log, ui.openEx); if (!p) return '';
  const i = p.x.sets.findIndex((s) => !s.done); if (i < 0) return '';
  const s = p.x.sets[i];
  return `${p.x.name}, série ${i + 1}${s.kg != null ? ` : ${kgStr(s.kg)} × ${s.reps ?? '?'}` : ''}`;
}

function restRing(r, size = 210) {
  const left = (r.endAt - Date.now()) / 1000;
  const pct = Math.max(0, Math.min(1, left / r.total));
  const R = size / 2 - 10; const C = 2 * Math.PI * R;
  return `<svg class="big-ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
    <circle cx="${size / 2}" cy="${size / 2}" r="${R}" fill="none" stroke="rgba(238,237,232,.08)" stroke-width="12"/>
    <circle id="rr-arc" cx="${size / 2}" cy="${size / 2}" r="${R}" fill="none" stroke="var(--acc)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
}

function rirAsk(log) {
  if (!ui.askRir) return '';
  const p = findPair(log, ui.askRir); if (!p) return '';
  return `<div class="rir-ask"><p>${esc(p.x.name)} terminé. Il te restait combien de reps sur la dernière série ?</p>
    <div class="rir">${[0, 1, 2, 3, 4].map((r) => `<button data-act="rir" data-slot="${p.e.slot}" data-r="${r}" aria-pressed="${p.x.rir === r}">${r === 4 ? '4+' : r}</button>`).join('')}</div></div>`;
}

function panelMode(log, x) {
  const r = S.state.rest;
  if (ui.selI != null && x.sets[ui.selI]) return 'entry';
  if (!log.done && r && r.endAt > Date.now()) return 'rest';
  if (pairs(log).every((p) => isComplete(p.x))) return 'alldone';
  if (isComplete(x)) return 'complete';
  return 'entry';
}

function dial(field, value, label, step, unit) {
  return `<div class="dial">
    <span class="dial-l">${label}<small>${unit}</small></span>
    <button class="dial-b" data-act="dstep" data-f="${field}" data-d="${-step}" aria-label="Moins">−</button>
    <input class="dial-in num" id="d-${field}" value="${value}" placeholder="–" inputmode="${field === 'kg' ? 'decimal' : 'numeric'}" data-input="d${field}" aria-label="${label}">
    <button class="dial-b" data-act="dstep" data-f="${field}" data-d="${step}" aria-label="Plus">+</button>
  </div>`;
}
function plateChips(total, bar) {
  const pf = platesFor(total, bar);
  if (!pf) return `<div class="plates"><span>Moins lourd que la barre (${bar} kg)</span></div>`;
  const ch = pf.plates.map((kg) => { const [, c, h] = PLATES.find((q) => q[0] === kg); return `<i style="background:${c};height:${Math.round(h / 3.2)}px"></i>`; }).join('');
  return `<div class="plates"><span class="pl-bar"></span>${ch}<span>${pf.plates.length ? `Par côté : ${pf.plates.map((q) => kgStr(q)).join(' + ')}` : 'Barre seule'}${pf.rest > 0.01 ? `, il manque ${kgStr(pf.rest * 2)} kg` : ''}</span><span class="faint">barre ${bar}</span></div>`;
}

function renderSession() {
  const log = curLog(); if (!log) return;
  const tpl = S.template(log.week, log.type);
  const info = tpl.info;
  theme(log.week);
  const ps = pairs(log);
  if (!ps.some((p) => p.e.slot === ui.openEx)) ui.openEx = firstOpen(log);
  const cur = findPair(log, ui.openEx);
  const { e, x } = cur;
  const total = ps.reduce((a, p) => a + p.x.sets.length, 0);
  const doneN = ps.reduce((a, p) => a + p.x.sets.filter((s) => s.done).length, 0);

  // Barre d'exercices
  let pager = ''; let i = 0;
  const chip = (q) => {
    const n = q.x.sets.filter((s) => s.done).length;
    const cls = [q.e.slot === ui.openEx ? 'cur' : '', isComplete(q.x) ? 'done' : ''].join(' ');
    return `<button class="pg ${cls}" data-act="jump" data-slot="${q.e.slot}"><span class="pg-n num">${isComplete(q.x) ? I.check : esc(q.e.slot)}</span><span class="pg-t">${esc(shortName(q.x.name))}</span><span class="pg-p num">${n}/${q.x.sets.length}</span></button>`;
  };
  while (i < ps.length) {
    const p = ps[i];
    if (p.e.ssPos === 'a' && ps[i + 1] && ps[i + 1].e.ssPos === 'b') { pager += `<span class="pg-ss">${chip(p)}${chip(ps[i + 1])}</span>`; i += 2; } else { pager += chip(p); i++; }
  }

  const mode = panelMode(log, x);
  ui.restMode = mode === 'rest';
  const sug = S.suggestion(e, log.id);
  const last = sug.last;
  const idx = selSet(x);
  const s = idx >= 0 ? x.sets[idx] : null;

  // Objectif et dernière fois
  const goal = sug.kg != null ? `${kgStr(sug.kg)} × ${sug.reps}` : `${repsLabel(e)} reps`;
  const lastTxt = last ? `S${last.week} : ${groupSets(last.sets)}` : (sug.kg != null ? 'Charge prévue par le programme' : 'Commence léger, ajuste ensuite');
  const noteTxt = (e.note || '').replace(/^Départ [^.]+(\.\s*|$)/, '');

  // Pastilles de séries
  const setChips = x.sets.map((q, j) => `<button class="sc ${q.done ? 'done' : ''} ${j === idx && mode === 'entry' ? 'sel' : ''}" data-act="pickset" data-i="${j}" aria-label="Série ${j + 1}">
      <span class="sc-i">${j + 1}</span>${q.done ? `<span class="sc-v num">${kgStr(q.kg)}<small>×</small>${q.reps}</span>` : `<span class="sc-v num faint">${q.kg != null ? kgStr(q.kg) : '–'}<small>×</small>${q.reps ?? '–'}</span>`}
    </button>`).join('') + '<button class="sc add" data-act="addset" aria-label="Ajouter une série">+</button>';

  // Panneau principal
  let panel = ''; let foot = '';
  if (mode === 'rest') {
    const r = S.state.rest;
    panel = `<div class="panel rest-panel">
      <div class="ring-wrap">${restRing(r)}<div class="ring-txt"><span class="num" id="rr-time">${mmss((r.endAt - Date.now()) / 1000)}</span><small>Repos</small></div></div>
      <div class="rest-acts"><button class="btn small" data-act="rest" data-d="-15">−15 s</button><button class="btn small" data-act="rest" data-d="15">+15 s</button></div>
      <p class="rest-next">Ensuite : ${esc(nextTargetLabel(log))}</p>
      ${rirAsk(log)}
    </div>`;
    foot = '<button class="btn block big" data-act="rest" data-d="0">Passer le repos</button>';
  } else if (mode === 'alldone') {
    panel = `<div class="panel done-panel"><div class="done-big num">${doneN}<small>/${total}</small></div><p>Toutes les séries sont faites. ${fr(S.sessionTonnage(log) / 1000, 2)} tonnes soulevées.</p>${rirAsk(log)}</div>`;
    foot = log.done ? '<button class="btn primary block big" data-act="sclose">Enregistrer et fermer</button>' : '<button class="btn primary block big" data-act="finish">Terminer la séance</button>';
  } else if (mode === 'complete') {
    const nxt = ps.find((p) => !isComplete(p.x));
    panel = `<div class="panel done-panel"><p class="ok-line">${I.check} Exercice terminé : ${groupSets(x.sets)}</p>${rirAsk(log) || `<div class="rir-ask"><p>Reps en réserve sur la dernière série</p><div class="rir">${[0, 1, 2, 3, 4].map((r) => `<button data-act="rir" data-slot="${e.slot}" data-r="${r}" aria-pressed="${x.rir === r}">${r === 4 ? '4+' : r}</button>`).join('')}</div></div>`}</div>`;
    foot = nxt ? `<button class="btn primary block big" data-act="jump" data-slot="${nxt.e.slot}">Exercice suivant : ${esc(shortName(nxt.x.name))}</button>` : '<button class="btn primary block big" data-act="finish">Terminer la séance</button>';
  } else if (s) {
    const step = e.meta.inc || 1;
    const r = S.state.rest;
    const over = !log.done && r && r.endAt <= Date.now() ? `<span class="over-chip num" id="rr-over">+${mmss((Date.now() - r.endAt) / 1000)}</span>` : '';
    const prev = idx > 0 ? x.sets[idx - 1] : null;
    const lastSet = last && (last.sets[idx] || last.sets[last.sets.length - 1]);
    const showLoader = e.meta.eq === 'barre' && s.kg > 0;
    panel = `<div class="panel entry-panel">
      <div class="ep-head"><b>Série ${idx + 1} <span>sur ${x.sets.length}</span></b>${s.done ? '<span class="tag acc">Faite</span>' : over}</div>
      ${dial('kg', s.kg != null ? kgStr(s.kg) : '', e.meta.eq === 'pdc' ? 'Lest' : e.meta.eq === 'halteres' ? 'Charge par haltère' : 'Charge', step, 'kg')}
      <div id="d-loader">${showLoader ? plateChips(s.kg, e.meta.bar || 20) : ''}</div>
      ${dial('reps', s.reps ?? '', 'Répétitions', 1, `objectif ${repsLabel(e)}`)}
      <div class="quick">
        ${prev && prev.kg != null && !s.done ? `<button data-act="dset" data-kg="${prev.kg}" data-reps="${prev.reps}">Comme la série ${idx} : ${kgStr(prev.kg)} × ${prev.reps}</button>` : ''}
        ${lastSet && !s.done ? `<button data-act="dset" data-kg="${lastSet.kg}" data-reps="${lastSet.reps}">S${last.week} : ${kgStr(lastSet.kg)} × ${lastSet.reps}</button>` : ''}
        ${s.done ? '<button data-act="undoset">Remettre à faire</button>' : ''}
        ${!s.done && x.sets.length > 1 && idx === x.sets.length - 1 ? '<button data-act="delset">Retirer cette série</button>' : ''}
      </div>
    </div>`;
    foot = s.done
      ? '<button class="btn block big" data-act="pickset" data-i="-1">OK</button>'
      : `<button class="btn primary block big" data-act="validate">${I.check}Valider la série ${idx + 1}</button>`;
  }

  // Échauffement (1er exercice, barre)
  let warm = '';
  if (!log.done && e.slot === '1' && ['barre', 'smith'].includes(e.meta.eq) && sug.kg >= 35 && !x.sets.some((q) => q.done)) {
    warm = `<div class="warm"><em>Échauffement</em>${warmupSets(sug.kg, e.meta.bar || 20).map((w) => `<span><b>${kgStr(w.kg)}</b>×${w.reps}</span>`).join('')}</div>`;
  }

  const sc = $('.s-body', sessionEl); const keep = sc ? sc.scrollTop : 0; const sameEx = ui.lastRendered === ui.openEx;
  sessionEl.innerHTML = `
    <header class="s-top">
      <div class="bar">
        <button class="icon-btn" data-act="sclose" aria-label="Réduire la séance">${I.down}</button>
        <div class="title"><b>${log.type}, ${esc(tpl.meta.name)}</b><span>${log.done ? `Semaine ${log.week}, modification` : `Semaine ${log.week}, ${doneN} séries sur ${total}`}</span></div>
        <span class="clock num" id="s-clock">${log.done ? hm(log.endedAt - log.startedAt) : mmss((Date.now() - log.startedAt) / 1000)}</span>
        <button class="icon-btn" data-act="smenu" aria-label="Options de la séance">${I.more}</button>
      </div>
      <nav class="pager" id="pager">${pager}</nav>
      <div class="s-progress"><i style="width:${total ? (doneN / total) * 100 : 0}%"></i></div>
    </header>
    <div class="s-body">
      <section class="focus">
        <div class="f-head">
          <div class="f-name"><h2>${esc(x.name)}</h2>
            <p>${esc(e.meta.m)}. ${x.sets.length} × ${repsLabel(e)} reps, RIR ${esc(info.rir)}, ${e.ssPos === 'a' ? `enchaîne avec ${e.superset}b` : `repos ${restLabel(e.rest)}`}</p></div>
          <button class="mini-btn" data-act="swap" data-slot="${e.slot}" aria-label="Remplacer l'exercice">${I.swap}</button>
        </div>
        ${mode === 'rest' ? '' : `${e.ssPos || e.plus ? `<div class="ex-tools">${e.ssPos ? `<span class="tag acc">${I.bolt}Superset ${e.superset}a + ${e.superset}b, sans repos entre les deux</span>` : ''}${e.plus ? '<span class="tag acc">+1 série cette semaine</span>' : ''}</div>` : ''}
        ${log.done ? '' : `<div class="goal-row"><div><small>Objectif</small><span class="num">${goal}</span></div><p><b>${esc(last ? sug.why : 'Première séance')}</b>${esc(lastTxt)}</p></div>`}
        ${noteTxt ? `<p class="ex-note">${esc(noteTxt)}</p>` : ''}
        ${warm}`}
        <div class="sets-row">${setChips}</div>
      </section>
      ${panel}
      <input class="note-input" placeholder="Note sur l'exercice : réglage, sensations…" value="${esc(x.note)}" data-input="note" data-slot="${e.slot}">
    </div>
    <footer class="s-foot">${foot}</footer>`;
  const nsc = $('.s-body', sessionEl); if (nsc && sameEx) nsc.scrollTop = keep;
  ui.lastRendered = ui.openEx;
  const pc = $('.pg.cur', sessionEl); if (pc) pc.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function scrollToOpen() { const sc = $('.s-body', sessionEl); if (sc) sc.scrollTop = 0; }

function findPair(log, slot) { return pairs(log).find((p) => p.e.slot === slot); }

// Après une série validée : repos et exercice suivant (en tenant compte des supersets)
function afterSet(log, slot) {
  const ps = pairs(log);
  const idx = ps.findIndex((p) => p.e.slot === slot);
  const { e, x } = ps[idx];
  let nextSlot = slot; let restSec = e.rest;
  if (e.ssPos === 'a') {
    const b = ps.find((p) => p.e.superset === e.superset && p.e.ssPos === 'b');
    if (b && !isComplete(b.x)) { nextSlot = b.e.slot; restSec = 0; } else { restSec = e.pairRest || 75; }
  } else if (e.ssPos === 'b') {
    const a = ps.find((p) => p.e.superset === e.superset && p.e.ssPos === 'a');
    if (a && !isComplete(a.x)) nextSlot = a.e.slot;
  }
  const target = ps.find((p) => p.e.slot === nextSlot);
  if (isComplete(target.x)) {
    const nxt = ps.slice(idx + 1).concat(ps.slice(0, idx)).find((p) => !isComplete(p.x));
    nextSlot = nxt ? nxt.e.slot : null;
  }
  if (isComplete(x)) ui.askRir = slot;
  if (nextSlot) ui.openEx = nextSlot;
  ui.selI = null;
  if (restSec > 0 && nextSlot) startRest(restSec, `Ensuite : ${nextTargetLabel(log)}`);
  else if (!nextSlot) stopRest(true);
}

function curSet() {
  const log = curLog(); if (!log) return {};
  const p = findPair(log, ui.openEx); if (!p) return {};
  const i = selSet(p.x);
  return { log, p, i, s: p.x.sets[i] };
}

function setValue(field, v) {
  const { p, i, s } = curSet(); if (!s) return;
  if (field === 'kg') {
    s.kg = v == null || isNaN(v) ? null : Math.max(0, Math.round(v * 100) / 100);
    // Même charge pour les séries suivantes pas encore faites
    if (!s.done) p.x.sets.forEach((o, j) => { if (j > i && !o.done) o.kg = s.kg; });
  } else s.reps = v == null || isNaN(v) ? null : Math.max(0, Math.round(v));
  S.save();
}

function refreshDial(field) {
  const { p, s } = curSet(); if (!s) return;
  const inp = $(`#d-${field}`);
  if (inp && document.activeElement !== inp) inp.value = field === 'kg' ? (s.kg != null ? kgStr(s.kg) : '') : (s.reps ?? '');
  if (field === 'kg') {
    const box = $('#d-loader');
    if (box && p.e.meta.eq === 'barre') box.innerHTML = s.kg > 0 ? plateChips(s.kg, p.e.meta.bar || 20) : '';
    // Met à jour les pastilles sans tout redessiner
    const chips = sessionEl.querySelectorAll('.sc:not(.add)');
    p.x.sets.forEach((q, j) => { const v = chips[j] && chips[j].querySelector('.sc-v'); if (v && !q.done) v.innerHTML = `${q.kg != null ? kgStr(q.kg) : '–'}<small>×</small>${q.reps ?? '–'}`; });
  } else {
    const chips = sessionEl.querySelectorAll('.sc:not(.add)'); const { i } = curSet();
    const v = chips[i] && chips[i].querySelector('.sc-v'); if (v && !s.done) v.innerHTML = `${s.kg != null ? kgStr(s.kg) : '–'}<small>×</small>${s.reps ?? '–'}`;
  }
}

// Glisser à gauche / à droite pour changer d'exercice
(() => {
  let x0 = null; let y0 = null;
  sessionEl.addEventListener('touchstart', (ev) => {
    if (ev.target.closest('.pager, input, .dial')) { x0 = null; return; }
    x0 = ev.touches[0].clientX; y0 = ev.touches[0].clientY;
  }, { passive: true });
  sessionEl.addEventListener('touchend', (ev) => {
    if (x0 == null) return;
    const dx = ev.changedTouches[0].clientX - x0; const dy = ev.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 50) return;
    const log = curLog(); if (!log) return;
    const ps = pairs(log); const k = ps.findIndex((p) => p.e.slot === ui.openEx);
    const n = ps[k + (dx < 0 ? 1 : -1)]; if (!n) return;
    ui.openEx = n.e.slot; ui.selI = null; ui.askRir = null; renderSession(); scrollToOpen();
  }, { passive: true });
})();

function overviewSheet() {
  const log = curLog();
  openSheet(`<h2>Vue d'ensemble</h2><p class="lead">Touche un exercice pour y aller.</p>
    ${pairs(log).map(({ e, x }) => {
    const d = x.sets.filter((q) => q.done);
    return `<button class="list-btn" data-act="jump" data-slot="${e.slot}"><span><b style="font-weight:600">${esc(e.slot)}. ${esc(x.name)}</b><br><small>${d.length ? groupSets(d) : 'Pas commencé'}</small></span><small class="num" style="font-size:17px;color:${isComplete(x) ? 'var(--acc)' : 'var(--muted)'}">${d.length}/${x.sets.length}</small></button>`;
  }).join('')}`);
}

// ---------- Minuteur de repos ----------
function startRest(sec, label) {
  S.state.rest = { endAt: Date.now() + sec * 1000, total: sec, label };
  ui.restFired = false; S.save(); renderRest();
}
function stopRest(silent) { S.state.rest = null; S.save(); if (ui.sid && !silent) renderSession(); else renderRest(); }
function renderRest() {
  const r = S.state.rest;
  if (ui.sid) {
    restEl.classList.remove('on', 'over');
    if (!r) return;
    const left = (r.endAt - Date.now()) / 1000;
    if (left <= 0) {
      if (!ui.restFired) { ui.restFired = true; beep(); try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { /* */ } }
      if (ui.restMode) { renderSession(); return; }
      const o = $('#rr-over'); if (o) o.textContent = `+${mmss(-left)}`;
      if (left < -90) { S.state.rest = null; S.save(); if (o) o.remove(); }
      return;
    }
    if (!ui.restMode) return;
    const t = $('#rr-time'); if (t) t.textContent = mmss(left);
    const arc = $('#rr-arc');
    if (arc) { const C = parseFloat(arc.getAttribute('stroke-dasharray')); arc.setAttribute('stroke-dashoffset', C * (1 - Math.max(0, Math.min(1, left / r.total)))); }
    return;
  }
  if (!r) { restEl.classList.remove('on', 'over'); return; }
  const left = (r.endAt - Date.now()) / 1000;
  const over = left <= 0;
  if (over && !ui.restFired) { ui.restFired = true; beep(); try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { /* */ } }
  if (over && left < -90) { stopRest(); return; }
  const pct = Math.max(0, Math.min(1, left / r.total));
  const C = 2 * Math.PI * 22;
  restEl.classList.add('on'); restEl.classList.toggle('over', over);
  restEl.innerHTML = `
    <svg class="ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="22" fill="none" stroke="${over ? 'rgba(0,0,0,.2)' : 'rgba(238,237,232,.12)'}" stroke-width="5"/>
      <circle cx="26" cy="26" r="22" fill="none" stroke="${over ? 'currentColor' : 'var(--acc)'}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" transform="rotate(-90 26 26)"/></svg>
    <div class="t"><span class="num">${over ? `+${mmss(-left)}` : mmss(left)}</span><small>${over ? 'C\'est reparti. ' : ''}${esc(r.label || 'Repos')}</small></div>
    <div class="acts">${over ? '' : '<button data-act="rest" data-d="-15">−15</button><button data-act="rest" data-d="15">+15</button>'}<button data-act="rest" data-d="0" aria-label="Fermer le minuteur">${over ? 'OK' : 'Passer'}</button></div>`;
}
function beep() {
  if (!S.state.settings.sound) return;
  try {
    const ctx = ui.audio || (ui.audio = new (window.AudioContext || window.webkitAudioContext)());
    [0, 0.22, 0.44].forEach((t, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = i === 2 ? 1175 : 880; o.type = 'sine';
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.18);
      o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.2);
    });
  } catch (e) { /* audio indisponible */ }
}
function unlockAudio() {
  if (ui.audio) return;
  try {
    ui.audio = new (window.AudioContext || window.webkitAudioContext)();
    const b = ui.audio.createBuffer(1, 1, 22050); const s = ui.audio.createBufferSource(); s.buffer = b; s.connect(ui.audio.destination); s.start(0);
  } catch (e) { /* */ }
}
document.addEventListener('touchend', unlockAudio, { once: true, passive: true });
document.addEventListener('click', unlockAudio, { once: true });
setInterval(() => { if (S.state.rest) renderRest(); }, 250);

// ---------- Résumé de fin ----------
function summarySheet(log) {
  const recs = S.records(log);
  const sets = log.ex.reduce((a, x) => a + x.sets.filter((s) => s.done).length, 0);
  openSheet(`<div class="summary-hero"><div class="num">${fr(S.sessionTonnage(log) / 1000, 2)} t</div><div class="muted">soulevées en ${hm(log.endedAt - log.startedAt)}, ${sets} séries</div></div>
    ${recs.length ? recs.map((r) => `<div class="pr"><span class="medal">PR</span><div>${esc(r.name)}<small>${kgStr(r.kg)} kg × ${r.reps}, 1RM estimé +${fr(r.gain, 1)} kg</small></div></div>`).join('') : '<p class="muted" style="text-align:center;margin:0 0 6px">Pas de record cette fois. Ce qui compte : la séance est faite.</p>'}
    <button class="btn primary block" style="margin-top:16px" data-act="closesheet">Fermer</button>`);
}

// ---------- Fichiers ----------
async function exportJSON() {
  const data = JSON.stringify({ ...S.state, exportedAt: new Date().toISOString() }, null, 1);
  const name = `muscu-sauvegarde-${S.todayISO()}.json`;
  const file = new File([data], name, { type: 'application/json' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Sauvegarde Muscu' }); }
    else downloadBlob(file, name);
    S.state.lastBackup = new Date().toISOString(); S.save(); toast('Sauvegarde créée'); render();
  } catch (e) { if (e && e.name !== 'AbortError') toast('Sauvegarde impossible'); }
}
function downloadBlob(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function exportCSV() {
  const rows = [['semaine', 'seance', 'date', 'ordre', 'exercice', 'serie', 'kg', 'reps', 'rir', 'note']];
  S.doneSessions().forEach((l) => l.ex.forEach((x) => x.sets.forEach((s, i) => { if (s.done) rows.push([l.week, l.type, l.date, x.slot, x.name, i + 1, s.kg ?? '', s.reps ?? '', x.rir ?? '', x.note || '']); })));
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
  downloadBlob(new Blob(['﻿' + csv], { type: 'text/csv' }), `muscu-series-${S.todayISO()}.csv`);
}

// ---------- Actions ----------
const A = {
  tab: (d) => { ui.tab = d.tab; closeSheet(true); render(); window.scrollTo(0, 0); },
  settings: () => settingsSheet(),
  faqsheet: () => faqSheet(),
  faq: (d) => { const f = P.FAQ[+d.i]; ui.faq.push(f); render(); setTimeout(() => { const t = $('#thread'); if (t) t.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50); },
  start: (d) => { const log = S.startSession(+d.w, d.t); openSession(log.id); },
  resume: () => { if (S.state.active) openSession(S.state.active); },
  open: (d) => { openSession(d.id); },
  preview: (d) => previewSheet(+d.w, d.t),
  week: (d) => weekSheet(+d.w),
  skip: (d) => { S.skipSession(d.id); closeSheet(); render(); toast('Séance passée'); },
  unskip: (d) => { S.unskipSession(d.id); closeSheet(); render(); },
  catchup: (d) => {
    const to = +d.to;
    for (let w = S.currentWeek(); w < to; w++) ['A', 'B', 'C'].forEach((t) => { const id = S.sessionId(w, t); if (!S.isClosed(id) && !S.getLog(id)) S.state.skipped[id] = true; });
    S.save(); render(); toast(`Direction semaine ${to}`);
  },
  weigh: () => weighSheet(),
  wstep: (d) => { ui.wDraft = Math.round((ui.wDraft + +d.d) * 10) / 10; const el = $('#wval'); if (el) el.innerHTML = el.closest('.mini-step') ? fr(ui.wDraft, 1) : `${fr(ui.wDraft, 1)}<small>kg</small>`; },
  wsave: () => { S.state.weights[S.todayISO()] = ui.wDraft; S.save(); render(); toast(`${fr(ui.wDraft, 1)} kg noté`); },
  habit: (d) => { const t = S.todayISO(); const h = S.state.habits[t] = S.state.habits[t] || {}; h[d.k] = !h[d.k]; haptic(); S.save(); render(); },
  measure: () => measureSheet(),
  msave: () => {
    const num = (id) => { const v = parseFloat(($(`#${id}`).value || '').replace(',', '.')); return isNaN(v) ? null : v; };
    const m = { date: $('#m-date').value || S.todayISO(), arm: num('m-arm'), waist: num('m-waist'), shoulders: num('m-shoulders'), thigh: num('m-thigh'), weight: num('m-weight') };
    S.state.measures = S.state.measures.filter((x) => x.date !== m.date).concat(m);
    S.save(); closeSheet(); render(); toast('Mensurations enregistrées');
  },
  ptype: (d) => { ui.progType = d.t; render(); },
  exdetail: (d) => exDetailSheet(d.name),
  sound: (d, el) => { const v = el.getAttribute('aria-checked') !== 'true'; el.setAttribute('aria-checked', v); S.state.settings.sound = v; S.save(); },
  ssave: () => {
    const s = S.state.settings;
    s.name = $('#s-name').value.trim() || s.name;
    if ($('#s-start').value) s.start = $('#s-start').value;
    const n = (id, d) => { const v = parseFloat(($(`#${id}`).value || '').replace(',', '.')); return isNaN(v) ? d : v; };
    s.weight0 = n('s-w0', s.weight0); s.kcal = n('s-kcal', s.kcal); s.protein = n('s-prot', s.protein);
    S.save(true); closeSheet(); render(); toast('Réglages enregistrés');
  },
  export: () => exportJSON(),
  csv: () => exportCSV(),
  reset: (d, el) => {
    if (el.dataset.confirm) { S.resetAll(); closeSheet(); ui.faq = []; render(); toast('Données effacées'); return; }
    el.dataset.confirm = '1'; el.innerHTML = '<span>Appuie encore pour tout effacer. Pense à sauvegarder avant.</span>';
  },
  closesheet: () => closeSheet(),

  // Séance
  sclose: () => closeSession(),
  smenu: () => {
    const log = curLog();
    openSheet(`<h2>Séance ${log.type}</h2><p class="lead">Semaine ${log.week}</p>
      <button class="list-btn" data-act="overview"><span>Vue d'ensemble<br><small>Tous les exercices et ce qui est fait</small></span></button>
      ${log.done ? '' : '<button class="list-btn" data-act="finish"><span>Terminer la séance</span></button>'}
      <button class="list-btn" data-act="skipcur"><span>Passer cette séance<br><small>Elle sera marquée comme non faite</small></span></button>
      <button class="list-btn" data-act="discard" style="color:var(--bad)"><span>Supprimer ce qui a été noté</span></button>`);
  },
  jump: (d) => { ui.openEx = d.slot; ui.selI = null; ui.askRir = null; closeSheet(true); renderSession(); scrollToOpen(); },
  overview: () => overviewSheet(),
  pickset: (d) => { const i = +d.i; ui.selI = i < 0 ? null : (ui.selI === i && curLog().done ? null : i); renderSession(); },
  dstep: (d) => {
    const { s } = curSet(); if (!s) return;
    const f = d.f; const v = (parseFloat(s[f]) || 0) + parseFloat(d.d);
    setValue(f, v); refreshDial(f); haptic();
  },
  dset: (d) => { setValue('kg', parseFloat(d.kg)); setValue('reps', parseInt(d.reps, 10)); refreshDial('kg'); refreshDial('reps'); },
  validate: () => {
    const { log, p, s } = curSet(); if (!s) return;
    const pdc = p.e.meta.eq === 'pdc';
    if (s.kg == null && !pdc) { toast('Indique la charge'); const k = $('#d-kg'); if (k) k.focus(); return; }
    if (!s.reps) { toast('Indique les répétitions'); const r = $('#d-reps'); if (r) r.focus(); return; }
    if (s.kg == null) s.kg = 0;
    s.done = true; s.ts = Date.now(); haptic(); ui.askRir = null;
    const before = ui.openEx;
    if (log.done) ui.selI = null; else afterSet(log, p.e.slot);
    S.save(); renderSession();
    if (before !== ui.openEx) scrollToOpen();
  },
  undoset: () => { const { s } = curSet(); if (s) { s.done = false; S.save(); renderSession(); } },
  delset: () => { const { p, i, s } = curSet(); if (s && !s.done && p.x.sets.length > 1) { p.x.sets.splice(i, 1); ui.selI = null; S.save(); renderSession(); } },
  rir: (d) => { const p = findPair(curLog(), d.slot); p.x.rir = p.x.rir === +d.r ? null : +d.r; haptic(); S.save(); renderSession(); },
  addset: () => { const { p } = curSet(); const q = p || findPair(curLog(), ui.openEx); const l = q.x.sets[q.x.sets.length - 1]; q.x.sets.push({ kg: l ? l.kg : null, reps: l ? l.reps : null, done: false }); ui.selI = q.x.sets.length - 1; S.save(); renderSession(); },
  swap: (d) => {
    const log = curLog(); const p = findPair(log, d.slot);
    const muscle = (P.EX[p.e.original] || {}).m;
    const list = (P.ALTERNATIVES[muscle] || []).filter((n) => n !== p.e.original);
    openSheet(`<h2>Remplacer</h2><p class="lead">${esc(p.e.original)}. Le remplacement vaut pour tout le bloc ${P.blockOf(log.week).id}. Garde un exercice qui travaille le même muscle (${esc(muscle)}).</p>
      <button class="list-btn ${!p.e.swapped ? 'sel' : ''}" data-act="doswap" data-slot="${d.slot}" data-name=""><span>${esc(p.e.original)}<br><small>Exercice du programme</small></span></button>
      ${list.map((n) => `<button class="list-btn ${p.e.name === n ? 'sel' : ''}" data-act="doswap" data-slot="${d.slot}" data-name="${esc(n)}"><span>${esc(n)}</span></button>`).join('')}`);
  },
  doswap: (d) => {
    const log = curLog(); const p = findPair(log, d.slot);
    if (d.name) S.state.swaps[p.e.swapKey] = d.name; else delete S.state.swaps[p.e.swapKey];
    const tpl = S.template(log.week, log.type); const e = tpl.exercises.find((x) => x.slot === d.slot);
    if (!p.x.sets.some((s) => s.done)) {
      const sug = S.suggestion(e, log.id);
      p.x.name = e.name; p.x.sets = p.x.sets.map(() => ({ kg: sug.kg, reps: sug.reps, done: false }));
    } else p.x.name = e.name;
    S.save(); closeSheet(); renderSession(); toast('Exercice remplacé');
  },
  finish: () => {
    const log = curLog();
    const left = log.ex.reduce((a, x) => a + x.sets.filter((s) => !s.done).length, 0);
    const doneN = log.ex.reduce((a, x) => a + x.sets.filter((s) => s.done).length, 0);
    if (!doneN) { toast('Valide au moins une série'); return; }
    if (left && !(sheetEl && sheetEl.dataset.confirm)) {
      const sh = openSheet(`<h2>Terminer la séance ?</h2><p class="lead">Il reste ${left} série${left > 1 ? 's' : ''} non cochée${left > 1 ? 's' : ''}. Elles ne compteront pas.</p>
        <div class="btn-row"><button class="btn grow" data-act="closesheet">Continuer</button><button class="btn primary grow" data-act="finish">Terminer</button></div>`);
      sh.dataset.confirm = '1'; return;
    }
    // Retire les séries non faites
    log.ex.forEach((x) => { x.sets = x.sets.filter((s) => s.done); });
    S.finishSession(log.id);
    closeSheet(true); closeSession();
    summarySheet(log);
  },
  skipcur: () => { const log = curLog(); const id = log.id; const hadSets = log.ex.some((x) => x.sets.some((s) => s.done)); if (!hadSets) S.discardSession(id); S.skipSession(id); closeSheet(true); closeSession(); toast('Séance passée'); },
  discard: (d, el) => {
    if (!el.dataset.confirm) { el.dataset.confirm = '1'; el.innerHTML = '<span>Appuie encore pour supprimer les séries de cette séance</span>'; return; }
    const id = curLog().id; S.discardSession(id); closeSheet(true); closeSession(); toast('Séance supprimée');
  },
  rest: (d) => {
    const r = S.state.rest; if (!r) return;
    const v = +d.d;
    if (v === 0) { stopRest(); return; }
    r.endAt += v * 1000; r.total = Math.max(r.total + v, 1); if (r.endAt > Date.now()) ui.restFired = false; S.save(); if (ui.sid && r.endAt <= Date.now()) renderSession(); else renderRest();
  },
};

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const fn = A[el.dataset.act];
  if (fn) { ev.preventDefault(); fn(el.dataset, el, ev); }
});
document.addEventListener('input', (ev) => {
  const el = ev.target; const k = el.dataset && el.dataset.input;
  if (!k) return;
  if (k === 'note') { const p = findPair(curLog(), el.dataset.slot); if (p) { p.x.note = el.value; S.save(); } }
  if (k === 'dkg') { setValue('kg', el.value === '' ? null : parseFloat(el.value.replace(',', '.'))); refreshDial('kg'); }
  if (k === 'dreps') { setValue('reps', el.value === '' ? null : parseInt(el.value, 10)); refreshDial('reps'); }
});
document.addEventListener('change', async (ev) => {
  const el = ev.target;
  if (el.dataset && el.dataset.input === 'import' && el.files && el.files[0]) {
    try {
      const data = JSON.parse(await el.files[0].text());
      if (!data || typeof data !== 'object' || !data.sessions || !data.settings) throw new Error('format');
      S.replaceState(data); closeSheet(); render(); toast('Sauvegarde restaurée');
    } catch (e) { toast('Ce fichier n\'est pas une sauvegarde Muscu'); }
  }
});
document.addEventListener('focusin', (ev) => { if (ev.target.matches('.dial-in')) setTimeout(() => ev.target.select(), 30); });
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { if (ui.sid) { keepAwake(true); renderSession(); } else render(); renderRest(); }
});

// ---------- Démarrage ----------
$('.tabbar').innerHTML = [['coach', 'Aujourd\'hui', I.home], ['programme', 'Programme', I.prog], ['progres', 'Progrès', I.stats], ['corps', 'Corps', I.body]]
  .map(([t, l, ic]) => `<button data-act="tab" data-tab="${t}">${ic}<span>${l}</span></button>`).join('');
render();
renderRest();
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('./sw.js').catch(() => {});
window.__muscu = { S, P, ui };
