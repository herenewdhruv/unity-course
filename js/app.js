/* ==========================================================
   APP — sidebar, routing, topic rendering, quiz, progress,
   celebrations, modals
   ========================================================== */
(() => {
  const main = $('#main'), side = $('#sidebar');
  const SEC_IDS = ['kya', 'kyun', 'kaise', 'game', 'quiz'];
  let curTopic = null, observer = null;
  const S = () => Game.S;

  /* ---------------- header & sidebar ---------------- */
  function updateHeader() {
    const s = S(), lv = Game.level();
    $('#xpN').textContent = s.xp;
    $('#lvlN').textContent = lv.n;
    $('#streakN').textContent = s.streak.n;
    $('#badgeN').textContent = Object.keys(s.badges).length;
    const done = TOPICS.filter(t => s.done[t.id]).length;
    const pct = Math.round(done / TOPICS.length * 100);
    $('#topPct').textContent = `${done}/${TOPICS.length} topics · ${pct}%`;
    $('#topBar').style.width = pct + '%';
    const ring = $('.ring', side);
    if (ring) { ring.style.setProperty('--p', pct); $('span', ring).textContent = pct + '%'; $('.ring-txt', side).innerHTML = `<b>${lv.name}</b><br>${lv.next ? `${lv.next - s.xp} XP to next level` : 'MAX level! 👑'}`; }
    TOPICS.forEach(t => {
      const it = $(`.topic-item[data-t=${t.id}]`, side); if (!it) return;
      it.classList.toggle('done', !!s.done[t.id]);
      $('.num', it).textContent = s.done[t.id] ? '✓' : t.icon;
      SEC_IDS.forEach(sid => { const li = $(`li[data-s=${sid}]`, it); if (li) li.classList.toggle('seen', !!s.seen[t.id + ':' + sid]); });
    });
  }
  ['#chipXp', '#chipStreak'].forEach(id => $(id).addEventListener('animationend', e => e.currentTarget.classList.remove('bump')));
  let lastXp = S().xp;
  Game.on(s => {
    if (s.xp !== lastXp) { $('#chipXp').classList.remove('bump'); void $('#chipXp').offsetWidth; $('#chipXp').classList.add('bump'); lastXp = s.xp; }
    updateHeader();
  });

  function buildSidebar() {
    side.innerHTML = `
      <div class="side-head"><h4>Course content</h4><div class="course-name">Part 15 · C# Functions, Delegates &amp; Events</div>
        <div class="ring-row"><div class="ring"><span>0%</span></div><div class="muted ring-txt"></div></div></div>
      ${TOPICS.map((t, i) => `
        <div class="topic-item" data-t="${t.id}">
          <button class="topic-btn" data-go="${t.id}"><span class="num">${t.icon}</span>
            <span class="tt">${i}. ${esc(t.short)}<small>${t.part ? 'Part ' + t.part + ' · ' : ''}${t.mins} min</small></span><span class="caret">▶</span></button>
          <ul class="steps">${SEC_IDS.map(sid => `<li data-s="${sid}"><button data-go="${t.id}" data-sec="${sid}"><span class="dot"></span>${SECTION_META[sid][0]} ${SECTION_META[sid][1]}</button></li>`).join('')}</ul>
        </div>`).join('')}
      <div style="padding:16px 10px"><button class="btn small" id="resetBtn">♻️ Progress reset karo</button></div>`;
    side.addEventListener('click', e => {
      const b = e.target.closest('[data-go]'); if (!b) return;
      const t = b.dataset.go, sec = b.dataset.sec;
      if (!sec && curTopic && curTopic.id === t) { $(`.topic-item[data-t=${t}]`, side).classList.toggle('open'); return; }
      location.hash = sec ? `${t}/${sec}` : t;
      document.body.classList.remove('nav-open');
    });
    $('#resetBtn').onclick = () => { if (confirm('Pakka? Saara XP, badges aur progress delete ho jayega.')) Game.reset(); };
  }

  /* ---------------- topic page ---------------- */
  function sectionHtml(t, sid, k) {
    const [ic, title] = SECTION_META[sid];
    const body = sid === 'quiz' ? quizHtml(t) : t[sid];
    const speak = sid !== 'quiz' ? `<button class="btn small spk" style="margin-left:auto" title="Sirf ye section suno">🔊</button>` : '';
    return `<section class="section" id="sec-${sid}" data-s="${sid}">
      <div class="sec-head"><div class="badge-n">${ic}</div><div><div class="kicker">Step ${k + 1} of 5</div><h2>${title}</h2></div>${speak}</div>
      <div class="sec-body">${body}</div></section>`;
  }
  function quizHtml(t) {
    return `<p class="muted">Har sahi jawab = <b>+20 XP</b>. Galat pe bhi +5 (koshish ki na! 😄). Saare sawaal karo toh topic complete 🎉</p>` +
      t.quiz.map((q, i) => `<div class="quiz-q" data-q="${i}"><h4><span class="qn">Q${i + 1}.</span><span>${q.q}</span></h4>
        <div class="opts">${q.o.map((o, j) => `<button class="opt" data-o="${j}"><span class="k">${'ABCD'[j]}</span><span>${o}</span></button>`).join('')}</div></div>`).join('') +
      `<div class="quiz-foot"><span class="score-pill">Score: <span class="qs">0</span>/${t.quiz.length}</span><button class="btn small qreset">🔁 Quiz dobara (practice)</button></div>`;
  }
  function render(tid, sec) {
    Speaker.stop();
    const idx = Math.max(0, TOPICS.findIndex(t => t.id === tid));
    const t = TOPICS[idx];
    curTopic = t;
    Game.setLast(t.id, sec || null);
    $$('.topic-item', side).forEach(it => { const me = it.dataset.t === t.id; it.classList.toggle('active', me); if (me) it.classList.add('open'); else it.classList.remove('open'); });
    const s = S();
    const next = TOPICS[idx + 1], prev = TOPICS[idx - 1];
    const welcome = render.first && s.xp > 0 && !location.hash.includes('/') ? `<div class="welcome-card"><span style="font-size:28px">👋</span><div style="flex:1"><b>Welcome back bro!</b> <span class="muted">Tum ${S().streak.n} din se lage ho. Wahi se shuru karte hain jahan chhoda tha.</span></div></div>` : '';
    render.first = false;
    main.innerHTML = `${welcome}
      <div class="crumbs">Course › Part 15 › Topic ${idx} of ${TOPICS.length - 1}</div>
      <div class="hero" data-icon="${t.icon}">
        <span class="tag">${t.part ? 'Part ' + t.part : 'Intro'} · ⏱ ${t.mins} min</span>
        <h1>${t.icon} ${t.title}</h1><p>${t.intro}</p>
        <div class="hero-actions"><button class="btn pink" id="speakAll">🔊 Sun ke samjho</button>
          <span class="meta-pill">${s.done[t.id] ? '✅ Complete' : '+50 XP topic complete karne pe'}</span>
          <span class="meta-pill">🧠 ${t.quiz.length} quiz questions</span></div>
      </div>
      ${SEC_IDS.map((sid, k) => sectionHtml(t, sid, k)).join('')}
      <div class="next-card">
        <div><h3>${next ? `Agla: ${next.icon} ${next.short}` : '🏁 Chapter khatam!'}</h3><p>${next ? next.intro : 'Badges check karo aur kisi bhi topic pe wapas jaake revise karo.'}</p></div>
        <div class="btn-row">${prev ? `<button class="btn" data-nav="${prev.id}">◀ Pichla</button>` : ''}${next ? `<button class="btn" data-nav="${next.id}">Agla topic ▶</button>` : '<button class="btn" id="showBadges2">🎖️ Badges dekho</button>'}</div>
      </div>
      <div class="footer">Based on "Unity C# Mega Cheat Sheet · Part 15" · Progress tumhare browser mein save hota hai 💾</div>`;
    // mount interactive bits
    $$('[data-anim]', main).forEach(el => new CodeAnim(el, ANIMS[el.dataset.anim]));
    $$('[data-demo]', main).forEach(el => { el.classList.add('demo'); DEMOS[el.dataset.demo](el); });
    $$('[data-editor]', main).forEach(el => new UnityEditor(el, EDITOR_PRESETS[el.dataset.editor]));
    bindQuiz(t);
    $$('[data-nav]', main).forEach(b => b.onclick = () => location.hash = b.dataset.nav);
    const sb2 = $('#showBadges2'); if (sb2) sb2.onclick = showBadges;
    $('#speakAll').onclick = e => Speaker.read(speakables(main), e.currentTarget);
    $$('.spk', main).forEach(b => b.onclick = () => Speaker.read(speakables(b.closest('.section')), b));
    observe(t);
    updateHeader();
    if (sec) { const el = $('#sec-' + sec); if (el) { el.classList.add('in'); setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); } }
    else window.scrollTo({ top: 0 });
  }
  render.first = true;

  function speakables(root) {
    const heads = root === main ? [$('.hero h1', main), $('.hero p', main)] : [];
    return heads.concat($$('.sec-head h2, .sec-body p, .sec-body li, .sec-body .analogy', root)
      .filter(el => !el.closest('.demo, .anim, .ue, table, .quiz-q, [data-s=quiz]') && !(el.tagName === 'P' && el.closest('li'))));
  }

  /* ---------------- section seen tracking ---------------- */
  function observe(t) {
    if (observer) observer.disconnect();
    const timers = {};
    observer = new IntersectionObserver(entries => entries.forEach(en => {
      const sid = en.target.dataset.s;
      if (en.isIntersecting) {
        en.target.classList.add('in');
        $$(`.topic-item[data-t=${t.id}] li`, side).forEach(li => li.classList.toggle('cur', li.dataset.s === sid));
        timers[sid] = setTimeout(() => { if (Game.seen(t.id + ':' + sid)) updateHeader(); }, 1500);
      } else clearTimeout(timers[sid]);
    }), { threshold: 0.18 });
    $$('.section', main).forEach(s => observer.observe(s));
  }

  /* ---------------- quiz ---------------- */
  function bindQuiz(t) {
    const box = $('#sec-quiz', main);
    const ans = S().quiz[t.id] || (S().quiz[t.id] = {});
    const paint = (qi, chosen, animate) => {
      const q = t.quiz[qi], card = $(`.quiz-q[data-q="${qi}"]`, box);
      $$('.opt', card).forEach((b, j) => {
        b.disabled = true;
        if (j === q.a) b.classList.add('right');
        if (j === chosen && j !== q.a) b.classList.add('wrong');
        if (!animate) b.style.animation = 'none';
      });
      if (!$('.why', card)) card.insertAdjacentHTML('beforeend', `<div class="why">${chosen === q.a ? '✅ <b>Sahi jawab!</b> ' : '❌ <b>Oops!</b> '}${q.why}</div>`);
    };
    const score = () => { $('.qs', box).textContent = t.quiz.filter((q, i) => ans[i] === q.a).length; };
    Object.keys(ans).forEach(i => paint(+i, ans[i], false));
    score();
    box.addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b || b.disabled) return;
      const qi = +b.closest('.quiz-q').dataset.q, j = +b.dataset.o, q = t.quiz[qi];
      const practice = box.dataset.practice === '1';
      if (!practice) ans[qi] = j;
      paint(qi, j, true);
      if (j === q.a) { Sfx.ok(); if (!practice) Game.addXp(20, e); }
      else { Sfx.bad(); if (!practice) Game.addXp(5, e); }
      Game.save(); score();
      const answered = Object.keys(ans).length;
      if (!practice && answered === t.quiz.length && !S().done[t.id]) completeTopic(t);
    });
    $('.qreset', box).onclick = () => {
      box.dataset.practice = '1';
      $$('.quiz-q', box).forEach(c => { $$('.opt', c).forEach(b => { b.disabled = false; b.classList.remove('right', 'wrong'); b.style.animation = ''; }); const w = $('.why', c); if (w) w.remove(); });
      toast('🔁 Practice mode — ab XP nahi milega, par seekhna milega 😉');
    };
  }

  function completeTopic(t) {
    const s = S();
    s.done[t.id] = Date.now();
    const correct = t.quiz.filter((q, i) => s.quiz[t.id][i] === q.a).length;
    Game.save();
    setTimeout(() => {
      Game.addXp(50);
      if (correct === t.quiz.length) Game.badge('quiz100');
      const doneN = TOPICS.filter(x => s.done[x.id]).length;
      if (doneN >= Math.ceil(TOPICS.length / 2)) Game.badge('half');
      if (doneN === TOPICS.length) Game.badge('hero');
      celebrate(t, correct);
    }, 700);
  }

  /* ---------------- modals ---------------- */
  const modalBg = $('#modalBg'), modal = $('#modal');
  function openModal(html) { modal.innerHTML = html; modalBg.classList.add('show'); }
  function closeModal() { modalBg.classList.remove('show'); }
  modalBg.addEventListener('click', e => { if (e.target === modalBg || e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function celebrate(t, correct) {
    Confetti.burst(220); Sfx.win();
    const idx = TOPICS.indexOf(t), next = TOPICS[idx + 1], lv = Game.level();
    const msgs = ['Ekdum jhakaas! 🔥', 'Bhai tu toh pro nikla! 😎', 'Kya baat hai! 🚀', 'Unity ka future star ⭐', 'Lage raho, mast ja rahe ho! 💪'];
    openModal(`<div class="big">🏆</div><h2>Topic Complete!</h2><p>${t.icon} <b>${t.title}</b><br>${msgs[idx % msgs.length]}</p>
      <div class="reward"><span class="chip">⚡ +50 XP bonus</span><span class="chip">🧠 Quiz ${correct}/${t.quiz.length}</span><span class="chip">🏆 Lv ${lv.n}</span></div>
      <div class="bar" style="margin-bottom:6px"><i style="width:${lv.next ? (S().xp - lv.cur) / (lv.next - lv.cur) * 100 : 100}%"></i></div>
      <p style="font-size:13px">${lv.name}${lv.next ? ` · ${lv.next - S().xp} XP to next level` : ''}</p>
      <div class="btn-row" style="justify-content:center">${next ? `<button class="btn primary" id="mNext">Agla topic: ${next.icon} ${next.short} ▶</button>` : `<button class="btn primary" data-close>👑 Course complete!</button>`}<button class="btn" data-close>Yahin ruko</button></div>`);
    const b = $('#mNext'); if (b) b.onclick = () => { closeModal(); location.hash = next.id; };
  }
  function showBadges() {
    const s = S();
    openModal(`<div class="big" style="font-size:48px">🎖️</div><h2>Tumhare Badges</h2><p>${Object.keys(s.badges).length} / ${Object.keys(BADGES).length} unlock kiye</p>
      <div class="badge-grid">${Object.entries(BADGES).map(([k, b]) => `<div class="bdg ${s.badges[k] ? 'got' : 'locked'}"><span class="e">${b[0]}</span><b>${b[1]}</b><small>${b[2]}</small></div>`).join('')}</div>
      <button class="btn primary" data-close>Close</button>`);
  }
  function showLevels() {
    const lv = Game.level();
    openModal(`<div class="big" style="font-size:48px">🏆</div><h2>Level ${lv.n}</h2><p>${S().xp} XP · ${lv.name}</p>
      <div class="lvl-list">${LEVELS.map((l, i) => `<div class="${i + 1 === lv.n ? 'me' : ''}"><span>Lv ${i + 1} · ${l[1]}</span><span class="muted">${l[0]} XP</span></div>`).join('')}</div>
      <p style="font-size:13px">XP kaise milta hai: section padho +10 · demo try karo +10 · animation poora dekho +15 · sahi jawab +20 · topic complete +50</p>
      <button class="btn primary" data-close>Chalo XP kamate hain!</button>`);
  }
  $('#chipBadges').onclick = showBadges;
  $('#chipLvl').onclick = showLevels;

  /* ---------------- mobile nav ---------------- */
  $('#burger').onclick = () => document.body.classList.toggle('nav-open');
  $('#scrim').onclick = () => document.body.classList.remove('nav-open');

  /* ---------------- routing ---------------- */
  function route() {
    const [t, sec] = location.hash.slice(1).split('/');
    if (t && TOPICS.some(x => x.id === t)) {
      if (curTopic && curTopic.id === t && sec) { const el = $('#sec-' + sec); if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; } }
      render(t, sec);
    } else {
      const last = S().last;
      render(last ? last.t : 't0', last && last.s);
    }
  }
  window.addEventListener('hashchange', route);

  buildSidebar();
  Game.checkStreak();
  route();
  updateHeader();
})();
