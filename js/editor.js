/* ==========================================================
   UNITY EDITOR MOCKUP — dark theme, panels, guided tours with
   animated arrows + highlights, Play mode with mini physics
   ========================================================== */
const PANEL_INFO = {
  hier: ['Hierarchy', 'Bro, ye tumhare scene ki <b>list</b> hai. Scene mein jitne bhi GameObjects hain (Player, Camera, Light, Ground…) sab yahan dikhte hain. Kisi pe click karo toh woh select ho jaata hai.'],
  scene: ['Scene view', 'Ye tumhara <b>workshop</b> hai. Yahan objects ko move/rotate/scale karke level design karte ho. Game chalne se pehle sab kuch yahin set hota hai.'],
  game: ['Game view', 'Ye woh hai jo <b>player ko dikhega</b> — camera ki aankh se. Play dabate hi game yahan chalta hai.'],
  insp: ['Inspector', 'Jo object select hai uski <b>saari settings</b> yahan: Transform (position), Rigidbody (physics), aur tumhari scripts. Script ke public variables bhi yahin dikhte hain!'],
  proj: ['Project window', 'Ye tumhara <b>godown</b> hai — saari files: scripts (.cs), images, sounds, prefabs. Right-click → Create → C# Script se nayi script banti hai.'],
  console: ['Console', '<b>Debug.Log()</b> ka output yahan aata hai. Errors (laal) aur warnings (peeli) bhi yahin dikhte hain. Debugging ka best friend!'],
  play: ['Play button', 'Ise dabao toh game <b>chalna shuru</b>. Start() ek baar chalta hai, phir Update() har frame. Dobara dabao toh game band.'],
  tools: ['Tools', 'Hand, Move, Rotate, Scale tools. Scene view mein objects ko pakadne ke liye.']
};

