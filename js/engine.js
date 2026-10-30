/* ==========================================================
   ENGINE: helpers, C# highlighter, code animator, game store,
   text-to-speech, confetti, toasts
   ========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const h = (tag, attrs = {}, html = '') => {
  const el = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') el.className = attrs[k];
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), attrs[k]);
    else el.setAttribute(k, attrs[k]);
  }
  if (html) el.innerHTML = html;
  return el;
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clone = o => JSON.parse(JSON.stringify(o));
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------------- C# syntax highlighter ---------------- */
const CS = (() => {
  const KW = new Set('public private protected static void return if else for foreach in while new class using int float bool string var ref out params delegate event null true false this base switch case break default yield get set readonly const override virtual abstract interface struct enum namespace is as continue do try catch finally'.split(' '));
  const TY = new Set('MonoBehaviour GameObject Transform Vector3 Quaternion Rigidbody Collider Collision Animator AudioSource AudioClip Debug Mathf Random Time Action Func List Dictionary IEnumerator WaitForSeconds Physics RaycastHit Color Image SceneManager PlayerHealth GameEvents ScoreManager GameUI EnemyDeath UIManager System Input KeyCode Button TextMeshProUGUI AsyncOperation EventArgs Coroutine DamageAction CalculateFunc ConditionCheck PlayerPrefs EnemyHealth DamageModifier TimerSystem'.split(' '));
  const RE = /(\/\/.*$)|(\$?"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?f?\b)|([A-Za-z_][A-Za-z0-9_]*)(\s*(?=\())?|(=>|\+=|-=|\?\.|[{}()\[\];,.<>=!+\-*\/%&|?:])/gm;
  function line(src) {
    let out = '', last = 0, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(src))) {
      out += esc(src.slice(last, m.index));
      const t = m[0];
      if (m[1]) out += `<span class="cm">${esc(t)}</span>`;
      else if (m[2]) out += `<span class="st">${esc(t)}</span>`;
      else if (m[3]) out += `<span class="nu">${t}</span>`;
      else if (m[4]) {
        const w = m[4];
        if (KW.has(w)) out += `<span class="kw">${w}</span>`;
        else if (TY.has(w)) out += `<span class="ty">${w}</span>`;
        else if (m[5] !== undefined) out += `<span class="fn">${w}</span>`;
        else out += w;
        if (m[5]) out += m[5];
      } else if (m[6]) out += `<span class="op">${esc(t)}</span>`;
      else out += esc(t);
      last = m.index + t.length;
      if (t.length === 0) RE.lastIndex++;
    }
    return out + esc(src.slice(last));
  }
  const block = src => src.replace(/^\n/, '').replace(/\s+$/, '').split('\n').map(line).join('\n');
  return { line, block };
})();

/* ---------------- Code Animator ---------------- */
function deepMerge(target, patch) {
  for (const k in patch) {
    const v = patch[k];
    if (v === null) delete target[k];
    else if (typeof v === 'object' && !Array.isArray(v) && !(v && v.ref !== undefined)) {
      if (typeof target[k] !== 'object' || target[k] === null || Array.isArray(target[k])) target[k] = {};
      deepMerge(target[k], v);
    } else target[k] = clone(v);
  }
  return target;
}

