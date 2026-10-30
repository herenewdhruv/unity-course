/* ==========================================================
   INTERACTIVE DEMOS — sliders / buttons se values badlo,
   result live dekho. Har demo: DEMOS[id](mountEl)
   ========================================================== */
const DEMOS = {};
const slider = (cls, label, min, max, step, val) =>
  `<div class="ctrl"><label>${label} <b class="${cls}-v">${val}</b></label><input type="range" class="${cls}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
const demoBox = (title, inner) => `<div class="demo-title">${title} <span class="live">LIVE</span></div>${inner}`;
function wire(root, cls, fn) {
  const r = $('.' + cls, root), v = $('.' + cls + '-v', root);
  r.addEventListener('input', e => { v.textContent = r.value; fn(+r.value, e); });
  return r;
}

/* ---------- T0: Update() har frame ---------- */
DEMOS.updateLoop = el => {
  el.innerHTML = demoBox('⏱️ Update() ko har frame chalta dekho', `
    <div class="demo-grid"><div>
      ${slider('fps', 'FPS (frames per second)', 1, 60, 1, 5)}
      ${slider('spd', 'speed (units / second)', 0, 10, 0.5, 3)}
      <label class="toggle"><input type="checkbox" class="useDt" checked><span class="sw"></span> <code>* Time.deltaTime</code> use karo</label>
      <div class="live-code" style="margin-top:10px">void Update()
{
    transform.position += Vector3.right
        * speed<span class="dtpart"> * Time.deltaTime</span>;
}</div>
    </div><div>
      <div class="stage" style="height:120px"><canvas class="cv" width="600" height="120" style="width:100%;height:120px"></canvas></div>
      <div class="btn-row" style="margin-top:8px"><button class="btn small primary go">⏸ Pause</button><button class="btn small rst">🔁 Reset</button></div>
      <div class="out-box"><div>Frame: <b class="fN" style="color:var(--yellow)">0</b> · Update() calls: <b class="uN" style="color:var(--yellow)">0</b></div><div>Time.deltaTime = <b class="dtN">0.200</b>s</div><div class="muted" style="font-size:12px;margin-top:4px">Har flash = ek Update() call ⚡</div></div>
    </div></div>
    <div class="callout tip"><span class="ic">💡</span><div><p>FPS kam-zyada karo: <b>deltaTime ON</b> ho toh car har FPS pe same speed se chalti hai. <b>OFF</b> karo toh slow PC pe slow aur fast PC pe tez — isliye hamesha <code>Time.deltaTime</code> se multiply karte hain!</p></div></div>`);
  const cv = $('.cv', el), ctx = cv.getContext('2d');
  let fps = 5, spd = 3, useDt = true, x = 0, frame = 0, acc = 0, last = performance.now(), running = true, flash = 0, raf;
  wire(el, 'fps', v => { fps = v; Game.demo('updateLoop'); });
  wire(el, 'spd', v => { spd = v; Game.demo('updateLoop'); });
  $('.useDt', el).onchange = e => { useDt = e.target.checked; $('.dtpart', el).style.opacity = useDt ? 1 : .25; Game.demo('updateLoop'); };
  $('.go', el).onclick = e => { running = !running; e.target.textContent = running ? '⏸ Pause' : '▶ Play'; last = performance.now(); if (running) loop(last); };
  $('.rst', el).onclick = () => { x = 0; frame = 0; draw(); };
  function draw() {
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#ffffff10'; for (let i = 0; i < W; i += 40) ctx.fillRect(i, 0, 1, H);
    ctx.fillStyle = '#2a3050'; ctx.fillRect(0, H - 22, W, 22);
    const px = 20 + (x * 40) % (W - 40);
    ctx.font = '34px serif'; ctx.fillText('🚗', px, H - 30);
    if (flash > 0) { ctx.fillStyle = `rgba(255,210,63,${flash})`; ctx.fillRect(0, 0, W, 6); flash -= .15; }
    ctx.fillStyle = '#9aa3c7'; ctx.font = '13px monospace'; ctx.fillText(`x = ${x.toFixed(2)}`, 10, 18);
  }
  function loop(now) {
    if (!running || !el.isConnected) return;
    const dt = Math.min(.1, (now - last) / 1000); last = now; acc += dt;
    const step = 1 / fps;
    while (acc >= step) {
      acc -= step; frame++; flash = 1;
      x += spd * (useDt ? step : 1 / 20);
      $('.fN', el).textContent = frame; $('.uN', el).textContent = frame; $('.dtN', el).textContent = step.toFixed(3);
    }
    draw();
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
};

/* ---------- T1: Function machine ---------- */
DEMOS.funcMachine = el => {
  el.innerHTML = demoBox('🏭 Function Machine — AddNumbers(a, b)', `
    <div class="demo-grid"><div>
      ${slider('a', 'a (pehla ingredient)', 0, 50, 1, 5)}
      ${slider('b', 'b (doosra ingredient)', 0, 50, 1, 3)}
      <div class="ctrl"><label>Operation</label>
        <div class="btn-row"><button class="btn small op" data-op="+">AddNumbers (+)</button><button class="btn small op" data-op="*">Multiply (×)</button><button class="btn small op" data-op="-">Subtract (−)</button></div></div>
      <div class="live-code code-out"></div>
    </div><div>
      <div class="machine" style="position:relative;min-height:140px"><span class="in ia">5</span><span class="in ib">3</span><span>➜</span><div class="box">⚙️<br><span class="fname">AddNumbers</span></div><span>➜</span><span class="outv">8</span></div>
      <div class="btn-row"><button class="btn primary call">📞 Function call karo!</button></div>
      <p class="muted" style="font-size:13px">Ek baar function likho, phir jitni baar chahe alag ingredients ke saath call karo. Calls ab tak: <b class="calls">0</b></p>
    </div></div>`);
  let a = 5, b = 3, op = '+', calls = 0;
  const names = { '+': 'AddNumbers', '*': 'MultiplyNumbers', '-': 'SubtractNumbers' };
  const calc = () => op === '+' ? a + b : op === '*' ? a * b : a - b;
  const code = () => {
    $('.code-out', el).innerHTML = CS.block(`int ${names[op]}(int a, int b)\n{\n    return a ${op} b;\n}\n\nint result = ${names[op]}(${a}, ${b}); // ${calc()}`);
    $('.ia', el).textContent = a; $('.ib', el).textContent = b; $('.fname', el).textContent = names[op];
    $$('.op', el).forEach(x => x.classList.toggle('primary', x.dataset.op === op));
  };
  wire(el, 'a', v => { a = v; code(); });
  wire(el, 'b', v => { b = v; code(); });
  $$('.op', el).forEach(x => x.onclick = () => { op = x.dataset.op; code(); });
  $('.call', el).onclick = async ev => {
    const box = $('.box', el), out = $('.outv', el);
    out.textContent = '…'; box.classList.remove('working'); void box.offsetWidth; box.classList.add('working');
    Sfx.pop(); await sleep(500);
    out.textContent = calc(); out.style.animation = 'none'; void out.offsetWidth; out.style.animation = 'valPop .7s';
    $('.calls', el).textContent = ++calls;
    Game.demo('funcMachine', ev);
  };
  code();
};