class UnityEditor {
  constructor(mount, cfg) {
    this.cfg = cfg;
    this.s = {
      sel: cfg.select || null, bottom: 'proj', view: 'scene', playing: false, frame: 0, logs: [],
      assets: clone(cfg.assets || []), comps: clone(cfg.comps || {}), hier: clone(cfg.hier),
      phys: { y: 6, vy: 0, grav: true, mass: 1, drag: 0, bounce: .35 }, hp: 100, refSet: !!cfg.refSet
    };
    this.tourI = -1;
    this.el = h('div', { class: 'ue' });
    mount.appendChild(this.el);
    this.build();
    if (cfg.controls) this.buildControls(mount);
    new ResizeObserver(() => { if (this.tourI >= 0) this.placeTour(); this.drawScene(); }).observe(this.el);
  }
  build() {
    this.el.innerHTML = `
      <div class="ue-menu"><span class="u">◆ Unity</span><span>File</span><span>Edit</span><span>Assets</span><span>GameObject</span><span>Component</span><span>Window</span><span>Help</span></div>
      <div class="ue-tool">
        <div class="tools" data-k="tools"><span>✋</span><span class="on">✥</span><span>⟳</span><span>⤢</span><span>▣</span></div>
        <div class="ue-play" data-k="play"><button data-a="play" title="Play">▶</button><button title="Pause">❚❚</button><button title="Step">▶❚</button></div>
        <div class="fps">Edit mode</div>
      </div>
      <div class="ue-grid">
        <div class="ue-p ue-hier" data-k="hier"><div class="ue-tabs"><span class="on" data-info="hier">≡ Hierarchy</span></div><div class="ue-body hier-body"></div></div>
        <div class="ue-p ue-view" data-k="view"><div class="ue-tabs"><span data-tab="scene" data-k="scene-tab">＃ Scene</span><span data-tab="game" data-k="game-tab">🎮 Game</span></div>
          <div class="ue-scene" data-k="scene"><div class="gridlines"></div><div class="ue-gizmo"><i class="x"></i><i class="y"></i><i class="z"></i></div><div class="objs"></div></div></div>
        <div class="ue-p ue-insp" data-k="insp"><div class="ue-tabs"><span class="on" data-info="insp">ⓘ Inspector</span></div><div class="ue-body insp-body"></div></div>
        <div class="ue-p ue-proj" data-k="bottom"><div class="ue-tabs"><span data-btab="proj" data-k="proj-tab">📁 Project</span><span data-btab="console" data-k="console-tab">🖥 Console</span></div><div class="ue-body bot-body"></div></div>
      </div>`;
    this.el.addEventListener('click', e => this.onClick(e));
    this.renderAll();
    if (this.cfg.tour) {
      const b = h('button', { class: 'btn primary small ue-start' }, '🧭 Guided tour shuru karo');
      b.onclick = () => this.startTour();
      this.el.appendChild(b); this.startBtn = b;
    }
  }
  buildControls(mount) {
    const p = this.s.phys;
    const c = h('div', { class: 'demo', style: 'margin-top:-6px' });
    c.innerHTML = `<div class="demo-title">🎛️ Rigidbody ke saath khelo <span class="live">LIVE</span></div>
      <div class="demo-grid"><div>
        <div class="ctrl"><label>Start height (Position Y) <b class="vY">${p.y}</b></label><input type="range" min="1" max="9" step="0.5" value="${p.y}" class="rY"></div>
        <div class="ctrl"><label>Mass (kg) <b class="vM">${p.mass}</b></label><input type="range" min="0.1" max="50" step="0.1" value="${p.mass}" class="rM"></div>
        <div class="ctrl"><label>Drag (hawa ki rukawat) <b class="vD">${p.drag}</b></label><input type="range" min="0" max="10" step="0.1" value="${p.drag}" class="rD"></div>
        <div class="ctrl"><label>Bounciness <b class="vB">${p.bounce}</b></label><input type="range" min="0" max="0.95" step="0.05" value="${p.bounce}" class="rB"></div>
        <label class="toggle"><input type="checkbox" class="rG" checked><span class="sw"></span> Use Gravity</label>
      </div><div>
        <div class="callout tip mt0"><span class="ic">🧪</span><div><p><b>Experiment karo:</b> Mass 0.1 vs 50 karke drop karo — dono <b>same speed</b> se girenge! (Unity mein gravity mass pe depend nahi karti, bilkul asli duniya ki tarah 🍎). Ab Drag badhao — ab dheere girega, jaise parachute 🪂.</p></div></div>
        <div class="btn-row"><button class="btn primary small cPlay">▶ Play / ⏹ Stop</button><button class="btn small cDrop">🔁 Dobara girao</button></div>
      </div></div>`;
    mount.appendChild(c);
    const bind = (cls, key, out) => $(cls, c).addEventListener('input', e => {
      p[key] = +e.target.value; $(out, c).textContent = e.target.value;
      if (key === 'y' && !this.s.playing) { this.drawScene(); }
      this.renderInsp(); Game.demo('physics');
    });
    bind('.rY', 'y', '.vY'); bind('.rM', 'mass', '.vM'); bind('.rD', 'drag', '.vD'); bind('.rB', 'bounce', '.vB');
    this.startY = p.y;
    $('.rY', c).addEventListener('input', e => this.startY = +e.target.value);
    $('.rG', c).addEventListener('change', e => { p.grav = e.target.checked; this.renderInsp(); Game.demo('physics'); });
    $('.cPlay', c).onclick = () => this.togglePlay();
    $('.cDrop', c).onclick = () => { if (!this.s.playing) this.togglePlay(); p.y = this.startY; p.vy = 0; };
    this.ctrlEl = c;
  }
  renderAll() { this.renderHier(); this.renderInsp(); this.renderBottom(); this.renderTabs(); this.drawScene(); }
  renderTabs() {
    $$('[data-tab]', this.el).forEach(t => t.classList.toggle('on', t.dataset.tab === this.s.view));
    $$('[data-btab]', this.el).forEach(t => t.classList.toggle('on', t.dataset.btab === this.s.bottom));
    $('.ue-scene', this.el).classList.toggle('game', this.s.view === 'game');
    $('.gridlines', this.el).style.display = this.s.view === 'game' ? 'none' : '';
    $('.ue-gizmo', this.el).style.display = this.s.view === 'game' ? 'none' : '';
  }
  renderHier() {
    $('.hier-body', this.el).innerHTML = `<div class="ue-row" style="font-weight:700">▾ 🎬 ${esc(this.cfg.sceneName || 'SampleScene')}</div>` +
      this.s.hier.map(o => `<div class="ue-row ${this.s.sel === o.n ? 'sel' : ''}" data-row="${esc(o.n)}" data-k="row:${esc(o.n)}" style="padding-left:22px"><span class="ico">${o.i}</span>${esc(o.n)}</div>`).join('');
  }
  renderInsp() {
    const body = $('.insp-body', this.el);
    const comps = this.s.comps[this.s.sel];
    if (!this.s.sel || !comps) { body.innerHTML = '<div style="padding:14px;color:#888">Koi object select nahi hai. Hierarchy mein kisi pe click karo 👈</div>'; return; }
    const p = this.s.phys;
    const val = f => {
      if (f.bind === 'posY') return [0, this.s.playing ? p.y.toFixed(2) : (this.startY ?? p.y), 0];
      if (f.bind === 'grav') return p.grav;
      if (f.bind === 'mass') return p.mass;
      if (f.bind === 'drag') return p.drag;
      if (f.bind === 'hp') return this.s.hp;
      if (f.bind === 'ref') return this.s.refSet ? f.filled : null;
      return f.v;
    };
    body.innerHTML = `<div class="ue-comp-h" style="background:#333"><span class="ue-chk on"></span> <span class="ico">${(this.s.hier.find(o => o.n === this.s.sel) || {}).i || ''}</span> ${esc(this.s.sel)}<span style="margin-left:auto;color:#999;font-weight:400">Tag: Untagged</span></div>` +
      comps.map(c => `<div class="ue-comp" data-k="comp:${esc(c.n)}"><div class="ue-comp-h"><span>▾</span><span class="ico">${c.i}</span>${esc(c.n)}</div><div class="ue-comp-b">${
        c.f.map(f => {
          const v = val(f);
          let ctl;
          if (f.t === 'vec') ctl = `<div class="ue-vec">${['X', 'Y', 'Z'].map((a, k) => `<span class="ue-in" data-a="${a}">${v[k]}</span>`).join('')}</div>`;
          else if (f.t === 'bool') ctl = `<span class="ue-chk ${v ? 'on' : ''}" data-chk="${f.bind || ''}"></span>`;
          else if (f.t === 'ref') ctl = `<span class="ue-ref ${v ? '' : 'empty'}" data-k="ref">${v ? '🧊 ' + esc(v) : 'None (' + esc(f.type) + ')'} <span style="margin-left:auto">⊙</span></span>`;
          else ctl = `<span class="ue-in">${esc(v)}</span>`;
          return `<div class="ue-f" data-k="f:${esc(f.l)}"><span>${esc(f.l)}</span>${ctl}</div>`;
        }).join('')}</div></div>`).join('') + `<button class="ue-addc" data-k="addc">Add Component</button>`;
  }
  renderBottom() {
    const b = $('.bot-body', this.el);
    if (this.s.bottom === 'proj') {
      b.style.display = 'grid';
      b.innerHTML = `<div class="ue-folders">${['▾ ⭐ Favorites', '▾ 📁 Assets', '   📁 Scenes', '   📁 Scripts', '   📁 Prefabs', '   📁 Materials', '▸ 📦 Packages'].map(f => `<div class="ue-row" style="white-space:pre">${f}</div>`).join('')}</div>
        <div class="ue-assets">${this.s.assets.map(a => `<div class="ue-asset ${a.sel ? 'sel' : ''} ${a.isNew ? 'new' : ''}" data-k="asset:${esc(a.n)}"><div class="th">${a.i}</div>${esc(a.n)}</div>`).join('')}</div>`;
      this.s.assets.forEach(a => delete a.isNew);
    } else {
      b.style.display = 'block';
      b.innerHTML = `<div class="ue-console"><div class="cl" style="color:#888">Clear · Collapse · Error Pause</div>${this.s.logs.map(l => `<div class="cl ${l.c || ''} ${l.isNew ? 'new' : ''}">${esc(l.t)}</div>`).join('')}</div>`;
      this.s.logs.forEach(l => delete l.isNew);
      b.scrollTop = b.scrollHeight;
    }
  }
  log(t, c = '') {
    this.s.logs.push({ t, c, isNew: true });
    if (this.s.logs.length > 60) this.s.logs.shift();
    if (this.s.bottom === 'console') this.renderBottom();
    else { const tab = $('[data-btab=console]', this.el); tab.classList.remove('ue-flash'); void tab.offsetWidth; tab.classList.add('ue-flash'); }
  }
  drawScene() {
    const objs = $('.objs', this.el), sc = $('.ue-scene', this.el);
    const W = sc.clientWidth || 400, H = sc.clientHeight || 300;
    const groundY = H * .8, ppm = Math.min(26, (groundY - 30) / 9.5);
    const p = this.s.phys;
    const y = this.s.playing ? p.y : (this.startY ?? p.y);
    const list = this.cfg.objects || [];
    let html = '';
    list.forEach(o => {
      if (o.k === 'ground') html += `<div class="ue-ground" style="top:${groundY}px"></div>`;
      if (o.k === 'cube') {
        const cy = o.phys ? groundY - (y) * ppm : groundY - o.y * ppm;
        const cx = W * o.x;
        if (o.phys) html += `<div class="ue-shadow" style="left:${cx}px;top:${groundY + 4}px;opacity:${Math.max(.15, 1 - y / 10)}"></div>`;
        html += `<div class="ue-obj" style="left:${cx}px;top:${cy}px"><div class="ue-cube3d ${o.cls || ''} ${this.s.sel === o.n && this.s.view === 'scene' ? 'ue-sel-out' : ''}" style="width:${ppm * 1.4}px;height:${ppm * 1.4}px"></div></div>`;
      }
      if (o.k === 'hpbar' && this.s.view === 'game') {
        html += `<div style="position:absolute;left:12px;top:12px;width:40%;min-width:120px"><div style="font-size:11px;font-weight:700;margin-bottom:3px;text-shadow:0 1px 3px #000">❤️ HP ${this.s.refSet ? this.s.hp : '??'}</div><div class="hp"><i style="width:${this.s.refSet ? this.s.hp : 100}%;background:${this.s.hp > 60 ? '#2ee59d' : this.s.hp > 30 ? '#ffd23f' : '#ff5470'}"></i></div></div>`;
      }
    });
    if (this.cfg.hitBtn && this.s.view === 'game') html += `<button class="btn pink small" data-a="hit" style="position:absolute;right:12px;bottom:12px">💥 Player ko hit karo</button>`;
    if (this.s.view === 'game' && !this.s.playing) html += `<div style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-weight:700;text-shadow:0 2px 6px #000;pointer-events:none">▶ Play dabao game chalane ke liye</div>`;
    objs.innerHTML = html;
    if (this.s.playing) sc.style.boxShadow = 'inset 0 0 0 3px #3a79bb'; else sc.style.boxShadow = '';
  }
  onClick(e) {
    const t = e.target;
    const row = t.closest('[data-row]');
    if (row) { this.s.sel = row.dataset.row; this.renderHier(); this.renderInsp(); this.drawScene(); Game.demo('ue-select'); return; }
    const tab = t.closest('[data-tab]'); if (tab) { this.s.view = tab.dataset.tab; this.renderTabs(); this.drawScene(); return; }
    const bt = t.closest('[data-btab]'); if (bt) { this.s.bottom = bt.dataset.btab; this.renderTabs(); this.renderBottom(); return; }
    const info = t.closest('[data-info]'); if (info && this.tourI < 0) { this.explain(info.dataset.info); return; }
    const chk = t.closest('[data-chk]');
    if (chk && chk.dataset.chk === 'grav') { this.s.phys.grav = !this.s.phys.grav; this.renderInsp(); if (this.ctrlEl) $('.rG', this.ctrlEl).checked = this.s.phys.grav; return; }
    const a = t.closest('[data-a]');
    if (a && a.dataset.a === 'play') { this.togglePlay(); return; }
    if (a && a.dataset.a === 'hit') { this.hit(); return; }
  }
  explain(key) {
    const [title, text] = PANEL_INFO[key] || ['?', ''];
    this.tourSteps = [{ k: key === 'game' ? 'game-tab' : key === 'console' ? 'console-tab' : key, title, text }];
    this.tourI = 0; this.placeTour(true);
  }
  /* ---------- play mode ---------- */
  togglePlay() {
    const s = this.s;
    s.playing = !s.playing;
    const btn = $('[data-a=play]', this.el);
    btn.classList.toggle('on', s.playing);
    if (s.playing) {
      s.view = 'game'; s.bottom = 'console'; s.frame = 0;
      s.phys.y = this.startY ?? s.phys.y; s.phys.vy = 0; s.hp = 100; this.hitGround = false;
      this.renderTabs(); this.renderBottom();
      (this.cfg.onStart || []).forEach(l => this.log(l));
      let last = performance.now(), acc = 0;
      const loop = now => {
        if (!s.playing) return;
        if (!this.el.isConnected) { s.playing = false; return; }
        const dt = Math.min(.05, (now - last) / 1000); last = now;
        s.frame++; acc += dt;
        this.physics(dt);
        if (this.cfg.updateLog && s.frame % 60 === 0) this.log(`Update() chala — frame #${s.frame}`, '');
        $('.fps', this.el).innerHTML = `Frame <b>${s.frame}</b> · Update() ×${s.frame} · Δt ${(dt * 1000).toFixed(0)}ms`;
        this.drawScene();
        if (acc > .25) { acc = 0; if (this.cfg.comps && this.s.sel === 'Player') this.renderInsp(); }
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
      Game.demo('play-' + (this.cfg.id || ''));
    } else {
      cancelAnimationFrame(this.raf);
      $('.fps', this.el).textContent = 'Edit mode';
      s.view = 'scene'; s.phys.y = this.startY ?? s.phys.y; s.phys.vy = 0;
      this.renderTabs(); this.renderInsp(); this.drawScene();
      this.log('⏹ Play mode band — sab values wapas edit-mode wali ho gayi!', 'w');
    }
  }
  physics(dt) {
    if (!this.cfg.objects || !this.cfg.objects.some(o => o.phys)) return;
    const p = this.s.phys;
    if (p.grav) p.vy -= 9.81 * dt;
    p.vy *= 1 / (1 + p.drag * dt);
    p.y += p.vy * dt;
    if (p.y <= .7 && p.vy < 0) {
      if (p.vy < -1.2) {
        this.log(`💥 OnCollisionEnter(Ground) — speed ${(-p.vy).toFixed(1)} m/s pe takraya!`);
        const sc = $('.ue-scene', this.el), f = h('div', { class: 'ue-hit' }, 'BONK!');
        f.style.left = '50%'; f.style.top = '62%'; sc.appendChild(f); setTimeout(() => f.remove(), 1000);
      }
      p.y = .7; p.vy = -p.vy * p.bounce;
      if (Math.abs(p.vy) < .6) p.vy = 0;
    }
  }
  hit() {
    if (!this.s.playing) return;
    Game.demo('ue-hit');
    this.log('PlayerHealth: TakeDamage(25) → onHealthChanged?.Invoke()');
    if (!this.s.refSet) { this.log('NullReferenceException: playerHealth not assigned! (UIManager.OnEnable)', 'e'); return; }
    this.s.hp = Math.max(0, this.s.hp - 25);
    this.log(`UIManager: UpdateHealthBar(${this.s.hp}) — bar update hua!`);
    this.log('AudioReactor: PlayHitSound() — 🔊 thwack!');
    if (this.s.hp === 0) { this.log('PlayerHealth: onDeath?.Invoke() ☠️'); this.log('UIManager: HandlePlayerDeath() — GAME OVER screen!', 'w'); }
    this.drawScene();
  }
  /* ---------- tour ---------- */
  startTour() {
    if (this.s.playing) this.togglePlay();
    this.tourSteps = this.cfg.tour; this.tourI = 0;
    if (this.startBtn) this.startBtn.style.display = 'none';
    this.placeTour(true);
  }
  endTour(done) {
    this.tourI = -1;
    ['ring', 'arrow', 'bubble'].forEach(k => { if (this[k]) { this[k].remove(); this[k] = null; } });
    if (this.startBtn) { this.startBtn.style.display = ''; this.startBtn.textContent = '🧭 Tour dobara dekho'; }
    if (done && this.tourSteps === this.cfg.tour) { Game.badge('editor'); Game.demo('tour-' + this.cfg.id); }
  }
  async placeTour(fresh) {
    const st = this.tourSteps[this.tourI];
    if (fresh && st.act) await this.act(st.act);
    const target = $(`[data-k="${st.k}"]`, this.el);
    if (!target) return;
    if (!this.ring) {
      this.ring = h('div', { class: 'ue-ring' }); this.arrow = h('div', { class: 'ue-arrow' }); this.bubble = h('div', { class: 'ue-bubble' });
      this.el.append(this.ring, this.arrow, this.bubble);
    }
    const R = this.el.getBoundingClientRect(), T = target.getBoundingClientRect();
    const x = T.left - R.left, y = T.top - R.top, w = T.width, hh = T.height;
    Object.assign(this.ring.style, { left: x - 4 + 'px', top: y - 4 + 'px', width: w + 8 + 'px', height: hh + 8 + 'px' });
    const multi = this.tourSteps.length > 1;
    this.bubble.innerHTML = `<b class="h">${st.title}</b>${st.text}<div class="bnav">
      ${multi ? `<span>${this.tourI + 1} / ${this.tourSteps.length}</span>` : '<span></span>'}
      <div style="display:flex;gap:6px">${multi && this.tourI > 0 ? '<button data-t="prev">◀</button>' : ''}
      ${multi ? `<button data-t="skip">Band karo</button>` : ''}
      <button class="go" data-t="next">${!multi ? 'Samjh gaya 👍' : this.tourI === this.tourSteps.length - 1 ? 'Finish 🎉' : 'Aage ▶'}</button></div></div>`;
    this.bubble.onclick = e => {
      const b = e.target.closest('[data-t]'); if (!b) return;
      if (b.dataset.t === 'skip') return this.endTour(false);
      if (b.dataset.t === 'prev') { this.tourI--; return this.placeTour(true); }
      if (this.tourI >= this.tourSteps.length - 1) return this.endTour(multi);
      this.tourI++; this.placeTour(true);
    };
    // bubble placement
    const BW = Math.min(280, R.width - 20), bh = this.bubble.offsetHeight || 150;
    let bx = Math.max(10, Math.min(R.width - BW - 10, x + w / 2 - BW / 2));
    let by = y + hh + 46;
    let arrowDown = true;
    if (by + bh > R.height - 6) { by = y - bh - 46; arrowDown = false; }
    if (by < 6) { by = Math.max(6, Math.min(R.height - bh - 6, y + hh / 2 - bh / 2)); bx = x + w + 50 < R.width - BW ? x + w + 50 : Math.max(10, x - BW - 50); }
    Object.assign(this.bubble.style, { left: bx + 'px', top: by + 'px', width: BW + 'px' });
    // arrow pointing at target
    const ax = x + w / 2 - 17;
    if (arrowDown && by > y) { this.arrow.innerHTML = '<span style="--dy:-6px">👆</span>'; Object.assign(this.arrow.style, { left: ax + 'px', top: y + hh + 4 + 'px' }); }
    else { this.arrow.innerHTML = '<span>👇</span>'; Object.assign(this.arrow.style, { left: ax + 'px', top: Math.max(0, y - 44) + 'px' }); }
  }
  async act(name) {
    const s = this.s;
    if (name === 'selectPlayer') { s.sel = 'Player'; this.renderHier(); this.renderInsp(); this.drawScene(); }
    if (name === 'select:UIManager') { s.sel = 'UIManager'; this.renderHier(); this.renderInsp(); }
    if (name === 'showProj') { s.bottom = 'proj'; this.renderTabs(); this.renderBottom(); }
    if (name === 'showConsole') { s.bottom = 'console'; this.renderTabs(); this.renderBottom(); }
    if (name === 'showScene') { if (s.playing) this.togglePlay(); s.view = 'scene'; this.renderTabs(); this.drawScene(); }
    if (name === 'showGame') { s.view = 'game'; this.renderTabs(); this.drawScene(); }
    if (name === 'createScript') {
      s.bottom = 'proj';
      if (!s.assets.find(a => a.n === 'PlayerHealth.cs')) s.assets.push({ n: 'PlayerHealth.cs', i: '📜', isNew: true, sel: true });
      this.renderTabs(); this.renderBottom();
    }
    if (name === 'attachScript') {
      s.bottom = 'proj'; this.renderTabs(); this.renderBottom();
      const from = $('[data-k="asset:PlayerHealth.cs"]', this.el), to = $('[data-k="row:Player"]', this.el);
      await this.dragAnim(from, to, '📜 PlayerHealth');
      s.sel = 'Player';
      const comps = s.comps.Player;
      if (!comps.find(c => c.n.startsWith('Player Health'))) comps.push({ n: 'Player Health (Script)', i: '📜', f: [{ l: 'Script', v: 'PlayerHealth' }, { l: 'Health', bind: 'hp' }, { l: 'Max Health', v: 100 }] });
      this.renderHier(); this.renderInsp();
    }
    if (name === 'dragRef') {
      s.sel = 'UIManager'; this.renderHier(); this.renderInsp();
      const from = $('[data-k="row:Player"]', this.el), to = $('[data-k="ref"]', this.el);
      await this.dragAnim(from, to, '🧊 Player');
      s.refSet = true; this.renderInsp();
      const r = $('[data-k="ref"]', this.el); r.classList.add('drop'); setTimeout(() => r.classList.remove('drop'), 900);
    }
    if (name === 'play') { if (!s.playing) this.togglePlay(); }
    if (name === 'hit') { if (!s.playing) this.togglePlay(); await sleep(400); this.hit(); }
  }
  dragAnim(from, to, label) {
    return new Promise(res => {
      if (!from || !to) return res();
      const R = this.el.getBoundingClientRect(), A = from.getBoundingClientRect(), B = to.getBoundingClientRect();
      const d = h('div', { class: 'ue-drag' }, label + ' ✋');
      d.style.left = A.left - R.left + 'px'; d.style.top = A.top - R.top + 'px';
      this.el.appendChild(d);
      requestAnimationFrame(() => requestAnimationFrame(() => { d.style.left = B.left - R.left + 10 + 'px'; d.style.top = B.top - R.top + 'px'; }));
      setTimeout(() => { d.remove(); res(); }, 1150);
    });
  }
}

/* ---------- Editor presets used in topics ---------- */
const EDITOR_PRESETS = {
  tour: {
    id: 'tour', controls: true, select: 'Player', sceneName: 'MyFirstGame',
    hier: [{ n: 'Main Camera', i: '🎥' }, { n: 'Directional Light', i: '💡' }, { n: 'Player', i: '🧊' }, { n: 'Ground', i: '▭' }],
    objects: [{ k: 'ground' }, { k: 'cube', n: 'Player', x: .5, phys: true, cls: 'player' }],
    comps: {
      Player: [
        { n: 'Transform', i: '✥', f: [{ l: 'Position', t: 'vec', bind: 'posY' }, { l: 'Rotation', t: 'vec', v: [0, 0, 0] }, { l: 'Scale', t: 'vec', v: [1, 1, 1] }] },
        { n: 'Box Collider', i: '▣', f: [{ l: 'Is Trigger', t: 'bool', v: false }, { l: 'Size', t: 'vec', v: [1, 1, 1] }] },
        { n: 'Rigidbody', i: '⚙️', f: [{ l: 'Mass', bind: 'mass' }, { l: 'Drag', bind: 'drag' }, { l: 'Use Gravity', t: 'bool', bind: 'grav' }, { l: 'Is Kinematic', t: 'bool', v: false }] }
      ],
      Ground: [{ n: 'Transform', i: '✥', f: [{ l: 'Position', t: 'vec', v: [0, 0, 0] }, { l: 'Scale', t: 'vec', v: [20, 1, 20] }] }, { n: 'Box Collider', i: '▣', f: [{ l: 'Size', t: 'vec', v: [1, 1, 1] }] }],
      'Main Camera': [{ n: 'Transform', i: '✥', f: [{ l: 'Position', t: 'vec', v: [0, 3, -10] }] }, { n: 'Camera', i: '🎥', f: [{ l: 'Field of View', v: 60 }] }],
      'Directional Light': [{ n: 'Transform', i: '✥', f: [{ l: 'Rotation', t: 'vec', v: [50, -30, 0] }] }, { n: 'Light', i: '💡', f: [{ l: 'Intensity', v: 1 }] }]
    },
    assets: [{ n: 'Scenes', i: '📁' }, { n: 'Scripts', i: '📁' }, { n: 'PlayerMat', i: '🔵' }, { n: 'Jump.wav', i: '🎵' }],
    onStart: ['Start() chala — game shuru! 🎮', 'Player Rigidbody ready, gravity = -9.81'],
    tour: [
      { k: 'hier', title: '1. Hierarchy 📋', text: PANEL_INFO.hier[1] },
      { k: 'row:Player', act: 'selectPlayer', title: '2. Player select karo', text: 'Dekh, Player pe click kiya toh woh <b>blue highlight</b> ho gaya, Scene view mein uske around orange outline aa gayi, aur Inspector mein uski details khul gayi.' },
      { k: 'scene', act: 'showScene', title: '3. Scene view 🛠️', text: PANEL_INFO.scene[1] },
      { k: 'insp', title: '4. Inspector 🔍', text: PANEL_INFO.insp[1] },
      { k: 'comp:Rigidbody', title: '5. Rigidbody = Physics ON ⚙️', text: 'Rigidbody lagate hi object pe <b>gravity</b> lagne lagti hai. Mass, Drag yahin se change karte hain. Isko hata do toh object hawa mein latka rahega.' },
      { k: 'f:Use Gravity', title: '6. Use Gravity checkbox', text: 'Ye tick hai toh object neeche girega. Untick karo toh space jaisa float karega 🚀. (Tour ke baad isko click karke try karna!)' },
      { k: 'bottom', act: 'showProj', title: '7. Project window 📁', text: PANEL_INFO.proj[1] },
      { k: 'console-tab', title: '8. Console 🖥️', text: PANEL_INFO.console[1] },
      { k: 'play', title: '9. Play button ▶', text: PANEL_INFO.play[1] + ' Chalo dabate hain…' },
      { k: 'scene', act: 'play', title: '10. Game chal gaya! 🎉', text: 'Dekh — <b>Update() har frame</b> chal raha hai (upar frame counter dekh), cube gravity se gir raha hai, aur Ground se <b>takrate hi</b> Console mein OnCollisionEnter ka message aaya!' }
    ]
  },
  script: {
    id: 'script', select: 'Player', sceneName: 'FunctionsDemo', updateLog: true,
    hier: [{ n: 'Main Camera', i: '🎥' }, { n: 'Directional Light', i: '💡' }, { n: 'Player', i: '🧊' }, { n: 'Ground', i: '▭' }],
    objects: [{ k: 'ground' }, { k: 'cube', n: 'Player', x: .5, y: 1.2, cls: 'player' }],
    comps: { Player: [{ n: 'Transform', i: '✥', f: [{ l: 'Position', t: 'vec', v: [0, 1, 0] }] }, { n: 'Box Collider', i: '▣', f: [{ l: 'Size', t: 'vec', v: [1, 1, 1] }] }] },
    assets: [{ n: 'Scenes', i: '📁' }, { n: 'Scripts', i: '📁' }],
    onStart: ['Hello Bhai!  (SayHello() se)', 'Ouch! 25 damage liya! Health: 75  (TakeDamage(25) se)'],
    tour: [
      { k: 'bottom', act: 'showProj', title: '1. Project window kholo', text: 'Script hamesha Project window mein banti hai. <b>Right-click → Create → C# Script</b>.' },
      { k: 'asset:PlayerHealth.cs', act: 'createScript', title: '2. Script ban gayi! 📜', text: 'Naam diya <code>PlayerHealth</code>. Double-click karoge toh code editor (VS Code / Visual Studio) mein khulegi. Saare functions isi file mein likhoge.' },
      { k: 'insp', act: 'attachScript', title: '3. Script ko Player pe drag karo ✋', text: 'Script tab tak kuch nahi karti jab tak kisi GameObject pe <b>attach</b> na ho. Dekh — Inspector mein "Player Health (Script)" component aa gaya!' },
      { k: 'play', title: '4. Play dabao ▶', text: 'Ab Unity khud tumhare <code>Start()</code> function ko call karega, aur phir har frame <code>Update()</code> ko.' },
      { k: 'console-tab', act: 'play', title: '5. Console mein output 🖥️', text: '<code>Start()</code> ke andar likhe <code>SayHello()</code> aur <code>TakeDamage(25)</code> ne yahan message print kiye. Aur har 60 frame pe Update() ka message bhi aa raha hai — upar frame counter dekh!' }
    ]
  },
  events: {
    id: 'events', select: 'UIManager', sceneName: 'EventsDemo', hitBtn: true,
    hier: [{ n: 'Main Camera', i: '🎥' }, { n: 'Player', i: '🧊' }, { n: 'UIManager', i: '🖼️' }, { n: 'AudioReactor', i: '🔊' }, { n: 'Ground', i: '▭' }],
    objects: [{ k: 'ground' }, { k: 'cube', n: 'Player', x: .5, y: 1.2, cls: 'player' }, { k: 'hpbar' }],
    comps: {
      Player: [{ n: 'Transform', i: '✥', f: [{ l: 'Position', t: 'vec', v: [0, 1, 0] }] }, { n: 'Player Health (Script)', i: '📜', f: [{ l: 'Current Health', bind: 'hp' }, { l: 'Max Health', v: 100 }] }],
      UIManager: [{ n: 'Transform', i: '✥', f: [{ l: 'Position', t: 'vec', v: [0, 0, 0] }] }, { n: 'UI Manager (Script)', i: '📜', f: [{ l: 'Player Health', t: 'ref', bind: 'ref', type: 'PlayerHealth', filled: 'Player (PlayerHealth)' }, { l: 'Health Bar', v: 'HealthFill (Image)' }, { l: 'Death Screen', v: 'DeathPanel' }] }],
      AudioReactor: [{ n: 'Audio Reactor (Script)', i: '📜', f: [{ l: 'Player Health', v: 'Player (PlayerHealth)' }, { l: 'Hit Sound', v: 'hit.wav' }] }]
    },
    assets: [{ n: 'PlayerHealth.cs', i: '📜' }, { n: 'UIManager.cs', i: '📜' }, { n: 'AudioReactor.cs', i: '📜' }],
    onStart: ['UIManager.OnEnable(): onHealthChanged += UpdateHealthBar ✅', 'AudioReactor.OnEnable(): onDamageTaken += PlayHitSound ✅'],
    tour: [
      { k: 'row:UIManager', act: 'select:UIManager', title: '1. UIManager select karo', text: 'Ye hamara <b>Subscriber</b> hai — isko Player ke events sunne hain.' },
      { k: 'ref', title: '2. Khaali slot dekha? 😬', text: '"Player Health: None" — matlab UIManager ko abhi pata hi nahi kis Player ko sunna hai. Agar aise hi Play kiya toh <b>NullReferenceException</b> aayega!' },
      { k: 'ref', act: 'dragRef', title: '3. Player ko slot mein drag karo ✋', text: 'Hierarchy se Player utha ke is field mein chhod diya. Ab <code>playerHealth</code> variable Player ko point karta hai. 🔗' },
      { k: 'play', act: 'play', title: '4. Play! ▶', text: 'Play dabate hi <code>OnEnable()</code> chala aur usne <code>+=</code> se events subscribe kar liye. Console dekh!' },
      { k: 'view', act: 'hit', title: '5. Hit karo 💥', text: 'Player ne <code>onHealthChanged?.Invoke()</code> kiya → UIManager ne bar update kiya, AudioReactor ne sound bajaya. <b>Player ko pata bhi nahi ki kaun sun raha hai!</b> Yahi events ka jaadu hai. Ab khud "Player ko hit karo" button dabao.' }
    ]
  }
};