class CodeAnim {
  constructor(mount, def, opts = {}) {
    this.def = def; this.opts = opts; this.i = -1; this.timer = null;
    this.lines = def.code.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
    // a step's line can be a number or a unique substring of that line
    def.steps.forEach(s => {
      if (typeof s.l === 'string') {
        const k = this.lines.findIndex(x => x.includes(s.l));
        if (k < 0) console.warn('Anim line not found:', def.id, s.l);
        s.l = k + 1;
      }
    });
    // precompute snapshots
    this.snaps = [];
    let st = { frames: {}, logs: [] };
    def.steps.forEach(s => {
      st = clone(st);
      if (s.set) deepMerge(st, s.set);
      if (s.log) (Array.isArray(s.log) ? s.log : [s.log]).forEach(l => st.logs.push(typeof l === 'string' ? { t: l } : l));
      this.snaps.push(st);
    });
    this.build(mount);
    this.go(-1);
  }
  build(mount) {
    const d = this.def;
    const el = h('div', { class: 'anim' });
    el.innerHTML = `
      <div class="anim-head"><div class="dots"><i></i><i></i><i></i></div>
        <div class="ttl">🎬 ${esc(d.title)} <small>${esc(d.file || 'Script.cs')}</small></div>
        <span class="muted" style="font-size:12px">Line-by-line chalake dekho 👇</span></div>
      <div class="anim-body">
        <div class="anim-code">${this.lines.map(l => `<span class="ln">${CS.line(l) || ' '}</span>`).join('')}</div>
        <div class="anim-side">
          <div class="anim-note"></div>
          <div class="widgets"></div>
          <div><div class="lbl-sm">🧠 Memory (variables)</div><div class="frames"></div></div>
          <div><div class="lbl-sm">🖥️ Console</div><div class="console"></div></div>
        </div>
      </div>
      <div class="anim-ctrl">
        <button class="icon-btn" data-a="reset" title="Reset">⏮</button>
        <button class="icon-btn" data-a="back" title="Peeche">◀</button>
        <button class="icon-btn play" data-a="play" title="Play / Pause">▶</button>
        <button class="icon-btn" data-a="next" title="Aage">▶▏</button>
        <div class="prog"><i></i></div>
        <span class="cnt"></span>
        <label>Speed <select class="spd"><option value="2200">🐢 Slow</option><option value="1400" selected>🚶 Normal</option><option value="700">🚀 Fast</option></select></label>
      </div>`;
    mount.appendChild(el);
    this.el = el;
    this.lnEls = $$('.ln', el);
    this.note = $('.anim-note', el);
    this.wEl = $('.widgets', el);
    this.fEl = $('.frames', el);
    this.cEl = $('.console', el);
    this.playBtn = $('[data-a=play]', el);
    el.addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const act = a.dataset.a;
      if (act === 'next') { this.stop(); this.go(this.i + 1); }
      if (act === 'back') { this.stop(); this.go(this.i - 1); }
      if (act === 'reset') { this.stop(); this.go(-1); }
      if (act === 'play') this.timer ? this.stop() : this.play();
    });
    this.spd = $('.spd', el);
    this.spd.style.cssText = 'background:#1a1f35;color:#e8eaf6;border:1px solid #262c48;border-radius:8px;padding:4px';
  }
  play() {
    if (this.i >= this.snaps.length - 1) this.go(-1);
    this.playBtn.textContent = '⏸';
    const tick = () => {
      if (this.i >= this.snaps.length - 1) return this.stop();
      this.go(this.i + 1);
      this.timer = setTimeout(tick, +this.spd.value);
    };
    this.timer = setTimeout(tick, 250);
    Game.touch('anim');
  }
  stop() { clearTimeout(this.timer); this.timer = null; this.playBtn.textContent = '▶'; }
  go(i) {
    i = Math.max(-1, Math.min(this.snaps.length - 1, i));
    const prev = this.i >= 0 ? this.snaps[this.i] : { frames: {}, logs: [] };
    this.i = i;
    const step = i >= 0 ? this.def.steps[i] : null;
    const st = i >= 0 ? this.snaps[i] : { frames: {}, logs: [] };
    // code highlight
    this.lnEls.forEach((l, k) => { l.classList.toggle('cur', step && k === step.l - 1); l.classList.remove('past'); });
    if (i >= 0) this.def.steps.slice(0, i).forEach(s => this.lnEls[s.l - 1] && this.lnEls[s.l - 1].classList.add('past'));
    if (step && this.lnEls[step.l - 1]) {
      const box = this.lnEls[step.l - 1].parentElement, ln = this.lnEls[step.l - 1];
      if (box.scrollHeight > box.clientHeight) box.scrollTo({ top: ln.offsetTop - box.clientHeight / 2, behavior: 'smooth' });
    }
    // note
    this.note.innerHTML = step ? `<div class="who">Line ${step.l} pe kya hua?</div>${step.note}` :
      `<div class="who">Ready?</div>${this.def.intro || '▶ Play dabao ya ▶▏ se ek-ek line chalao. Dekhna har line pe memory aur console mein kya badalta hai!'}`;
    this.note.classList.remove('flash'); void this.note.offsetWidth; this.note.classList.add('flash');
    this.renderWidgets(st, prev, step);
    this.renderFrames(st, prev, step);
    this.renderConsole(st, prev);
    $('.prog i', this.el).style.width = ((i + 1) / this.snaps.length * 100) + '%';
    $('.cnt', this.el).textContent = `${i + 1}/${this.snaps.length}`;
    if (i === this.snaps.length - 1) Game.animDone(this.def.id);
  }
  renderFrames(st, prev, step) {
    const names = Object.keys(st.frames);
    if (!names.length) { this.fEl.innerHTML = '<div class="console"><span class="empty">Abhi memory khaali hai…</span></div>'; return; }
    const active = (step && step.f) || names[names.length - 1];
    const linked = new Set();
    names.forEach(fn => Object.values(st.frames[fn]).forEach(v => { if (v && v.ref) linked.add(v.ref); }));
    this.fEl.innerHTML = names.map(fn => {
      const vars = st.frames[fn], pv = prev.frames[fn] || null;
      return `<div class="frame ${fn === active ? 'active' : ''}" style="${pv ? 'animation:none' : ''}">
        <div class="frame-name">📦 ${esc(fn)}</div><div class="vars">${Object.keys(vars).map(k => {
          const v = vars[k]; const parts = k.split(' '); const nm = parts.pop(); const ty = parts.join(' ');
          const was = pv && k in pv; const changed = was && JSON.stringify(pv[k]) !== JSON.stringify(v);
          const isRef = v && v.ref;
          const cls = ['var', was ? '' : 'new', changed ? 'changed' : '', isRef ? 'ref' : '', linked.has(nm) && !isRef ? 'linked' : ''].join(' ');
          const shown = isRef ? `🔗 → ${esc(v.ref)}` : esc(fmt(v));
          return `<div class="${cls}"><div class="n"><span>${esc(nm)}</span><em>${esc(ty)}</em></div><div class="v">${shown}</div></div>`;
        }).join('') || '<span class="muted" style="font-size:12px">(koi variable nahi)</span>'}</div></div>`;
    }).join('');
  }
  renderConsole(st, prev) {
    if (!st.logs.length) { this.cEl.innerHTML = '<span class="empty">// Debug.Log ka output yahan aayega</span>'; return; }
    this.cEl.innerHTML = st.logs.map((l, k) => `<div class="l ${l.c || ''} ${k >= prev.logs.length ? 'new' : ''}">${esc(l.t)}</div>`).join('');
    this.cEl.scrollTop = this.cEl.scrollHeight;
  }
  renderWidgets(st, prev, step) {
    let html = '';
    if (st.cube) {
      // persistent cube for smooth movement
      if (!this.cubeEl) {
        this.wEl.innerHTML = '';
        this.cubeWrap = h('div', { class: 'w-cube' }, `<div class="cube">${st.cube.label || ''}</div><div class="axis">x →  /  y ↑</div><div class="pos"></div>`);
        this.cubeEl = $('.cube', this.cubeWrap);
      }
    } else if (this.cubeEl) { this.cubeEl = null; this.cubeWrap = null; }
    if (st.loop) {
      const L = st.loop;
      html += `<div class="w-loop"><div class="items">${L.items.map((it, k) => `<div class="it ${k === L.cur ? 'cur' : ''} ${k < L.cur ? 'done' : ''}">${esc(it)}</div>`).join('')}</div>
        <div class="counter">${esc(L.label || '')}</div></div>`;
    }
    if (st.branch) {
      const B = st.branch;
      html += `<div class="w-branch"><div class="cond">${esc(B.cond)}</div><div class="paths">${B.paths.map((p, k) =>
        `<div class="path ${(B.checked || []).includes(k) ? 'checked' : ''} ${B.taken === k ? 'taken' : ''}">${esc(p)}</div>`).join('')}</div></div>`;
    }
    if (st.chips) {
      const C = st.chips;
      html += `<div class="w-chips"><span class="dname">${esc(C.name)} =</span>${C.list.length ? C.list.map(c => `<span class="c ${C.run === c ? 'run' : ''}">${esc(c)}</span>`).join('<span class="muted">+</span>') : '<span class="muted">null</span>'}</div>`;
    }
    if (st.bars) {
      const B = st.bars, mx = Math.max(...B.vals, 1);
      html += `<div class="w-bars">${B.vals.map((v, k) => `<div class="b ${(B.hl || []).includes(k) ? 'hl' : ''} ${(B.out || []).includes(k) ? 'out' : ''}" style="height:${v / mx * 85}%"><span>${v}</span></div>`).join('')}</div>`;
    }
    if (st.flow) {
      const F = st.flow;
      html += `<div class="w-flow">${F.nodes.map((n, k) => (k ? `<div class="arrow ${(F.on || []).includes(k) ? 'on' : ''}">▼</div>` : '') +
        `<div class="node ${(F.on || []).includes(k) ? 'on' : ''} ${(F.off || []).includes(k) ? 'off' : ''}"><span class="e">${n.e}</span>${esc(n.t)}</div>`).join('')}</div>`;
    }
    if (this.cubeWrap) {
      this.wEl.innerHTML = html;
      this.wEl.prepend(this.cubeWrap);
      const c = st.cube, W = this.cubeWrap;
      requestAnimationFrame(() => {
        const w = W.clientWidth || 300, hgt = W.clientHeight || 140;
        // world: x in [-2,12], y in [-1,5]
        this.cubeEl.style.left = (12 + (c.x + 2) / 14 * (w - 50)) + 'px';
        this.cubeEl.style.top = (hgt - 46 - (c.y + 1) / 6 * (hgt - 56)) + 'px';
        if (c.color) this.cubeEl.style.background = c.color;
        $('.pos', W).textContent = `position = (${c.x}, ${c.y}, ${c.z ?? 0})`;
      });
    } else this.wEl.innerHTML = html;
    this.wEl.style.display = this.wEl.innerHTML ? '' : 'none';
  }
}
function fmt(v) {
  if (typeof v === 'string') return v.startsWith('~') ? v.slice(1) : `"${v}"`;
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (v === undefined) return '?';
  return String(v);
}