/* ---------- T2: Health status (return + if-else) ---------- */
DEMOS.healthStatus = el => {
  el.innerHTML = demoBox('❤️ GetHealthStatus() — health badlo, return dekho', `
    <div class="demo-grid"><div>
      ${slider('hp', 'health', 0, 100, 1, 60)}
      <div class="hp" style="margin:6px 0 14px"><i class="hpbar"></i></div>
      <div class="sigs"></div>
    </div><div>
      <div class="out-box" style="text-align:center"><div class="muted" style="font-size:12px">return value</div><div class="out-big st-out">"Wounded"</div><div class="emo" style="font-size:44px">🤕</div></div>
      <div class="out-box" style="margin-top:10px"><div>IsAlive() → <b class="alive"></b></div><div>GetHealthPercent() → <b class="pct"></b></div></div>
    </div></div>`);
  const rows = [['health > 75', 'Healthy', '💪'], ['health > 50', 'Wounded', '🤕'], ['health > 25', 'Critical', '😰'], ['(baaki sab)', 'Dying', '💀']];
  const upd = v => {
    const k = v > 75 ? 0 : v > 50 ? 1 : v > 25 ? 2 : 3;
    $('.sigs', el).innerHTML = rows.map((r, i) => `<div class="sig ${i === k ? 'match' : i < k ? 'nope' : ''}">${i < 3 ? `if (${r[0]}) ` : ''}return "${r[1]}";${i < k ? ' ❌' : i === k ? ' ✅ EXIT!' : ' <span class="muted">(chala hi nahi)</span>'}</div>`).join('');
    $('.st-out', el).textContent = `"${rows[k][1]}"`; $('.emo', el).textContent = rows[k][2];
    const bar = $('.hpbar', el); bar.style.width = v + '%'; bar.style.background = v > 60 ? '#2ee59d' : v > 30 ? '#ffd23f' : '#ff5470';
    $('.alive', el).innerHTML = v > 0 ? '<span style="color:var(--green)">true</span>' : '<span style="color:var(--red)">false</span>';
    $('.pct', el).textContent = (v / 100).toFixed(2) + 'f';
  };
  wire(el, 'hp', v => { upd(v); Game.demo('healthStatus'); });
  upd(60);
};

/* ---------- T3: value vs ref ---------- */
DEMOS.refBox = el => {
  el.innerHTML = demoBox('📄 Copy vs 🔗 Reference — khud try karo', `
    <div class="demo-grid"><div>
      ${slider('dmg', 'damage', 5, 50, 5, 30)}
      <div class="btn-row"><button class="btn primary byval">ApplyDamage(myHealth, dmg)</button><button class="btn pink byref">ApplyDamageRef(ref myHealth, dmg)</button></div>
      <button class="btn small rst">🔁 myHealth = 100</button>
      <div class="live-code lc" style="margin-top:10px"></div>
    </div><div style="position:relative">
      <div class="frame active"><div class="frame-name">📦 Start()</div><div class="vars"><div class="var orig"><div class="n"><span>myHealth</span><em>int</em></div><div class="v ov">100</div></div></div></div>
      <div style="text-align:center;font-size:22px;margin:4px 0" class="arrow">⬇️</div>
      <div class="frame fn" style="opacity:.35"><div class="frame-name fnn">📦 ApplyDamage()</div><div class="vars"><div class="var cp"><div class="n"><span>health</span><em class="ty">int</em></div><div class="v cv">—</div></div></div></div>
      <div class="why expl" style="margin-top:10px">Button dabao aur dekho original <b>myHealth</b> ka kya hota hai 👆</div>
    </div></div>`);
  let mh = 100, dmg = 30, busy = false;
  wire(el, 'dmg', v => dmg = v);
  const ov = $('.ov', el), cv = $('.cv', el), fn = $('.fn', el), orig = $('.orig', el), cp = $('.cp', el);
  const pop = x => { x.parentElement.classList.remove('changed'); void x.offsetWidth; x.parentElement.classList.add('changed'); };
  async function run(isRef, ev) {
    if (busy) return; busy = true; Game.demo('refBox', ev);
    $('.lc', el).innerHTML = CS.block(isRef ? `ApplyDamageRef(ref myHealth, ${dmg});\n// andar: health -= ${dmg};  → ORIGINAL badla` : `ApplyDamage(myHealth, ${dmg});\n// andar: health -= ${dmg};  → sirf COPY badli`);
    $('.fnn', el).textContent = isRef ? '📦 ApplyDamageRef()' : '📦 ApplyDamage()';
    $('.ty', el).textContent = isRef ? 'ref int' : 'int';
    fn.style.opacity = 1; fn.style.animation = 'frameIn .4s';
    cp.classList.toggle('ref', isRef); orig.classList.toggle('linked', isRef);
    cv.textContent = isRef ? '🔗 → myHealth' : mh; pop(cv);
    $('.expl', el).innerHTML = isRef ? '🔗 <b>ref</b>: health asli myHealth ka link hai…' : '📄 health mein myHealth ki <b>photocopy</b> aayi…';
    await sleep(900);
    if (isRef) { mh -= dmg; ov.textContent = mh; pop(ov); $('.expl', el).innerHTML = `💥 Link ke through <b>original</b> badal gaya! myHealth = <b>${mh}</b>`; Sfx.bad(); }
    else { cv.textContent = mh - dmg; pop(cv); $('.expl', el).innerHTML = `Copy ${mh} → ${mh - dmg} hui, lekin original myHealth abhi bhi <b>${mh}</b> 😎 (function khatam hote hi copy gayab)`; Sfx.ok(); }
    await sleep(1300);
    fn.style.opacity = .35; cp.classList.remove('ref'); orig.classList.remove('linked'); cv.textContent = '—';
    busy = false;
  }
  $('.byval', el).onclick = e => run(false, e);
  $('.byref', el).onclick = e => run(true, e);
  $('.rst', el).onclick = () => { mh = 100; ov.textContent = mh; pop(ov); };
  $('.lc', el).innerHTML = CS.block('// ek button dabao 👆');
};

