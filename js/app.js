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
  const fn = { coach: viewCoach, programme: viewProgramme, progres: viewProgres, corps: viewCorps }[ui.tab];
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

function viewCoach() {
  const st = S.state;
  const cw = S.currentWeek();
  const info = P.weekInfo(cw);
  const nx = S.nextSession();
  const today = S.todayISO();
  const dates = S.weekDates(cw);
  const msgs = [];

  msgs.push(bubble(`<span class="stamp">${esc(DFULL.format(new Date()))}</span><p>${greeting()} ${esc(st.settings.name)}.</p>`));

  if (today < st.settings.start) {
    msgs.push(bubble(`<p>Le programme démarre le ${esc(DFULL.format(S.parseISO(st.settings.start)))}. D'ici là, cale tes repas : 4 par jour, ${st.settings.protein} g de protéines.</p>`));
  }

  // Bloc qui commence
  const doneThisWeek = ['A', 'B', 'C'].filter((t) => S.isDone(S.sessionId(cw, t))).length;
  if (info.wib === 1 && doneThisWeek === 0 && !nx.inProgress) {
    msgs.push(bubble(`<p>On attaque le bloc ${info.block.id}, ${esc(info.block.name)}. ${esc(info.block.goal)}</p><p class="muted">${esc(info.block.why[0])}</p>`));
  } else if (info.deload && doneThisWeek === 0) {
    msgs.push(bubble(`<p>Semaine de déload. Moitié des séries, charges -10 %, RIR 4. Tu dois sortir de la salle frais : c'est cette semaine que tu encaisses les 7 précédentes.</p>`));
  } else if (cw > 1 && doneThisWeek === 0) {
    const prev = ['A', 'B', 'C'].filter((t) => S.isDone(S.sessionId(cw - 1, t))).length;
    if (prev === 3) {
      const streak = S.streakWeeks();
      msgs.push(bubble(`<p>Semaine ${cw - 1} bouclée, 3 séances sur 3.${streak >= 2 ? ` Ça fait ${streak} semaines complètes d'affilée.` : ''} ${esc(info.consigne)}</p>`));
    }
  }

  // En retard sur le calendrier
  const cal = S.calendarWeek();
  if (today >= st.settings.start && cal - cw >= 2 && cal <= 32) {
    msgs.push(bubble(`<p>D'après le calendrier, tu devrais être en semaine ${cal}. Pas grave : on reprend là où tu t'es arrêté. Après plus d'une semaine sans salle, retire 5 % sur tes charges.</p><div class="btn-row" style="margin-top:10px"><button class="btn small" data-act="catchup" data-to="${cal}">Passer à la semaine ${cal}</button></div>`));
  }

  // Séance du jour
  msgs.push(`<div class="msg coach wide">${nextCard(nx)}</div>`);

  // Dernière séance
  const done = S.doneSessions();
  const last = done[done.length - 1];
  if (last && last.endedAt && Date.now() - last.endedAt < 3 * 86400000) {
    const recs = S.records(last);
    const meta = P.SESSION_META[last.type];
    msgs.push(bubble(`<p>Dernière séance : ${last.type}, ${esc(meta.name)}, en ${hm(last.endedAt - last.startedAt)}. ${fr(S.sessionTonnage(last) / 1000, 1)} tonnes soulevées.</p>${recs.length ? `<p>${recs.length === 1 ? 'Un record' : `${recs.length} records`} : ${recs.slice(0, 3).map((r) => `${esc(r.name)} ${kgStr(r.kg)} × ${r.reps}`).join(', ')}.</p>` : ''}`));
  }

  // Poids
  const lw = S.lastWeight();
  if (!st.weights[today]) {
    msgs.push(bubble(`<p>Tu t'es pesé ce matin ? À jeun, après les toilettes. Seule la moyenne de la semaine compte.</p><div class="btn-row" style="margin-top:10px"><button class="btn small" data-act="weigh">Noter mon poids</button></div>`));
  }
  const adv = S.weightAdvice();
  if (adv) {
    const txt = adv.verdict === 'up'
      ? `Ta moyenne bouge de ${fr(adv.delta, 2)} kg par semaine : c'est trop lent. Ajoute 200 kcal par jour, par exemple un verre de lait et 30 g de beurre de cacahuète.`
      : adv.verdict === 'down'
        ? `Tu prends ${fr(adv.delta, 2)} kg par semaine : c'est un peu rapide. Retire 150 kcal par jour.`
        : `Tu prends ${fr(adv.delta, 2)} kg par semaine : pile dans la cible. On ne touche à rien.`;
    msgs.push(bubble(`<p>${txt}</p>`));
  } else if (lw && Object.keys(st.weights).length < 6) {
    msgs.push(bubble(`<p>Pèse-toi au moins 3 matins par semaine : je te dirai alors s'il faut manger plus.</p>`));
  }

  // Sauvegarde
  const nDone = done.length;
  const lastB = st.lastBackup ? Date.now() - new Date(st.lastBackup).getTime() : Infinity;
  if (nDone >= 2 && lastB > 7 * 86400000) {
    msgs.push(bubble(`<p>Tes données restent sur ce téléphone. Fais une sauvegarde de temps en temps, par exemple dans iCloud Drive.</p><div class="btn-row" style="margin-top:10px"><button class="btn small" data-act="export">Sauvegarder</button></div>`));
  }

  ui.faq.forEach(({ q, a }) => { msgs.push(bubble(esc(q), 'me')); msgs.push(bubble(`<p>${esc(a)}</p>`)); });

  const chips = [];
  if (nx.inProgress) chips.push(`<button class="chip acc" data-act="resume">Reprendre la séance</button>`);
  else chips.push(`<button class="chip acc" data-act="start" data-w="${nx.week}" data-t="${nx.type}">Démarrer la séance ${nx.type}</button>`);
  P.FAQ.forEach((f, i) => { if (!ui.faq.some((x) => x.q === f.q)) chips.push(`<button class="chip" data-act="faq" data-i="${i}">${esc(f.q)}</button>`); });

  return `
    <div class="topbar">
      <div class="coach-avatar"><i></i>Ton coach</div>
      <button class="icon-btn" data-act="settings" aria-label="Réglages">${I.gear}</button>
    </div>
    <div class="week-hero">
      <div class="big num">${cw}<small>/32</small></div>
      <div class="meta"><b>Bloc ${info.block.id}, ${esc(info.block.name)}</b><span>${dshort(dates.from)} – ${dshort(dates.to)}</span><span>RIR visé ${esc(info.rir)}</span></div>
      ${plateBadge(info.block)}
    </div>
    ${ribbon(cw)}
    <div class="thread" id="thread">${msgs.join('')}</div>
    <div class="chips">${chips.join('')}</div>`;
}

function nextCard(nx) {
  const tpl = S.template(nx.week, nx.type);
  const id = S.sessionId(nx.week, nx.type);
  const first = tpl.exercises[0];
  const sug = S.suggestion(first, id);
  const dur = P.sessionDurationEstimate(tpl);
  const log = S.getLog(id);
  const progress = log ? log.ex.reduce((a, x) => a + x.sets.filter((s) => s.done).length, 0) : 0;
  const total = tpl.exercises.reduce((a, e) => a + e.sets, 0);
  const target = sug.kg != null
    ? `<b>${kgStr(sug.kg)} kg × ${sug.reps}</b> <span class="muted">au ${esc(first.name.toLowerCase())}</span><br><span class="muted" style="font-size:13px">${esc(sug.why)}</span>`
    : `<span class="muted">Premier exercice : ${esc(first.name)}. ${esc(sug.why)}.</span>`;
  return `
    <div class="next-card">
      <div class="row1"><span class="letter num">${nx.type}</span><div><h3>${nx.inProgress ? 'Séance en cours' : esc(tpl.meta.name)}</h3>
        <div class="sub">${nx.inProgress ? `${esc(tpl.meta.name)}, ${progress} séries sur ${total}` : `Semaine ${nx.week}, ${tpl.exercises.length} exercices, environ ${dur} min`}</div></div></div>
      <div class="target">${target}</div>
      <div class="btn-row">
        ${nx.inProgress
    ? '<button class="btn primary grow" data-act="resume">Reprendre</button>'
    : `<button class="btn primary grow" data-act="start" data-w="${nx.week}" data-t="${nx.type}">Démarrer</button>`}
        <button class="btn" data-act="preview" data-w="${nx.week}" data-t="${nx.type}">Aperçu</button>
      </div>
    </div>`;
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
    <div class="section-title"><h2>Aujourd'hui</h2><span>7 derniers jours</span></div>
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
  sheetEl.innerHTML = `<div class="grab"></div>${html}`;
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
function setSheet(html) { if (sheetEl) sheetEl.innerHTML = `<div class="grab"></div>${html}`; }
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
    <a class="list-btn" href="./v2/" style="color:inherit;text-decoration:none"><span>Ancienne version (2.1)<br><small>Ton ancien programme et son historique</small></span></a>
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
  ui.openEx = firstOpen(log);
  closeSheet(true);
  document.body.classList.add('in-session');
  renderSession();
  requestAnimationFrame(() => sessionEl.classList.add('on'));
  keepAwake(true);
  clearInterval(ui.clock);
  ui.clock = setInterval(tickClock, 1000);
  setTimeout(() => scrollToOpen(false), 450);
}

function closeSession() {
  sessionEl.classList.remove('on');
  document.body.classList.remove('in-session');
  clearInterval(ui.clock);
  keepAwake(false);
  ui.sid = null;
  render();
}

function tickClock() {
  const log = curLog(); const el = $('#s-clock');
  if (!log || !el) return;
  el.textContent = mmss(((log.done ? log.endedAt : Date.now()) - log.startedAt) / 1000);
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

function exCard(e, x, log, info) {
  const open = ui.openEx === e.slot;
  const complete = isComplete(x);
  const nDone = x.sets.filter((s) => s.done).length;
  const sug = S.suggestion(e, log.id);
  const nextIdx = x.sets.findIndex((s) => !s.done);
  const ss = e.ssPos ? `ss-${e.ssPos}` : '';
  let body = '';
  if (open) {
    const tags = [
      `<span class="tag">${x.sets.length} × ${repsLabel(e)}</span>`,
      `<span class="tag">RIR ${esc(info.rir)}</span>`,
      e.ssPos === 'a' ? `<span class="tag acc">${I.bolt}Superset avec ${e.superset}b</span>` : `<span class="tag">Repos ${restLabel(e.rest)}</span>`,
      e.plus ? '<span class="tag acc">+1 série cette semaine</span>' : '',
      `<button class="tag" data-act="swap" data-slot="${e.slot}">${I.swap}Remplacer</button>`,
    ].join('');
    const last = sug.last;
    const lastTxt = last ? `<b>Dernière fois (S${last.week})</b><br>${last.sets.map((s) => `${kgStr(s.kg)}×${s.reps}`).join('  ')}` : `<b>Première fois</b><br>${esc(sug.why)}`;
    const goal = sug.kg != null ? `<div class="goal"><span class="num">${kgStr(sug.kg)} × ${sug.reps}</span><small>${last ? esc(sug.why) : 'Charge de départ'}</small></div>` : '';
    const curKg = (x.sets[nextIdx >= 0 ? nextIdx : x.sets.length - 1] || {}).kg;
    let loader = '';
    if (e.meta.eq === 'barre' && curKg > 0) {
      const bar = e.meta.bar || 20;
      const anim = ui.loaderSeen[e.slot] !== curKg; ui.loaderSeen[e.slot] = curKg;
      loader = plateLoader(curKg, bar, anim);
    }
    let warm = '';
    if (e.slot === '1' && ['barre', 'smith'].includes(e.meta.eq) && sug.kg >= 35 && nDone === 0) {
      const ws = warmupSets(sug.kg, e.meta.bar || 20);
      warm = `<div class="muted" style="font-size:13px;margin-bottom:6px">Échauffement, pas noté</div><div class="warm">${ws.map((w) => `<span><b>${kgStr(w.kg)}</b> × ${w.reps}</span>`).join('')}</div>`;
    }
    const sets = x.sets.map((s, i) => `
      <div class="set ${s.done ? 'done' : ''} ${i === nextIdx ? 'next' : ''}">
        <span class="n">${i + 1}</span>
        <button class="val ${s.kg == null ? 'empty' : ''}" data-act="editset" data-slot="${e.slot}" data-i="${i}" aria-label="Charge série ${i + 1}"><span class="num">${kgStr(s.kg)}</span><small>${e.meta.eq === 'pdc' ? 'lest' : 'kg'}</small></button>
        <span class="x">×</span>
        <button class="val ${s.reps == null ? 'empty' : ''}" data-act="editset" data-slot="${e.slot}" data-i="${i}" aria-label="Reps série ${i + 1}"><span class="num">${s.reps ?? '–'}</span><small>reps</small></button>
        <button class="ok" data-act="toggleset" data-slot="${e.slot}" data-i="${i}" aria-label="${s.done ? 'Annuler' : 'Valider'} la série ${i + 1}" aria-pressed="${s.done}">${I.check}</button>
      </div>`).join('');
    const rir = [0, 1, 2, 3, 4].map((r) => `<button data-act="rir" data-slot="${e.slot}" data-r="${r}" aria-pressed="${x.rir === r}">${r}</button>`).join('');
    body = `<div class="ex-body">
      <div class="ex-tools">${tags}</div>
      ${e.note ? `<p class="ex-note">${esc(e.note)}</p>` : ''}
      <div class="target-line"><div class="lt">${lastTxt}</div>${goal}</div>
      ${warm}${loader}${sets}
      <div class="ex-foot">
        <div class="rir"><span>RIR réel</span>${rir}</div>
        <span style="flex:1"></span>
        <button class="btn small" data-act="addset" data-slot="${e.slot}">+ Série</button>
      </div>
      <input class="note-input" placeholder="Note : sensations, réglage machine…" value="${esc(x.note)}" data-input="note" data-slot="${e.slot}">
    </div>`;
  }
  return `<section class="ex ${open ? 'open' : ''} ${complete ? 'complete' : ''} ${ss}" id="ex-${e.slot}">
    <button class="ex-head" data-act="exopen" data-slot="${e.slot}" aria-expanded="${open}">
      <span class="slot">${complete ? I.check.replace('<svg', '<svg width="20" height="20"') : esc(e.slot)}</span>
      <span class="nm"><b>${esc(x.name)}</b><small>${esc(e.meta.m)}${e.swapped ? ', remplacé' : ''}</small></span>
      <span class="prog num">${nDone}/${x.sets.length}</span>
    </button>${body}</section>`;
}

function renderSession() {
  const log = curLog(); if (!log) return;
  const tpl = S.template(log.week, log.type);
  const info = tpl.info;
  theme(log.week);
  const ps = pairs(log);
  // Barre de progression : une case par exercice, supersets collés
  let segs = ''; let i = 0;
  while (i < ps.length) {
    const p = ps[i];
    const seg = (q) => `<button data-act="exopen" data-slot="${q.e.slot}" class="${isComplete(q.x) ? 'done' : ui.openEx === q.e.slot ? 'cur' : ''}" aria-label="${esc(q.x.name)}"></button>`;
    if (p.e.ssPos === 'a' && ps[i + 1] && ps[i + 1].e.ssPos === 'b') { segs += `<span class="pair">${seg(p)}${seg(ps[i + 1])}</span>`; i += 2; } else { segs += seg(p); i++; }
  }
  const total = ps.reduce((a, p) => a + p.x.sets.length, 0);
  const doneN = ps.reduce((a, p) => a + p.x.sets.filter((s) => s.done).length, 0);
  const scroller = $('.s-body', sessionEl); const keep = scroller ? scroller.scrollTop : 0;
  sessionEl.innerHTML = `
    <header class="s-top">
      <div class="bar">
        <button class="icon-btn" data-act="sclose" aria-label="Réduire la séance">${I.down}</button>
        <div class="title"><b>${log.type}, ${esc(tpl.meta.name)}${log.done ? ' (modification)' : ''}</b><span>Semaine ${log.week}, ${doneN} séries sur ${total}</span></div>
        <span class="clock num" id="s-clock">${mmss(((log.done ? log.endedAt : Date.now()) - log.startedAt) / 1000)}</span>
        <button class="icon-btn" data-act="smenu" aria-label="Options de la séance">${I.more}</button>
      </div>
      <div class="segments">${segs}</div>
    </header>
    <div class="s-body">
      ${ps.map(({ e, x }) => exCard(e, x, log, info)).join('')}
      <div class="s-finish">${log.done
    ? '<button class="btn primary block" data-act="sclose">Enregistrer et fermer</button>'
    : `<button class="btn ${doneN === total ? 'primary' : ''} block" data-act="finish">Terminer la séance</button>`}</div>
    </div>`;
  const sc = $('.s-body', sessionEl); if (sc) sc.scrollTop = keep;
}

function scrollToOpen(smooth = true) {
  const el = ui.openEx && $(`#ex-${CSS.escape(ui.openEx)}`, sessionEl);
  if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
}

function findPair(log, slot) { return pairs(log).find((p) => p.e.slot === slot); }

// Après une série validée : repos et exercice suivant (en tenant compte des supersets)
function afterSet(log, slot) {
  const ps = pairs(log);
  const idx = ps.findIndex((p) => p.e.slot === slot);
  const { e, x } = ps[idx];
  let nextSlot = slot; let restSec = e.rest; let nextLabel = '';
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
  if (nextSlot) {
    const t = ps.find((p) => p.e.slot === nextSlot);
    const si = t.x.sets.findIndex((s) => !s.done);
    nextLabel = `Ensuite : ${t.x.name}, série ${si + 1}`;
  } else nextLabel = 'Dernière série faite : termine la séance';
  if (restSec > 0 && nextSlot) startRest(restSec, nextLabel);
  else if (!nextSlot) stopRest();
  const changed = nextSlot && nextSlot !== ui.openEx;
  if (nextSlot) ui.openEx = nextSlot;
  return changed;
}

function setEntrySheet(slot, i) {
  const log = curLog(); const p = findPair(log, slot); if (!p) return;
  const s = p.x.sets[i];
  const sug = S.suggestion(p.e, log.id);
  ui.entry = { slot, i, kg: s.kg ?? sug.kg ?? (p.e.meta.eq === 'pdc' ? 0 : 20), reps: s.reps ?? sug.reps ?? p.e.lo, all: !s.done && i < p.x.sets.length - 1 };
  openSheet(entryHtml(p, log), () => { ui.entry = null; });
}
function entryHtml(p, log) {
  const en = ui.entry; const e = p.e;
  const step = e.meta.inc || 1;
  const prev = en.i > 0 ? p.x.sets[en.i - 1] : null;
  const last = S.suggestion(e, log.id).last;
  const lastSet = last && (last.sets[en.i] || last.sets[last.sets.length - 1]);
  return `<h2>Série ${en.i + 1}</h2><p class="lead">${esc(p.x.name)}, objectif ${repsLabel(e)} reps.</p>
    <div class="entry">
      <div class="box"><div class="l">${e.meta.eq === 'pdc' ? 'Lest (kg)' : e.meta.eq === 'halteres' ? 'kg par haltère' : 'Charge (kg)'}</div>
        <input id="en-kg" inputmode="decimal" value="${kgStr(en.kg) === '–' ? '' : kgStr(en.kg)}" data-input="enkg" aria-label="Charge">
        <div class="pm"><button class="round" data-act="enstep" data-f="kg" data-d="${-step}">−</button><button class="round" data-act="enstep" data-f="kg" data-d="${step}">+</button></div></div>
      <div class="box"><div class="l">Répétitions</div>
        <input id="en-reps" inputmode="numeric" value="${en.reps ?? ''}" data-input="enreps" aria-label="Répétitions">
        <div class="pm"><button class="round" data-act="enstep" data-f="reps" data-d="-1">−</button><button class="round" data-act="enstep" data-f="reps" data-d="1">+</button></div></div>
    </div>
    <div class="quick">
      ${prev && prev.kg != null ? `<button data-act="enset" data-kg="${prev.kg}" data-reps="${prev.reps}">Série d'avant : ${kgStr(prev.kg)} × ${prev.reps}</button>` : ''}
      ${lastSet ? `<button data-act="enset" data-kg="${lastSet.kg}" data-reps="${lastSet.reps}">S${last.week} : ${kgStr(lastSet.kg)} × ${lastSet.reps}</button>` : ''}
    </div>
    <div id="en-loader" style="margin-top:12px">${e.meta.eq === 'barre' && en.kg > 0 ? plateLoader(en.kg, e.meta.bar || 20, false) : ''}</div>
    ${en.i < p.x.sets.length - 1 ? `<div class="toggle-line"><span>Même charge pour les séries suivantes</span><button class="switch" data-act="enall" role="switch" aria-checked="${en.all}" aria-label="Même charge pour les séries suivantes"></button></div>` : '<div style="height:12px"></div>'}
    <div class="btn-row"><button class="btn grow" data-act="ensave">Enregistrer</button><button class="btn primary grow" data-act="endone">${I.check}Valider</button></div>`;
}
function applyEntry(markDone) {
  const log = curLog(); const en = ui.entry; if (!log || !en) return;
  const p = findPair(log, en.slot); const s = p.x.sets[en.i];
  s.kg = en.kg === '' || en.kg == null || isNaN(en.kg) ? null : en.kg;
  s.reps = en.reps === '' || en.reps == null || isNaN(en.reps) ? null : Math.round(en.reps);
  if (en.all) p.x.sets.forEach((o, j) => { if (j > en.i && !o.done) o.kg = s.kg; });
  let moved = false;
  if (markDone && s.reps != null) { s.done = true; s.ts = Date.now(); haptic(); if (!log.done) moved = afterSet(log, en.slot); }
  S.save();
  closeSheet(); ui.entry = null;
  renderSession();
  if (moved) setTimeout(() => scrollToOpen(), 60);
}

// ---------- Minuteur de repos ----------
function startRest(sec, label) {
  S.state.rest = { endAt: Date.now() + sec * 1000, total: sec, label };
  ui.restFired = false; S.save(); renderRest();
}
function stopRest() { S.state.rest = null; S.save(); renderRest(); }
function renderRest() {
  const r = S.state.rest;
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
  wstep: (d) => { ui.wDraft = Math.round((ui.wDraft + +d.d) * 10) / 10; const el = $('#wval'); if (el) el.innerHTML = `${fr(ui.wDraft, 1)}<small>kg</small>`; },
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
      ${log.done ? '' : '<button class="list-btn" data-act="finish"><span>Terminer la séance</span></button>'}
      <button class="list-btn" data-act="skipcur"><span>Passer cette séance<br><small>Elle sera marquée comme non faite</small></span></button>
      <button class="list-btn" data-act="discard" style="color:var(--bad)"><span>Supprimer ce qui a été noté</span></button>`);
  },
  exopen: (d) => { ui.openEx = ui.openEx === d.slot ? null : d.slot; renderSession(); if (ui.openEx) setTimeout(() => scrollToOpen(), 30); },
  toggleset: (d) => {
    const log = curLog(); const p = findPair(log, d.slot); const s = p.x.sets[+d.i];
    if (s.done) { s.done = false; S.save(); renderSession(); return; }
    if (s.reps == null || (s.kg == null && p.e.meta.eq !== 'pdc')) { setEntrySheet(d.slot, +d.i); return; }
    s.done = true; s.ts = Date.now(); haptic();
    const moved = log.done ? false : afterSet(log, d.slot);
    S.save(); renderSession();
    if (moved) setTimeout(() => scrollToOpen(), 60);
  },
  editset: (d) => setEntrySheet(d.slot, +d.i),
  enstep: (d) => {
    const en = ui.entry; const f = d.f;
    const v = (parseFloat(en[f]) || 0) + parseFloat(d.d);
    en[f] = Math.max(0, f === 'reps' ? Math.round(v) : Math.round(v * 100) / 100);
    const inp = $(`#en-${f}`); if (inp) inp.value = f === 'kg' ? kgStr(en.kg) : en.reps;
    refreshLoader();
  },
  enset: (d) => { ui.entry.kg = parseFloat(d.kg); ui.entry.reps = parseInt(d.reps, 10); $('#en-kg').value = kgStr(ui.entry.kg); $('#en-reps').value = ui.entry.reps; refreshLoader(); },
  enall: (d, el) => { ui.entry.all = !ui.entry.all; el.setAttribute('aria-checked', ui.entry.all); },
  ensave: () => applyEntry(false),
  endone: () => applyEntry(true),
  rir: (d) => { const p = findPair(curLog(), d.slot); p.x.rir = p.x.rir === +d.r ? null : +d.r; S.save(); renderSession(); },
  addset: (d) => { const p = findPair(curLog(), d.slot); const l = p.x.sets[p.x.sets.length - 1]; p.x.sets.push({ kg: l ? l.kg : null, reps: l ? l.reps : null, done: false }); S.save(); renderSession(); },
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
    r.endAt += v * 1000; r.total = Math.max(r.total + v, 1); if (r.endAt > Date.now()) ui.restFired = false; S.save(); renderRest();
  },
};

function refreshLoader() {
  const log = curLog(); const en = ui.entry; if (!log || !en) return;
  const p = findPair(log, en.slot); const box = $('#en-loader');
  if (box && p.e.meta.eq === 'barre') box.innerHTML = en.kg > 0 ? plateLoader(en.kg, p.e.meta.bar || 20, false) : '';
}

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
  if (k === 'enkg') { ui.entry.kg = parseFloat(el.value.replace(',', '.')); refreshLoader(); }
  if (k === 'enreps') { ui.entry.reps = parseInt(el.value, 10); }
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
document.addEventListener('focusin', (ev) => { if (ev.target.matches('.entry input')) setTimeout(() => ev.target.select(), 30); });
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { if (ui.sid) { keepAwake(true); renderSession(); } else render(); renderRest(); }
});

// ---------- Démarrage ----------
$('.tabbar').innerHTML = [['coach', 'Coach', I.coach], ['programme', 'Programme', I.prog], ['progres', 'Progrès', I.stats], ['corps', 'Corps', I.body]]
  .map(([t, l, ic]) => `<button data-act="tab" data-tab="${t}">${ic}<span>${l}</span></button>`).join('');
render();
renderRest();
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('./sw.js').catch(() => {});
window.__muscu = { S, P, ui };