/* ---------------- Toasts / XP float / Confetti ---------------- */
function toast(msg, cls = '') {
  const t = h('div', { class: 'toast ' + cls }, msg);
  $('#toasts').appendChild(t);
  setTimeout(() => t.remove(), 3200);
}
function xpFloat(n, x, y) {
  const f = h('div', { class: 'xp-float' }, `+${n} XP`);
  f.style.left = (x ?? innerWidth - 160) + 'px'; f.style.top = (y ?? 70) + 'px';
  document.body.appendChild(f); setTimeout(() => f.remove(), 1300);
}
const Confetti = (() => {
  let cv, ctx, parts = [], raf;
  function burst(n = 160) {
    cv = cv || $('#confetti'); ctx = ctx || cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const cols = ['#7c5cff', '#00d4ff', '#ff4fa3', '#ffd23f', '#2ee59d', '#ff8a3d'];
    for (let i = 0; i < n; i++) parts.push({
      x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .45,
      vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4, s: 5 + Math.random() * 7,
      c: cols[i % cols.length], r: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 0
    });
    if (!raf) loop();
  }
  function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => { p.vy += .42; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
    parts = parts.filter(p => p.y < cv.height + 40 && p.life < 400);
    raf = parts.length ? requestAnimationFrame(loop) : (ctx.clearRect(0, 0, cv.width, cv.height), null);
  }
  return { burst };
})();
const Sfx = (() => {
  let ac;
  function tone(freqs, dur = .12, type = 'triangle', vol = .07) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f;
        const t = ac.currentTime + i * dur; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur * 1.8);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur * 2);
      });
    } catch (e) { /* audio not available */ }
  }
  return { ok: () => tone([660, 880]), bad: () => tone([220, 160], .14, 'sawtooth', .04), win: () => tone([523, 659, 784, 1046], .11), pop: () => tone([520], .06, 'square', .03) };
})();