/* ---------- T3b: out / TryParse ---------- */
DEMOS.tryParse = el => {
  el.innerHTML = demoBox('🔢 int.TryParse(input, out int n) — kuch bhi type karo', `
    <div class="demo-grid"><div>
      <div class="ctrl"><label>Player ne type kiya:</label><input class="inp" value="42" style="background:#090b14;border:1px solid var(--line);color:var(--text);padding:10px 12px;border-radius:10px;font-family:var(--mono);font-size:16px"></div>
      <div class="btn-row"><button class="btn small ex" data-v="42">42</button><button class="btn small ex" data-v="abc">abc</button><button class="btn small ex" data-v="-7">-7</button><button class="btn small ex" data-v="3.5">3.5</button><button class="btn small ex" data-v="">(khaali)</button></div>
    </div><div>
      <div class="live-code lc"></div>
      <div class="out-box" style="margin-top:8px"><div>return → <b class="ret"></b></div><div>out n → <b class="outn"></b></div></div>
    </div></div>`);
  const upd = () => {
    const s = $('.inp', el).value;
    const ok = /^\s*[-+]?\d+\s*$/.test(s) && Math.abs(+s) <= 2147483647;
    $('.lc', el).innerHTML = CS.block(`if (int.TryParse("${s}", out int n))\n    Debug.Log("Number: " + n);\nelse\n    Debug.Log("Invalid number!");`);
    $('.ret', el).innerHTML = ok ? '<span style="color:var(--green)">true ✅</span>' : '<span style="color:var(--red)">false ❌</span>';
    $('.outn', el).innerHTML = ok ? `<span style="color:var(--yellow)">${parseInt(s, 10)}</span>` : '<span class="muted">0 (default — out ko kuch na kuch set karna hi padta hai)</span>';
  };
  $('.inp', el).addEventListener('input', () => { upd(); Game.demo('tryParse'); });
  $$('.ex', el).forEach(b => b.onclick = () => { $('.inp', el).value = b.dataset.v; upd(); Game.demo('tryParse'); });
  upd();
};

/* ---------- T4: params + defaults ---------- */
DEMOS.paramsBuilder = el => {
  el.innerHTML = demoBox('🧮 AddAll(params int[] numbers) — kitne bhi numbers', `
    <div class="demo-grid"><div>
      <div class="btn-row"><button class="btn small add">➕ Random number jodo</button><button class="btn small clr">🗑️ Sab hatao</button></div>
      <div class="pill-list nums" style="min-height:40px"></div>
      <div class="live-code lc" style="margin-top:10px"></div>
    </div><div>
      <div class="w-loop" style="margin-bottom:10px"><div class="items lp"></div></div>
      <div class="out-box"><div>total = <span class="out-big tot">0</span></div></div>
      <button class="btn primary run" style="margin-top:10px">▶ AddAll chalao (loop dekho)</button>
    </div></div>`);
  let nums = [10, 20, 30], busy = false;
  const render = () => {
    $('.nums', el).innerHTML = nums.map((n, i) => `<span class="pill">${n}<button data-i="${i}" title="hatao">✕</button></span>`).join('') || '<span class="muted">Koi number nahi — AddAll() bhi chalega, total 0!</span>';
    $('.lc', el).innerHTML = CS.block(`int sum = AddAll(${nums.join(', ')});`);
    $('.lp', el).innerHTML = nums.map(n => `<div class="it">${n}</div>`).join('');
    $('.tot', el).textContent = '?';
  };
  $('.nums', el).onclick = e => { const b = e.target.closest('button'); if (b && !busy) { nums.splice(+b.dataset.i, 1); render(); } };
  $('.add', el).onclick = () => { if (!busy && nums.length < 9) { nums.push(5 * (1 + Math.floor(Math.random() * 10))); render(); Game.demo('params'); } };
  $('.clr', el).onclick = () => { if (!busy) { nums = []; render(); } };
  $('.run', el).onclick = async ev => {
    if (busy) return; busy = true; Game.demo('params', ev);
    let total = 0; const its = $$('.lp .it', el); $('.tot', el).textContent = 0;
    for (let i = 0; i < nums.length; i++) {
      its.forEach((x, k) => { x.classList.toggle('cur', k === i); x.classList.toggle('done', k < i); });
      await sleep(450); total += nums[i];
      const t = $('.tot', el); t.textContent = total; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = 'valPop .6s'; Sfx.pop();
    }
    its.forEach(x => { x.classList.remove('cur'); x.classList.add('done'); });
    busy = false;
  };
  render();
};

DEMOS.spawner = el => {
  el.innerHTML = demoBox('👾 SpawnEnemy(name, level = 1, health = 100)', `
    <div class="demo-grid"><div>
      <div class="ctrl"><label>name (zaroori)</label><div class="btn-row nm"><button class="btn small primary" data-n="Goblin">👺 Goblin</button><button class="btn small" data-n="Orc">👹 Orc</button><button class="btn small" data-n="Dragon">🐉 Dragon</button></div></div>
      <label class="toggle"><input type="checkbox" class="useL"><span class="sw"></span> level bhejo?</label>
      ${slider('lv', 'level', 1, 20, 1, 5)}
      <label class="toggle"><input type="checkbox" class="useH"><span class="sw"></span> health bhejo?</label>
      ${slider('hh', 'health', 50, 1000, 50, 300)}
      <label class="toggle"><input type="checkbox" class="named"><span class="sw"></span> Named arguments (ulta order)</label>
    </div><div>
      <div class="live-code lc"></div>
      <button class="btn primary sp" style="margin:10px 0">✨ Spawn!</button>
      <div class="army"></div>
    </div></div>`);
  let name = 'Goblin';
  const em = { Goblin: '👺', Orc: '👹', Dragon: '🐉' };
  const call = () => {
    const L = $('.useL', el).checked, H = $('.useH', el).checked, N = $('.named', el).checked;
    const lv = $('.lv', el).value, hp = $('.hh', el).value;
    let args;
    if (N) { args = []; if (H) args.push(`health: ${hp}`); if (L) args.push(`level: ${lv}`); args.push(`name: "${name}"`); }
    else { args = [`"${name}"`]; if (L || H) args.push(L ? lv : '1'); if (H) args.push(hp); }
    $('.lc', el).innerHTML = CS.block(`SpawnEnemy(${args.join(', ')});\n// level = ${L ? lv : '1 (default)'}, health = ${H ? hp : '100 (default)'}`);
    return { lv: L ? lv : 1, hp: H ? hp : 100, dl: !L, dh: !H };
  };
  el.addEventListener('input', call); el.addEventListener('change', call);
  $$('.nm button', el).forEach(b => b.onclick = () => { name = b.dataset.n; $$('.nm button', el).forEach(x => x.classList.toggle('primary', x === b)); call(); });
  $('.sp', el).onclick = ev => {
    const c = call(); Game.demo('spawner', ev); Sfx.pop();
    const card = h('div', { class: 'enemy-card' }, `<span class="e">${em[name]}</span><b>${name}</b>Lv.${c.lv}${c.dl ? '*' : ''} · HP ${c.hp}${c.dh ? '*' : ''}`);
    const army = $('.army', el); army.prepend(card); while (army.children.length > 6) army.lastChild.remove();
  };
  call();
  $('.army', el).insertAdjacentHTML('afterend', '<p class="muted" style="font-size:12px">* = default value use hui</p>');
};

