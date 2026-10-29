// Données de l'app : tout reste sur le téléphone (localStorage), avec sauvegarde manuelle en fichier.
import { buildSession, TOTAL_WEEKS, weekInfo, EX } from './program.js';

const KEY = 'muscu3.state';

const DEFAULTS = () => ({
  v: 3,
  settings: {
    name: 'Alan',
    start: '2026-11-02',
    weight0: 66,
    kcal: 2750,
    protein: 130,
    gainMin: 0.2,
    gainMax: 0.5,
    sound: true,
  },
  sessions: {}, // id -> log
  skipped: {}, // id -> true
  swaps: {}, // "bloc|type|slot" -> exercice
  weights: {}, // "YYYY-MM-DD" -> kg
  habits: {}, // "YYYY-MM-DD" -> { meals, protein, creatine }
  measures: [], // { date, weight, arm, waist, shoulders, thigh, note }
  active: null, // id de la séance en cours
  rest: null, // { endAt, total, label }
  lastBackup: null,
  createdAt: new Date().toISOString(),
});

export let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS();
    const s = JSON.parse(raw);
    const d = DEFAULTS();
    return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) } };
  } catch (e) {
    return DEFAULTS();
  }
}

let saveTimer = null;
export function save(now = false) {
  clearTimeout(saveTimer);
  const write = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('save failed', e); }
  };
  if (now) write(); else saveTimer = setTimeout(write, 150);
}
window.addEventListener('pagehide', () => save(true));
document.addEventListener('visibilitychange', () => { if (document.hidden) save(true); });

export function replaceState(next) {
  const d = DEFAULTS();
  state = { ...d, ...next, settings: { ...d.settings, ...(next.settings || {}) } };
  save(true);
}

export function resetAll() {
  state = DEFAULTS();
  save(true);
}

// ---------- Dates ----------
export const todayISO = () => toISO(new Date());
export function toISO(d) {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
}
export function parseISO(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
export function addDays(iso, n) { const d = parseISO(iso); d.setDate(d.getDate() + n); return toISO(d); }
export function weekDates(week) {
  const from = addDays(state.settings.start, 7 * (week - 1));
  return { from, to: addDays(from, 6) };
}
export function calendarWeek(iso = todayISO()) {
  const diff = Math.floor((parseISO(iso) - parseISO(state.settings.start)) / 86400000);
  return Math.floor(diff / 7) + 1;
}

// ---------- Séances ----------
export function sessionId(week, type) { return `w${week}${type}`; }
export function getLog(id) { return state.sessions[id] || null; }
export function isDone(id) { const l = state.sessions[id]; return !!(l && l.done); }
export function isSkipped(id) { return !!state.skipped[id]; }
export function isClosed(id) { return isDone(id) || isSkipped(id); }

export function template(week, type) { return buildSession(week, type, state.swaps); }

// Semaine en cours = première semaine qui n'est pas terminée (séances faites ou passées)
export function currentWeek() {
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    if (!['A', 'B', 'C'].every((t) => isClosed(sessionId(w, t)))) return w;
  }
  return TOTAL_WEEKS;
}
export function nextSession() {
  if (state.active && state.sessions[state.active] && !state.sessions[state.active].done) {
    const l = state.sessions[state.active];
    return { week: l.week, type: l.type, inProgress: true };
  }
  const w = currentWeek();
  const t = ['A', 'B', 'C'].find((x) => !isClosed(sessionId(w, x))) || 'A';
  return { week: w, type: t, inProgress: false };
}

export function startSession(week, type) {
  const id = sessionId(week, type);
  const tpl = template(week, type);
  let log = state.sessions[id];
  if (!log) {
    log = {
      id, week, type, date: todayISO(), startedAt: Date.now(), endedAt: null, done: false,
      ex: tpl.exercises.map((e) => newExerciseLog(e, id)),
    };
    state.sessions[id] = log;
  } else {
    // Synchronise avec le modèle (remplacements, nombre de séries)
    tpl.exercises.forEach((e) => {
      let x = log.ex.find((l) => l.slot === e.slot);
      if (!x) { log.ex.push(newExerciseLog(e, id)); return; }
      if (x.name !== e.name && !x.sets.some((s) => s.done)) {
        Object.assign(x, newExerciseLog(e, id));
      }
      while (x.sets.length < e.sets) x.sets.push(blankSet(x.sets[x.sets.length - 1]));
    });
  }
  delete state.skipped[id];
  if (!log.done) state.active = id;
  save();
  return log;
}