/* ---------------- Game store (XP, levels, badges, streak) ---------------- */
const LEVELS = [
  [0, 'Noob Gamer 🐣'], [100, 'Script Kiddie 👶'], [250, 'Code Cadet 🧑‍🚀'], [450, 'Function Fighter 🥊'],
  [700, 'Parameter Pro 🎯'], [1000, 'Lambda Legend ⚡'], [1400, 'Delegate Ninja 🥷'], [1900, 'Event Master 📡'], [2500, 'Unity C# Hero 👑']
];
const BADGES = {
  first: ['🚀', 'Pehla Kadam', 'Pehla section padh liya'],
  editor: ['🧭', 'Editor Explorer', 'Unity Editor ka tour complete'],
  director: ['🎬', 'Code Director', 'Ek code animation end tak dekha'],
  tts: ['🎧', 'Kaan Khiladi', '"Sun ke samjho" use kiya'],
  quiz100: ['🧠', 'Quiz Champ', 'Kisi quiz mein 100% score'],
  tinker: ['🧪', 'Experimenter', '15 baar demos se khele'],
  streak3: ['🔥', '3 Din Streak', 'Lagatar 3 din padhai'],
  half: ['🏅', 'Aadha Safar', 'Aadhe topics complete'],
  gamer: ['🎮', 'Event Gamer', 'Mini game mein 1000+ score'],
  hero: ['👑', 'Unity C# Hero', 'Poora course complete!']
};
const Game = (() => {
  const KEY = 'unityCsAcademy.v1';
  let S = { xp: 0, seen: {}, quiz: {}, done: {}, badges: {}, anims: {}, demos: {}, streak: { n: 0, last: '' }, last: null, tinker: 0 };
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) { /* storage off */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  const listeners = [];
  const emit = () => listeners.forEach(f => f(S));

  function today(off = 0) { const d = new Date(Date.now() + off * 864e5); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function checkStreak() {
    const t = today();
    if (S.streak.last === t) return;
    S.streak.n = S.streak.last === today(-1) ? S.streak.n + 1 : 1;
    S.streak.last = t; save();
    if (S.streak.n > 1) setTimeout(() => toast(`🔥 ${S.streak.n} din ki streak! Kya baat hai bro!`), 1200);
    if (S.streak.n >= 3) badge('streak3');
  }
  function level(xp = S.xp) {
    let i = 0; LEVELS.forEach((l, k) => { if (xp >= l[0]) i = k; });
    const next = LEVELS[i + 1];
    return { n: i + 1, name: LEVELS[i][1], cur: LEVELS[i][0], next: next ? next[0] : null };
  }
  function addXp(n, ev) {
    const before = level().n;
    S.xp += n; save();
    xpFloat(n, ev && ev.clientX, ev && ev.clientY);
    const after = level();
    if (after.n > before) setTimeout(() => { toast(`🆙 LEVEL UP! Ab tum ho: ${after.name}`, 'badge'); Confetti.burst(90); Sfx.win(); }, 500);
    emit();
  }
  function badge(id) {
    if (S.badges[id]) return;
    S.badges[id] = Date.now(); save();
    const b = BADGES[id];
    setTimeout(() => { toast(`${b[0]} Naya badge: <b>${b[1]}</b>`, 'badge'); Sfx.win(); }, 300);
    emit();
  }
  return {
    get S() { return S; }, save, level, badge, addXp, checkStreak,
    on: f => listeners.push(f), emit,
    seen(key) {
      if (S.seen[key]) return false;
      S.seen[key] = 1; addXp(10); badge('first'); return true;
    },
    animDone(id) { if (!id || S.anims[id]) return; S.anims[id] = 1; addXp(15); badge('director'); },
    touch(kind) {
      S.tinker = (S.tinker || 0) + 1; save();
      if (S.tinker >= 15) badge('tinker');
    },
    demo(id, ev) {
      Game.touch();
      if (S.demos[id]) return; S.demos[id] = 1; addXp(10, ev);
    },
    setLast(t, s) { S.last = { t, s }; save(); },
    reset() { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } location.hash = ''; location.reload(); }
  };
})();