/* ---------- T5: overload switchboard ---------- */
DEMOS.overload = el => {
  const sigs = [
    ['TakeDamage(int amount)', 'Physical', a => a, '🗡️'], ['TakeDamage(float amount)', 'Magic', a => Math.round(a), '✨'],
    ['TakeDamage(string type, int amount)', 'Typed', null, '🔥']
  ];
  el.innerHTML = demoBox('🎛️ Overload Switchboard — kaunsa TakeDamage chalega?', `
    <div class="demo-grid"><div>
      <div class="btn-row calls">
        <button class="btn small" data-c="0">TakeDamage(10)</button>
        <button class="btn small" data-c="1">TakeDamage(15.5f)</button>
        <button class="btn small" data-c="2" data-t="Fire">TakeDamage("Fire", 20)</button>
        <button class="btn small" data-c="2" data-t="Ice">TakeDamage("Ice", 20)</button>
        <button class="btn small" data-c="2" data-t="Poison">TakeDamage("Poison", 20)</button>
      </div>
      <div class="sigs">${sigs.map((s, i) => `<div class="sig" data-s="${i}">${s[3]} void ${s[0]}</div>`).join('')}</div>
    </div><div>
      <div class="out-box"><div class="muted" style="font-size:12px">Enemy HP</div><div class="hp" style="margin:6px 0"><i class="bar" style="width:100%"></i></div><b class="hpn">100</b> / 100 <span class="eff"></span></div>
      <div class="console log" style="margin-top:10px"><span class="empty">// koi call karo 👈</span></div>
      <button class="btn small rst" style="margin-top:8px">🔁 Heal</button>
    </div></div>`);
  let hp = 100;
  const upd = () => { $('.bar', el).style.width = Math.max(0, hp) + '%'; $('.hpn', el).textContent = Math.max(0, hp); };
  const log = t => { const c = $('.log', el); if (c.querySelector('.empty')) c.innerHTML = ''; c.insertAdjacentHTML('beforeend', `<div class="l new">${esc(t)}</div>`); c.scrollTop = 1e6; };
  $$('.calls button', el).forEach(b => b.onclick = ev => {
    const k = +b.dataset.c; Game.demo('overload', ev);
    $$('.sig', el).forEach((s, i) => { s.classList.toggle('match', i === k); s.classList.toggle('nope', i !== k); });
    let dmg, msg;
    if (k === 0) { dmg = 10; msg = 'Took 10 physical damage!'; }
    if (k === 1) { dmg = 16; msg = 'Took 15.5 magic damage! (round → 16)'; }
    if (k === 2) {
      const t = b.dataset.t;
      dmg = t === 'Fire' ? 40 : 20; msg = `Took 20 ${t} damage!` + (t === 'Fire' ? ' (Fire = ×2 → 40)' : t === 'Ice' ? ' (speed aadhi ho gayi 🥶)' : ' (poison tick shuru 🤢)');
      $('.eff', el).textContent = t === 'Fire' ? '🔥' : t === 'Ice' ? '🧊' : '🤢';
    } else $('.eff', el).textContent = '';
    hp -= dmg; upd(); log(msg); Sfx.bad();
  });
  $('.rst', el).onclick = () => { hp = 100; upd(); };
};

/* ---------- T6: lambda playground ---------- */
DEMOS.lambdaLab = el => {
  el.innerHTML = demoBox('🧪 Lambda Lab — scores list pe lambdas chalao', `
    <div class="demo-grid"><div>
      ${slider('th', 'threshold (X)', 0, 100, 5, 60)}
      <div class="btn-row">
        <button class="btn small" data-op="find">Find(s =&gt; s &gt; X)</button>
        <button class="btn small" data-op="all">FindAll(s =&gt; s &gt;= X)</button>
        <button class="btn small" data-op="rm">RemoveAll(s =&gt; s &lt; X)</button>
        <button class="btn small" data-op="desc">Sort((a,b) =&gt; b.CompareTo(a))</button>
        <button class="btn small" data-op="asc">Sort((a,b) =&gt; a.CompareTo(b))</button>
        <button class="btn small" data-op="dbl">ForEach → s * 2</button>
      </div>
      <button class="btn small rst">🔁 Naye random scores</button>
    </div><div>
      <div class="w-bars bars" style="height:150px;margin-top:16px"></div>
      <div class="live-code lc" style="margin-top:10px"></div>
    </div></div>`);
  let list = [], th = 60;
  const fresh = () => { list = Array.from({ length: 7 }, () => 10 + Math.floor(Math.random() * 18) * 5); draw(); $('.lc', el).innerHTML = CS.block(`List<int> scores = new List<int> {${list.join(', ')}};`); };
  const draw = (hl = [], out = []) => {
    const mx = Math.max(...list, 1);
    $('.bars', el).innerHTML = list.map((v, k) => `<div class="b ${hl.includes(k) ? 'hl' : ''} ${out.includes(k) ? 'out' : ''}" style="height:${v / mx * 85}%"><span>${v}</span></div>`).join('') || '<span class="muted" style="margin:auto">List khaali! 🫙</span>';
  };
  wire(el, 'th', v => th = v);
  $$('[data-op]', el).forEach(b => b.onclick = async ev => {
    Game.demo('lambda', ev); const op = b.dataset.op; let code;
    if (op === 'find') { const i = list.findIndex(s => s > th); draw(i >= 0 ? [i] : []); code = `int first = scores.Find(s => s > ${th});\n// → ${i >= 0 ? list[i] : '0 (koi nahi mila, default)'}`; }
    if (op === 'all') { const ids = list.map((s, i) => s >= th ? i : -1).filter(i => i >= 0); draw(ids); code = `var good = scores.FindAll(s => s >= ${th});\n// → [${ids.map(i => list[i]).join(', ')}]`; }
    if (op === 'rm') { const ids = list.map((s, i) => s < th ? i : -1).filter(i => i >= 0); draw([], ids); code = `scores.RemoveAll(s => s < ${th});\n// ${ids.length} hataye`; $('.lc', el).innerHTML = CS.block(code); await sleep(700); list = list.filter(s => s >= th); draw(); }
    if (op === 'desc') { list.sort((a, c) => c - a); draw([0]); code = 'scores.Sort((a, b) => b.CompareTo(a)); // bada pehle 🏆'; }
    if (op === 'asc') { list.sort((a, c) => a - c); draw(); code = 'scores.Sort((a, b) => a.CompareTo(b)); // chhota pehle'; }
    if (op === 'dbl') { list = list.map(s => s * 2); draw(list.map((_, i) => i)); code = 'for (int i = 0; i < scores.Count; i++)\n    scores[i] = Double(scores[i]);\n// Func<int,int> Double = s => s * 2;'; }
    $('.lc', el).innerHTML = CS.block(code);
  });
  $('.rst', el).onclick = fresh;
  fresh();
};