function blankSet(prev) { return { kg: prev ? prev.kg : null, reps: prev ? prev.reps : null, done: false }; }

function newExerciseLog(e, sessionIdNow) {
  const sug = suggestion(e, sessionIdNow);
  const sets = [];
  for (let i = 0; i < e.sets; i++) sets.push({ kg: sug.kg, reps: sug.reps, done: false });
  return { slot: e.slot, name: e.name, lo: e.lo, hi: e.hi, sets, rir: null, note: '' };
}

export function finishSession(id) {
  const log = state.sessions[id];
  if (!log) return null;
  log.done = true;
  log.endedAt = log.endedAt || Date.now();
  log.date = log.date || todayISO();
  if (state.active === id) state.active = null;
  state.rest = null;
  save(true);
  return log;
}
export function discardSession(id) {
  delete state.sessions[id];
  if (state.active === id) state.active = null;
  state.rest = null;
  save(true);
}
export function skipSession(id) { state.skipped[id] = true; if (state.active === id) state.active = null; save(); }
export function unskipSession(id) { delete state.skipped[id]; save(); }

// ---------- Historique d'un exercice ----------
const ord = (id) => { const m = id.match(/^w(\d+)([ABC])$/); return +m[1] * 3 + 'ABC'.indexOf(m[2]); };

export function exerciseHistory(name, beforeId = null) {
  const out = [];
  Object.values(state.sessions).forEach((log) => {
    if (beforeId && ord(log.id) >= ord(beforeId)) return;
    log.ex.forEach((x) => {
      if (x.name !== name) return;
      const done = x.sets.filter((s) => s.done && s.reps > 0);
      if (!done.length) return;
      out.push({ id: log.id, week: log.week, date: log.date, sets: done, lo: x.lo, hi: x.hi, rir: x.rir,
        best: bestE1RM(done), tonnage: done.reduce((a, s) => a + (s.kg || 0) * s.reps, 0) });
    });
  });
  return out.sort((a, b) => ord(a.id) - ord(b.id));
}

export const e1rm = (kg, reps) => (kg || 0) * (1 + reps / 30);
export function bestE1RM(sets) { return sets.reduce((m, s) => Math.max(m, e1rm(s.kg, s.reps)), 0); }

export function roundTo(x, step) { if (!step) return Math.round(x * 2) / 2; return Math.round(x / step) * step; }