/* ---------------- Text to Speech ---------------- */
const Speaker = (() => {
  const ok = 'speechSynthesis' in window;
  let voice = null, queue = [], btn = null, active = false;
  function pickVoice() {
    if (!ok) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find(v => /en[-_]IN/i.test(v.lang)) || vs.find(v => /hi[-_]IN/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || vs[0] || null;
  }
  if (ok) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  const clean = t => t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, ' ')
    .replace(/=>/g, ' arrow ').replace(/\+=/g, ' plus equals ').replace(/-=/g, ' minus equals ').replace(/\?\./g, ' question dot ')
    .replace(/[<>{}\[\]`*_#|]/g, ' ').replace(/\s+/g, ' ').trim();
  function chunks(t) {
    const out = []; let cur = '';
    t.split(/(?<=[.!?।])\s+/).forEach(s => {
      if ((cur + ' ' + s).length > 200 && cur) { out.push(cur); cur = s; } else cur = cur ? cur + ' ' + s : s;
    });
    if (cur) out.push(cur);
    return out;
  }
  function stop() {
    active = false; queue = [];
    if (ok) speechSynthesis.cancel();
    $$('.reading').forEach(e => e.classList.remove('reading'));
    if (btn) { btn.classList.remove('speaking'); btn.innerHTML = '🔊 Sun ke samjho'; }
  }
  function next() {
    if (!active) return;
    const item = queue.shift();
    $$('.reading').forEach(e => e.classList.remove('reading'));
    if (!item) return stop();
    item.el.classList.add('reading');
    item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const parts = chunks(item.text);
    const speakPart = () => {
      if (!active) return;
      const p = parts.shift(); if (!p) return next();
      const u = new SpeechSynthesisUtterance(p);
      if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-IN';
      u.rate = .95; u.pitch = 1.02;
      u.onend = speakPart; u.onerror = speakPart;
      speechSynthesis.speak(u);
    };
    speakPart();
  }
  function read(elements, button) {
    if (!ok) { toast('😕 Is browser mein text-to-speech support nahi hai. Chrome/Edge try karo.'); return; }
    if (active && btn === button) return stop();
    stop();
    btn = button; active = true;
    queue = elements.map(el => ({ el, text: clean(el.innerText || el.textContent) })).filter(q => q.text.length > 1);
    button.classList.add('speaking'); button.innerHTML = '⏹ Rukko';
    Game.badge('tts');
    next();
  }
  return { read, stop, ok };
})();