/* ---------- T7: delegate combo builder ---------- */
DEMOS.comboBuilder = el => {
  const fns = [
    ['TakePhysicalDamage', '🗡️', d => `Physical: -${d} HP`], ['ShowDamageNumber', '💥', d => `POW! ${d} damage!`],
    ['PlayHitSound', '🔊', () => 'Hit sound played!'], ['ShakeCamera', '📳', () => 'Camera shake!'], ['SpawnBlood', '🩸', () => 'Particles spawned']
  ];
  el.innerHTML = demoBox('🎵 Delegate Playlist — functions jodo (+=) / hatao (-=)', `
    <div class="demo-grid"><div>
      <div class="lbl-sm">Available functions (signature: void X(int))</div>
      <div style="display:grid;gap:6px" class="fl">${fns.map((f, i) => `<div class="sig" style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin:0"><span>${f[1]} ${f[0]}</span><span style="display:flex;gap:4px"><button class="btn small" data-add="${i}">+=</button><button class="btn small" data-rm="${i}">-=</button></span></div>`).join('')}</div>
      ${slider('d', 'damage', 5, 100, 5, 30)}
    </div><div>
      <div class="w-chips chips" style="min-height:40px;margin-bottom:8px"></div>
      <div class="live-code lc"></div>
      <button class="btn primary fire" style="margin:10px 0">⚡ combo(damage) call karo</button>
      <div class="console log"><span class="empty">// output</span></div>
    </div></div>`);
  let list = [0], code = ['DamageAction combo = TakePhysicalDamage;'], dmg = 30, busy = false;
  wire(el, 'd', v => dmg = v);
  const draw = run => {
    $('.chips', el).innerHTML = `<span class="dname">combo =</span>` + (list.length ? list.map(i => `<span class="c ${run === i ? 'run' : ''}">${fns[i][1]} ${fns[i][0]}</span>`).join('<span class="muted">+</span>') : '<span class="muted">null 😶</span>');
    $('.lc', el).innerHTML = CS.block(code.slice(-5).join('\n'));
  };
  el.addEventListener('click', ev => {
    const a = ev.target.closest('[data-add]'), r = ev.target.closest('[data-rm]');
    if (busy) return;
    if (a) { const i = +a.dataset.add; list.push(i); code.push(`combo += ${fns[i][0]};`); Game.demo('combo', ev); Sfx.pop(); draw(); }
    if (r) { const i = +r.dataset.rm; const k = list.lastIndexOf(i); if (k >= 0) list.splice(k, 1); code.push(`combo -= ${fns[i][0]};${k < 0 ? ' // list mein tha hi nahi, kuch nahi hua' : ''}`); draw(); }
  });
  $('.fire', el).onclick = async ev => {
    if (busy) return; busy = true; Game.demo('combo', ev);
    const c = $('.log', el); c.innerHTML = '';
    code.push(list.length ? `combo(${dmg});` : `combo?.Invoke(${dmg}); // null hai, safe skip`); draw();
    if (!list.length) c.innerHTML = '<div class="l warn new">combo null hai — ?.Invoke() ne crash se bachaya</div>';
    for (const i of list) { draw(i); c.insertAdjacentHTML('beforeend', `<div class="l new">${esc(fns[i][2](dmg))}</div>`); Sfx.pop(); await sleep(550); }
    draw(); busy = false;
  };
  draw();
};

/* ---------- T8: event radio ---------- */
DEMOS.eventRadio = el => {
  const subs = [
    ['ui', '🖼️ UIManager', 'UpdateHealthBar'], ['audio', '🔊 AudioReactor', 'PlayHitSound'], ['ach', '🏆 Achievements', 'CheckNoDamage'], ['cam', '🎥 CameraShake', 'Shake']
  ];
  el.innerHTML = demoBox('📻 Event Radio Station — subscribers ON/OFF karo', `
    <div class="demo-grid"><div>
      <div class="radio rad"><div class="wave"></div><div class="wave"></div><div class="wave"></div><div class="tower">📡</div></div>
      <div style="text-align:center;font-family:var(--mono);font-size:13px">PlayerHealth<br><span class="muted">public event Action&lt;int&gt; onHealthChanged;</span></div>
      <div class="btn-row" style="justify-content:center;margin-top:10px"><button class="btn pink hit">💥 TakeDamage(20)</button><button class="btn small outside">😈 Bahar se Invoke try karo</button><button class="btn small heal">💚 Heal</button></div>
    </div><div>
      <div class="subs">${subs.map(s => `<div class="sub-card" data-s="${s[0]}"><h5>${s[1]} <label class="toggle"><input type="checkbox" checked data-sub="${s[0]}"><span class="sw"></span></label></h5><div class="muted" style="font-size:12px;font-family:var(--mono)">${s[2]}(int hp)</div><div class="res" style="font-size:13px;margin-top:6px;min-height:20px"></div></div>`).join('')}</div>
      <div class="console log" style="margin-top:10px"><span class="empty">// event log</span></div>
    </div></div>`);
  let hp = 100;
  const on = { ui: true, audio: true, ach: true, cam: true };
  const log = (t, c = '') => { const L = $('.log', el); if (L.querySelector('.empty')) L.innerHTML = ''; L.insertAdjacentHTML('beforeend', `<div class="l ${c} new">${esc(t)}</div>`); L.scrollTop = 1e6; };
  $$('[data-sub]', el).forEach(cb => cb.onchange = () => {
    const k = cb.dataset.sub; on[k] = cb.checked;
    $(`.sub-card[data-s=${k}]`, el).classList.toggle('off', !cb.checked);
    const s = subs.find(x => x[0] === k);
    log(`onHealthChanged ${cb.checked ? '+=' : '-='} ${s[2]};`, cb.checked ? '' : 'warn');
    Game.demo('radio');
  });
  const results = { ui: hp => `❤️ bar: ${hp}%`, audio: () => '🔊 thwack!', ach: hp => hp < 100 ? '❌ "No Damage" achievement gaya' : '✅', cam: () => '📳 shake!' };
  $('.hit', el).onclick = async ev => {
    Game.demo('radio', ev);
    hp = Math.max(0, hp - 20);
    const r = $('.rad', el); r.classList.remove('cast'); void r.offsetWidth; r.classList.add('cast');
    log(`TakeDamage(20) → onHealthChanged?.Invoke(${hp})`);
    const active = subs.filter(s => on[s[0]]);
    if (!active.length) log('Koi subscriber nahi → ?. ne null dekha → kuch nahi hua (no crash) 🛡️', 'warn');
    await sleep(350);
    for (const s of active) {
      const c = $(`.sub-card[data-s=${s[0]}]`, el);
      c.classList.remove('ping'); void c.offsetWidth; c.classList.add('ping');
      $('.res', c).textContent = results[s[0]](hp);
      log(`  ↳ ${s[1].slice(3)}.${s[2]}(${hp})`);
      await sleep(180);
    }
    Sfx.pop();
  };
  $('.outside', el).onclick = ev => {
    Game.demo('radio', ev); Sfx.bad();
    log('Enemy.cs: player.onHealthChanged.Invoke(0);', '');
    log("error CS0070: The event 'onHealthChanged' can only appear on the left hand side of += or -= (except within PlayerHealth)", 'err');
    log('👆 Event ko sirf owner class fire kar sakti hai. Bahar wale sirf += / -= kar sakte hain!', 'warn');
  };
  $('.heal', el).onclick = () => { hp = 100; log('Heal → hp = 100'); };
};