// Charge conseillée pour la prochaine séance (double progression)
export function suggestion(e, currentId) {
  const hist = exerciseHistory(e.name, currentId);
  const info = weekInfo(+currentId.match(/^w(\d+)/)[1]);
  const step = e.meta.inc ?? 2.5;
  if (!hist.length) {
    const m = (e.note || '').match(/Départ (\d+(?:[.,]\d+)?) kg/);
    return { kg: m ? parseFloat(m[1].replace(',', '.')) : (e.meta.eq === 'pdc' ? 0 : null), reps: e.lo, why: m ? 'Charge de départ du programme' : 'Trouve une charge qui tombe dans la fourchette', fresh: true };
  }
  const last = hist[hist.length - 1];
  const work = last.sets;
  const kg = Math.max(...work.map((s) => s.kg || 0));
  const topSets = work.filter((s) => (s.kg || 0) === kg);
  const allTop = topSets.length >= Math.min(work.length, e.sets) && topSets.every((s) => s.reps >= last.hi);
  let out;
  if (info.deload) {
    out = { kg: roundTo(kg * 0.9, step), reps: e.lo, why: 'Déload : -10 % sur ta dernière charge' };
  } else if (last.hi && e.hi > last.hi + 1) {
    out = { kg: roundTo(kg * 0.9, step), reps: e.lo, why: 'Fourchette plus haute : -10 % pour repartir' };
  } else if (last.lo && e.lo < last.lo - 1) {
    out = { kg: roundTo(kg * 1.07, step), reps: e.lo, why: 'Fourchette plus basse : on charge plus lourd' };
  } else if (e.meta.eq === 'pdc' && kg === 0 && allTop) {
    // Poids du corps : on monte les reps jusqu'à 8, puis on leste
    const minReps = Math.min(...topSets.map((s) => s.reps));
    out = minReps >= 8 && step && e.meta.m !== 'Abdos'
      ? { kg: step, reps: e.lo, why: `8 reps strictes atteintes : leste de ${String(step).replace('.', ',')} kg`, up: true }
      : { kg: 0, reps: minReps + 1, why: step && e.meta.m !== 'Abdos' ? 'Une rep de plus, on leste à partir de 8' : 'Vise une rep de plus' };
  } else if (allTop && step) {
    out = { kg: roundTo(kg + step, step), reps: e.lo, why: `Haut de fourchette atteint : +${String(step).replace('.', ',')} kg`, up: true };
  } else {
    const minReps = Math.min(...topSets.map((s) => s.reps));
    out = { kg, reps: Math.min(e.hi, Math.max(e.lo, minReps + 1)), why: 'Même charge : vise une rep de plus' };
  }
  out.last = last;
  return out;
}

// ---------- Poids ----------
export function weightEntries() {
  return Object.entries(state.weights).sort(([a], [b]) => a.localeCompare(b)).map(([date, kg]) => ({ date, kg }));
}
export function lastWeight() { const e = weightEntries(); return e.length ? e[e.length - 1] : null; }
export function weeklyAverages() {
  const map = {};
  weightEntries().forEach(({ date, kg }) => {
    const w = calendarWeek(date);
    (map[w] = map[w] || []).push(kg);
  });
  return Object.entries(map).map(([w, arr]) => ({ week: +w, avg: arr.reduce((a, b) => a + b, 0) / arr.length, n: arr.length }))
    .sort((a, b) => a.week - b.week);
}
export function weightAdvice() {
  const wa = weeklyAverages().filter((x) => x.n >= 3);
  if (wa.length < 2) return null;
  const a = wa[wa.length - 1]; const b = wa[wa.length - 2];
  const delta = (a.avg - b.avg) / Math.max(1, a.week - b.week);
  const s = state.settings;
  let verdict = 'keep';
  if (delta < s.gainMin) verdict = 'up';
  else if (delta > s.gainMax) verdict = 'down';
  return { delta, verdict, avg: a.avg };
}

// ---------- Statistiques ----------
export function sessionTonnage(log) {
  return log.ex.reduce((a, x) => a + x.sets.filter((s) => s.done).reduce((b, s) => b + (s.kg || 0) * (s.reps || 0), 0), 0);
}
export function doneSessions() {
  return Object.values(state.sessions).filter((l) => l.done).sort((a, b) => ord(a.id) - ord(b.id));
}
export function streakWeeks() {
  // Semaines consécutives (jusqu'à la semaine en cours) avec 3 séances faites
  let n = 0;
  for (let w = currentWeek() - 1; w >= 1; w--) {
    if (['A', 'B', 'C'].every((t) => isDone(sessionId(w, t)))) n++; else break;
  }
  return n;
}
export function records(log) {
  const out = [];
  log.ex.forEach((x) => {
    const done = x.sets.filter((s) => s.done && s.reps > 0 && s.kg > 0);
    if (!done.length) return;
    const prev = exerciseHistory(x.name, log.id);
    if (!prev.length) return;
    const best = bestE1RM(done);
    const prevBest = Math.max(...prev.map((h) => h.best));
    if (best > prevBest + 0.01) {
      const top = done.reduce((m, s) => (e1rm(s.kg, s.reps) > e1rm(m.kg, m.reps) ? s : m), done[0]);
      out.push({ name: x.name, kg: top.kg, reps: top.reps, gain: best - prevBest });
    }
  });
  return out;
}
export function muscleOf(name) { return (EX[name] || {}).m || 'Autre'; }