/* ---------- T9: Func formula picker ---------- */
DEMOS.formula = el => {
  const F = {
    normal: ['(dmg, def) => dmg - def', (d, f) => d - f, '🗡️'], critical: ['(dmg, def) => dmg * 2 - def', (d, f) => d * 2 - f, '💥'],
    magic: ['(dmg, def) => dmg', d => d, '✨'], pierce: ['(dmg, def) => dmg - def / 2', (d, f) => d - Math.floor(f / 2), '🏹']
  };
  el.innerHTML = demoBox('🧮 Func<int, int, int> damage formula — swap karo', `
    <div class="demo-grid"><div>
      ${slider('bd', 'baseDmg', 0, 100, 1, 50)}
      ${slider('df', 'defense', 0, 60, 1, 10)}
      <div class="btn-row fm">${Object.keys(F).map((k, i) => `<button class="btn small ${i ? '' : 'primary'}" data-f="${k}">${F[k][2]} ${k}</button>`).join('')}</div>
      <label class="toggle"><input type="checkbox" class="cd"><span class="sw"></span> cooldown ready? (Func&lt;bool&gt; canAttack)</label>
    </div><div>
      <div class="live-code lc"></div>
      <div class="out-box" style="margin-top:10px;text-align:center"><div class="muted" style="font-size:12px">int finalDmg =</div><div class="out-big res">40</div></div>
    </div></div>`);
  let cur = 'normal';
  const upd = () => {
    const d = +$('.bd', el).value, f = +$('.df', el).value, ready = $('.cd', el).checked;
    const res = Math.max(0, F[cur][1](d, f));
    $('.lc', el).innerHTML = CS.block(`Func<int, int, int> currentFormula = ${F[cur][0]};\nFunc<bool> canAttack = () => cooldown <= 0; // ${ready}\n\nif (canAttack())\n    finalDmg = currentFormula(${d}, ${f}); // ${ready ? res : '—'}`);
    const r = $('.res', el); r.textContent = ready ? res : '⛔ cooldown'; r.style.animation = 'none'; void r.offsetWidth; r.style.animation = 'valPop .5s';
  };
  wire(el, 'bd', () => { upd(); Game.demo('formula'); }); wire(el, 'df', upd);
  $('.cd', el).onchange = upd; $('.cd', el).checked = true;
  $$('[data-f]', el).forEach(b => b.onclick = () => { cur = b.dataset.f; $$('[data-f]', el).forEach(x => x.classList.toggle('primary', x === b)); upd(); Game.demo('formula'); });
  upd();
};

/* ---------- T10: callback timer + loader ---------- */
DEMOS.callbacks = el => {
  el.innerHTML = demoBox('📞 Callbacks — "kaam ho jaye toh bata dena"', `
    <div class="demo-grid"><div>
      <div class="lbl-sm">1) DoAfterDelay(seconds, callback)</div>
      ${slider('sec', 'seconds', 1, 6, 1, 3)}
      <div class="btn-row cbs"><button class="btn small primary" data-cb="pizza">🍕 OnPizzaReady</button><button class="btn small" data-cb="enemy">👾 SpawnEnemy</button><button class="btn small" data-cb="door">🚪 OpenDoor</button></div>
      <button class="btn green go">▶ Start timer</button>
      <div class="timeline" style="margin-top:10px"><div class="fill"></div><div class="txt">ready</div></div>
    </div><div>
      <div class="lbl-sm">2) LoadData(url, onSuccess, onError)</div>
      ${slider('rate', 'success chance %', 0, 100, 10, 70)}
      <button class="btn pink load">🌐 LoadData()</button>
      <div class="console log" style="margin-top:10px"><span class="empty">// callbacks yahan bolenge</span></div>
    </div></div>`);
  let cb = 'pizza', busy = false;
  const msgs = { pizza: '🔔 Ding dong! Pizza aa gaya!', enemy: '👾 Enemy spawn hua!', door: '🚪 Darwaza khul gaya!' };
  const log = (t, c = '') => { const L = $('.log', el); if (L.querySelector('.empty')) L.innerHTML = ''; L.insertAdjacentHTML('beforeend', `<div class="l ${c} new">${esc(t)}</div>`); L.scrollTop = 1e6; };
  wire(el, 'sec', () => { }); wire(el, 'rate', () => { });
  $$('[data-cb]', el).forEach(b => b.onclick = () => { cb = b.dataset.cb; $$('[data-cb]', el).forEach(x => x.classList.toggle('primary', x === b)); });
  $('.go', el).onclick = ev => {
    if (busy) return; busy = true; Game.demo('callback', ev);
    const s = +$('.sec', el).value, fill = $('.fill', el), txt = $('.txt', el), t0 = performance.now();
    const names = { pizza: 'OnPizzaReady', enemy: 'SpawnEnemy', door: 'OpenDoor' };
    log(`DoAfterDelay(${s}f, ${names[cb]}); — game chalta rahega…`);
    const tick = now => {
      const p = Math.min(1, (now - t0) / (s * 1000));
      fill.style.width = p * 100 + '%'; txt.textContent = p < 1 ? `⏳ ${(s - p * s).toFixed(1)}s` : '📞 callback?.Invoke()!';
      if (p < 1) requestAnimationFrame(tick); else { log(msgs[cb]); Sfx.win(); busy = false; setTimeout(() => { fill.style.width = 0; txt.textContent = 'ready'; }, 1500); }
    };
    requestAnimationFrame(tick);
  };
  $('.load', el).onclick = async ev => {
    Game.demo('callback', ev);
    log('LoadData("https://api.example.com/data", onSuccess, onError) … ⏳');
    await sleep(1200);
    if (Math.random() * 100 < +$('.rate', el).value) { log('onSuccess("Data loaded successfully!") → ✅', ''); Sfx.ok(); }
    else { log('onError("Failed to load data!") → ❌', 'err'); Sfx.bad(); }
  };
};

/* ---------- T11: Mini game — event-driven + gravity + collision ---------- */
DEMOS.miniGame = el => {
  el.innerHTML = demoBox('🎮 Mini Game: Meteor Defense (events + gravity + collision)', `
    <div class="demo-grid" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)"><div>
      <div class="stage"><canvas class="cv" width="640" height="380" style="width:100%;touch-action:none;cursor:crosshair"></canvas></div>
      <div class="btn-row"><button class="btn primary start">▶ GameEvents.FireGameStart()</button></div>
      ${slider('g', 'Gravity (Physics.gravity.y)', 1, 20, 0.5, 6)}
      <p class="muted" style="font-size:13px;margin:0">Meteors ☄️ pe click/tap karo. Zameen se takraye (OnCollisionEnter) toh Player ko damage!</p>
    </div><div>
      <div class="lbl-sm">Subscribers (OnEnable mein +=)</div>
      <div style="display:grid;gap:6px;margin-bottom:10px">
        <label class="toggle"><input type="checkbox" checked data-s="score"><span class="sw"></span> ScoreManager → onEnemyKilled</label>
        <label class="toggle"><input type="checkbox" checked data-s="ui"><span class="sw"></span> GameUI → onScoreChanged</label>
        <label class="toggle"><input type="checkbox" checked data-s="fx"><span class="sw"></span> FloatingText → onEnemyKilled</label>
      </div>
      <div class="lbl-sm">Event flow (live)</div>
      <div class="console log" style="max-height:230px;min-height:230px"><span class="empty">// Start dabao</span></div>
    </div></div>`);
  const cv = $('.cv', el), ctx = cv.getContext('2d'), W = cv.width, H = cv.height, GROUND = H - 40;
  let g = 6, meteors = [], floats = [], score = 0, shownScore = 0, hp = 100, playing = false, spawnT = 0, last = 0, raf, over = false;
  const subs = { score: true, ui: true, fx: true };
  const logEl = $('.log', el);
  const log = (t, c = '') => { if (logEl.querySelector('.empty')) logEl.innerHTML = ''; logEl.insertAdjacentHTML('beforeend', `<div class="l ${c} new">${esc(t)}</div>`); while (logEl.children.length > 40) logEl.firstChild.remove(); logEl.scrollTop = 1e6; };
  wire(el, 'g', v => g = v);
  $$('[data-s]', el).forEach(cb => cb.onchange = () => { subs[cb.dataset.s] = cb.checked; log(`${cb.dataset.s === 'score' ? 'ScoreManager' : cb.dataset.s === 'ui' ? 'GameUI' : 'FloatingText'} ${cb.checked ? 'subscribed (+=)' : 'unsubscribed (-=)'}`, 'warn'); });
  // --- the "event system" ---
  const GameEvents = {
    onEnemyKilled: [], onScoreChanged: [], onPlayerHit: [], onGameOver: [],
    fire(name, ...args) { this[name].forEach(f => f(...args)); }
  };
  GameEvents.onEnemyKilled.push((pts, x, y) => { if (!subs.score) return; score += pts; log(`  ↳ ScoreManager.OnEnemyKilled(${pts}) → score = ${score}`); GameEvents.fire('onScoreChanged', score); });
  GameEvents.onEnemyKilled.push((pts, x, y) => { if (!subs.fx) return; floats.push({ x, y, t: `+${pts}`, life: 1 }); });
  GameEvents.onScoreChanged.push(s => { if (!subs.ui) { log('  ↳ (GameUI ne unsubscribe kiya — score text update NAHI hua!)', 'warn'); return; } shownScore = s; log(`  ↳ GameUI.UpdateScoreUI(${s})`); });
  GameEvents.onPlayerHit.push(d => { hp = Math.max(0, hp - d); log(`  ↳ PlayerHealth.TakeDamage(${d}) → hp = ${hp}`, 'warn'); if (hp <= 0) GameEvents.fire('onGameOver'); });
  GameEvents.onGameOver.push(() => {
    playing = false; over = true; log('📡 GameEvents.onGameOver → GameUI.ShowGameOver()', 'err');
    if (score >= 1000) Game.badge('gamer');
  });
  function start() {
    meteors = []; floats = []; score = 0; shownScore = 0; hp = 100; spawnT = 0; playing = true; over = false; logEl.innerHTML = '';
    log('📡 GameEvents.FireGameStart() → ScoreManager.ResetScore()'); Game.demo('miniGame');
    last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  $('.start', el).onclick = start;
  cv.addEventListener('pointerdown', e => {
    if (!playing) return;
    const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height;
    const m = meteors.find(m => Math.hypot(m.x - x, m.y - y) < m.r + 12);
    if (m) {
      m.dead = true; Sfx.pop();
      log(`💀 Meteor.Die() → GameEvents.FireEnemyKilled(100)`);
      GameEvents.fire('onEnemyKilled', 100, m.x, m.y);
    }
  });
  function loop(now) {
    if (!el.isConnected) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (playing) {
      spawnT -= dt;
      if (spawnT <= 0) { spawnT = Math.max(.45, 1.4 - score / 3000); meteors.push({ x: 30 + Math.random() * (W - 60), y: -20, vy: 0, r: 16 + Math.random() * 8, rot: 0 }); }
      meteors.forEach(m => {
        m.vy += g * 30 * dt; m.y += m.vy * dt; m.rot += dt * 3;
        if (m.y + m.r >= GROUND && !m.dead) { // collision with ground
          m.dead = true; floats.push({ x: m.x, y: GROUND - 10, t: 'BOOM!', life: 1, c: '#ff5470' });
          log('💥 Meteor.OnCollisionEnter(Ground) → onPlayerHit(20)', 'err'); Sfx.bad();
          GameEvents.fire('onPlayerHit', 20);
        }
      });
      meteors = meteors.filter(m => !m.dead);
    }
    floats.forEach(f => { f.y -= 40 * dt; f.life -= dt; }); floats = floats.filter(f => f.life > 0);
    draw();
    raf = requestAnimationFrame(loop);
  }
  function draw() {
    const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#120f2e'); gr.addColorStop(1, '#1d2a4a');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffffff30'; for (let i = 0; i < 40; i++) ctx.fillRect((i * 137) % W, (i * 71) % (GROUND - 20), 2, 2);
    ctx.fillStyle = '#2b3b24'; ctx.fillRect(0, GROUND, W, H - GROUND); ctx.fillStyle = '#4a6b3a'; ctx.fillRect(0, GROUND, W, 5);
    ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.fillText('🏰', W / 2, GROUND + 2);
    meteors.forEach(m => {
      ctx.save(); ctx.translate(m.x, m.y);
      ctx.fillStyle = 'rgba(255,138,61,.25)'; ctx.beginPath(); ctx.ellipse(0, -m.r, m.r * .6, m.r * 1.6, 0, 0, 7); ctx.fill();
      const rg = ctx.createRadialGradient(-m.r * .3, -m.r * .3, 2, 0, 0, m.r); rg.addColorStop(0, '#ffd23f'); rg.addColorStop(.5, '#ff8a3d'); rg.addColorStop(1, '#a8323e');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, m.r, 0, 7); ctx.fill();
      ctx.rotate(m.rot); ctx.fillStyle = 'rgba(80,20,30,.55)'; ctx.beginPath(); ctx.arc(m.r * .35, m.r * .1, m.r * .22, 0, 7); ctx.arc(-m.r * .3, m.r * .35, m.r * .15, 0, 7); ctx.fill(); ctx.restore();
    });
    floats.forEach(f => { ctx.globalAlpha = Math.max(0, f.life); ctx.fillStyle = f.c || '#ffd23f'; ctx.font = 'bold 20px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(f.t, f.x, f.y); ctx.globalAlpha = 1; });
    // UI (GameUI)
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText(`Score: ${shownScore}`, 14, 28);
    if (shownScore !== score) { ctx.fillStyle = '#ff8a3d'; ctx.font = '12px monospace'; ctx.fillText(`(asli score ${score} — UI sun nahi raha!)`, 14, 46); }
    ctx.fillStyle = '#2a1a24'; ctx.fillRect(W - 170, 14, 150, 14); ctx.fillStyle = hp > 60 ? '#2ee59d' : hp > 30 ? '#ffd23f' : '#ff5470'; ctx.fillRect(W - 170, 14, 1.5 * hp, 14);
    ctx.fillStyle = '#fff'; ctx.font = '12px Inter, sans-serif'; ctx.fillText(`HP ${hp}`, W - 210, 26);
    if (!playing) {
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = 'bold 30px Inter, sans-serif'; ctx.fillText(over ? 'GAME OVER 💀' : 'Meteor Defense ☄️', W / 2, H / 2 - 10);
      ctx.font = '15px Inter, sans-serif'; ctx.fillText(over ? `Score: ${score} · Start dabao dobara khelne ke liye` : 'Start button dabao!', W / 2, H / 2 + 22);
    }
  }
  draw();
};

/* ---------- T12: mistakes ---------- */
DEMOS.captureBug = el => {
  el.innerHTML = demoBox('🐛 Lambda capture bug — khud dabake dekho', `
    <div class="demo-grid"><div>
      <label class="toggle"><input type="checkbox" class="fix"><span class="sw"></span> Fix lagao (<code>int index = i;</code>)</label>
      <div class="live-code lc" style="margin-top:10px"></div>
    </div><div>
      <div class="lbl-sm">Buttons — kisi pe bhi click karo</div>
      <div class="bug-btns">${[0, 1, 2, 3, 4].map(i => `<button data-b="${i}">B${i}</button>`).join('')}</div>
      <div class="console log" style="margin-top:10px"><span class="empty">// Debug.Log output</span></div>
    </div></div>`);
  const upd = () => {
    const fx = $('.fix', el).checked;
    $('.lc', el).innerHTML = CS.block(fx ? 'for (int i = 0; i < 5; i++)\n{\n    int index = i; // ✅ local copy\n    buttons[i].onClick.AddListener(() => Debug.Log(index));\n}' : 'for (int i = 0; i < 5; i++)\n{\n    buttons[i].onClick.AddListener(() => Debug.Log(i)); // ❌\n}');
  };
  $('.fix', el).onchange = () => { upd(); $('.log', el).innerHTML = '<span class="empty">// Debug.Log output</span>'; Game.demo('capture'); };
  $$('[data-b]', el).forEach(b => b.onclick = ev => {
    const fx = $('.fix', el).checked, i = +b.dataset.b, L = $('.log', el);
    if (L.querySelector('.empty')) L.innerHTML = '';
    L.insertAdjacentHTML('beforeend', fx ? `<div class="l new">B${i} clicked → ${i} ✅</div>` : `<div class="l err new">B${i} clicked → 5 ${i === 5 ? '' : '(expected ' + i + ') ❌'}</div>`);
    L.scrollTop = 1e6; fx ? Sfx.ok() : Sfx.bad(); Game.demo('capture', ev);
  });
  upd();
};

DEMOS.leakDemo = el => {
  el.innerHTML = demoBox('🧟 Duplicate subscribe / Memory leak simulator', `
    <div class="demo-grid"><div>
      <div class="ctrl"><label>Subscribe kahan karte ho?</label>
        <div class="btn-row md"><button class="btn small primary" data-m="start">❌ Start() mein (bina -=)</button><button class="btn small" data-m="enable">✅ OnEnable / OnDisable</button></div></div>
      <div class="btn-row"><button class="btn small reload">🔄 UI disable → enable karo (scene reload)</button><button class="btn pink small die">☠️ onDeath fire karo</button></div>
      <div class="live-code lc"></div>
    </div><div>
      <div class="lbl-sm">onDeath ki subscriber list</div>
      <div class="w-chips chips" style="min-height:44px"></div>
      <div class="console log" style="margin-top:10px"><span class="empty">// output</span></div>
    </div></div>`);
  let mode = 'start', list = ['HandleDeath'];
  const draw = () => {
    $('.chips', el).innerHTML = '<span class="dname">onDeath =</span>' + (list.length ? list.map(x => `<span class="c">${x}</span>`).join('') : '<span class="muted">null</span>');
    $('.lc', el).innerHTML = CS.block(mode === 'start' ? 'void Start()\n{\n    player.onDeath += HandleDeath; // -= kabhi nahi!\n}' : 'void OnEnable()  { player.onDeath += HandleDeath; }\nvoid OnDisable() { player.onDeath -= HandleDeath; }');
  };
  $$('[data-m]', el).forEach(b => b.onclick = () => { mode = b.dataset.m; list = ['HandleDeath']; $$('[data-m]', el).forEach(x => x.classList.toggle('primary', x === b)); $('.log', el).innerHTML = ''; draw(); });
  $('.reload', el).onclick = ev => {
    Game.demo('leak', ev);
    if (mode === 'start') list.push('HandleDeath (zombie 🧟)');
    else { list = []; draw(); setTimeout(() => { list = ['HandleDeath']; draw(); }, 400); }
    draw();
  };
  $('.die', el).onclick = ev => {
    Game.demo('leak', ev);
    const L = $('.log', el); L.innerHTML = '';
    list.forEach((x, i) => L.insertAdjacentHTML('beforeend', `<div class="l ${i ? 'err' : ''} new">${i ? 'HandleDeath() DOBARA chala! Game Over screen ×' + (i + 1) + ' 😵' : 'HandleDeath() → Game Over screen'}</div>`));
    if (list.length > 1) L.insertAdjacentHTML('beforeend', `<div class="l warn new">⚠ ${list.length} baar chala! Purane (destroyed) objects bhi memory mein atke hain = MEMORY LEAK</div>`);
  };
  draw();
};
