document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Interactive Background Particle Network Canvas
  const canvas = document.getElementById('network-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const count = Math.min(Math.floor(width / 30), 50);
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.8
    }));

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    (function drawNetwork() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 135) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.13 * (1 - dist / 135)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawNetwork);
    })();
  }

  // 3. Typewriter Effect
  (function () {
    const words = [
      "Cloud-Native Platforms.",
      "Kubernetes Infrastructure.",
      "LLM-Powered Automation.",
      "AI-Augmented SRE Tooling."
    ];
    const target = document.getElementById('typewriter');
    if (!target) return;
    if (reduceMotion) { target.textContent = words[0]; return; }
    let i = 0, j = 0, del = false;
    (function loop() {
      const cur = words[i];
      target.textContent = cur.substring(0, j);
      if (!del && j < cur.length) { j++; setTimeout(loop, 75); }
      else if (del && j > 0) { j--; setTimeout(loop, 40); }
      else { del = !del; if (!del) i = (i + 1) % words.length; setTimeout(loop, del ? 1600 : 300); }
    })();
  })();

  // 4. Card Spotlight Hover
  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
    });
  });

  // 5. Scroll Reveal
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // 6. Count-up Stats
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      countObs.unobserve(el);
      const end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      if (reduceMotion) { el.textContent = pre + end + suf; return; }
      const t0 = performance.now(), dur = 1200;
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(end * eased) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  // 7. Active Nav + Progress Bar + Back to Top
  const sections = ['about', 'experience', 'projects', 'certifications', 'skills', 'education']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const links = document.querySelectorAll('.nav-link');
  const bar = document.getElementById('progress');
  const toTop = document.getElementById('toTop');

  function onScroll() {
    const h = document.documentElement;
    if (bar) bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    if (toTop) toTop.classList.toggle('hidden', h.scrollTop < 600);
    let current = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top < 140) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  // 8. Mobile Menu
  const menuBtn = document.getElementById('menuBtn'), menu = document.getElementById('mobileMenu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden') === false;
      menuBtn.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // 9. Copy Email Button
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const label = document.getElementById('copyLabel');
      try {
        await navigator.clipboard.writeText('shannmuka@gmail.com');
        label.textContent = 'Copied ✓';
      } catch {
        label.textContent = 'shannmuka@gmail.com';
        window.location.href = 'mailto:shannmuka@gmail.com';
        return;
      }
      setTimeout(() => label.textContent = 'shannmuka@gmail.com', 1600);
    });
  }

  // 10. Live Skill Filter
  const filter = document.getElementById('skillFilter');
  const empty = document.getElementById('skillEmpty');
  if (filter && empty) {
    filter.addEventListener('input', () => {
      const q = filter.value.trim().toLowerCase();
      let total = 0;
      document.querySelectorAll('#skillGrid > div').forEach(card => {
        let hits = 0;
        card.querySelectorAll('.skill').forEach(s => {
          const m = !q || s.textContent.toLowerCase().includes(q);
          s.classList.toggle('opacity-20', !m);
          s.classList.toggle('ring-1', !!q && m);
          s.classList.toggle('ring-emerald-400/60', !!q && m);
          if (m) hits++;
        });
        card.classList.toggle('hidden', q && hits === 0);
        total += hits;
      });
      empty.classList.toggle('hidden', !q || total > 0);
    });
  }

  // 11. Command Palette (Ctrl+K / Cmd+K)
  (function () {
    const box = document.getElementById('cmdk'), input = document.getElementById('cmdInput'), list = document.getElementById('cmdList');
    if (!box || !input || !list) return;
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const cmdKey = document.getElementById('cmdKey');
    if (cmdKey) cmdKey.textContent = isMac ? '⌘ K' : 'Ctrl K';
    const go = id => () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); };
    const open = url => () => window.open(url, '_blank', 'noopener');
    const ITEMS = [
      { l: 'Impact', h: 'section', a: go('about') },
      { l: 'Experience', h: 'section', a: go('experience') },
      { l: 'Architecture', h: 'section', a: go('projects') },
      { l: 'Credentials', h: 'section', a: go('certifications') },
      { l: 'Tech Stack', h: 'section', a: go('skills') },
      { l: 'Education', h: 'section', a: go('education') },
      { l: 'Contact', h: 'section', a: go('contact') },
      { l: 'Download resume', h: 'action', a: () => document.querySelector('a[download]').click() },
      { l: 'Copy email', h: 'action', a: () => document.getElementById('copyEmail').click() },
      { l: 'Open LinkedIn', h: 'link', a: open('https://www.linkedin.com/in/buddabathinis/') },
      { l: 'Open GitHub', h: 'link', a: open('https://github.com/sudo-shann') },
      { l: 'Open Medium', h: 'link', a: open('https://medium.com/@shannmuka') }
    ];
    let shown = ITEMS, sel = 0, last = null;
    function draw() {
      list.innerHTML = '';
      shown.forEach((it, i) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', i === sel);
        li.className = 'flex justify-between items-center px-5 py-2.5 text-sm cursor-pointer ' + (i === sel ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300');
        li.innerHTML = '<span></span><span class="text-[11px] mono text-slate-500"></span>';
        li.children[0].textContent = it.l;
        li.children[1].textContent = it.h;
        li.addEventListener('mousemove', () => { if (sel !== i) { sel = i; draw(); } });
        li.addEventListener('click', () => run(i));
        list.appendChild(li);
      });
      if (!shown.length) list.innerHTML = '<li class="px-5 py-3 text-sm mono text-slate-500">No matches</li>';
    }
    function run(i) { const it = shown[i]; if (!it) return; close(); setTimeout(it.a, 50); }
    function show() { last = document.activeElement; box.classList.remove('hidden'); box.classList.add('flex'); input.value = ''; shown = ITEMS; sel = 0; draw(); input.focus(); }
    function close() { box.classList.add('hidden'); box.classList.remove('flex'); if (last && last.focus) last.focus(); }
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      shown = ITEMS.filter(x => (x.l + ' ' + x.h).toLowerCase().includes(q));
      sel = 0;
      draw();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); draw(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
      else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
    });
    box.addEventListener('mousedown', e => { if (e.target === box) close(); });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); box.classList.contains('hidden') ? show() : close(); }
      else if (e.key === 'Escape' && !box.classList.contains('hidden')) close();
    });
    const cmdOpen = document.getElementById('cmdOpen');
    if (cmdOpen) cmdOpen.addEventListener('click', show);
  })();

  // 12. Alert Controller Interactive Architecture Flow Player
  (function () {
    const svg = document.getElementById('alertSvg'); if (!svg) return;
    const cap = document.getElementById('flowCap'), stp = document.getElementById('flowStep');
    const play = document.getElementById('flowPlay');
    const FLOWS = {
      A: [
        { n: ['callers','api','ctl'], e: ['e1','e3'], t: "A team creates a maintenance exception through the API. It returns an exception ID and a one-time approval token." },
        { n: ['ctl','biz','dbh','tbl','s-pending'], e: ['e4','e5','e6'], t: "The exception is stored with status pending, together with its approval token." },
        { n: ['biz'], e: [], t: "For application-level exceptions, an approval request goes to the owning team." },
        { n: ['callers','api','ctl','biz'], e: ['e1','e3','e4'], t: "The approver submits the exception ID and token, and the service validates them." },
        { n: ['biz','dbh','tbl','s-scheduled'], e: ['e5','e6'], t: "On success the exception moves to scheduled." },
        { n: ['sched','s-scheduled','s-active','s-completed'], e: [], t: "An external scheduler moves it from scheduled to active to completed. Suppression only applies while an exception is active." }
      ],
      B: [
        { n: ['hook','api','ctl'], e: ['e2','e3'], t: "The monitoring webhook posts the alert payload. A required routing label is validated, and requests without one are rejected." },
        { n: ['ctl','biz'], e: ['e4'], t: "Labels are normalized into candidate scopes: messaging, VM platform, container platform and database." },
        { n: ['biz','llm'], e: ['e8'], t: "The LLM enrichment layer classifies the alert and infers application context." },
        { n: ['biz','dbh','tbl'], e: ['e5','e6'], t: "For each candidate scope the service looks for an active exception for that team. Matching is case-insensitive and supports wildcards. No match leaves the alert untouched." },
        { n: ['biz','xmc','xm'], e: ['e7','e9'], t: "On a match, the paging platform is queried for the team's active events, and each is compared with the incoming scope." },
        { n: ['xmc','xm','tbl'], e: ['e7','e9'], t: "Matched events are annotated, terminated and written to an audit log, so nobody is paged." },
        { n: ['xm','oncall'], e: ['e10'], t: "Unmatched events stay active and are returned as escalated, so on-call is still paged." },
        { n: ['callers','api','ctl'], e: ['e1','e3'], t: "The response lists suppressed and escalated events, and callers can read back the suppression record for any exception." }
      ]
    };
    let flow = 'B', i = 0, timer = null;
    const $ = id => svg.querySelector('#' + id);
    function render() {
      svg.querySelectorAll('.on').forEach(el => { el.classList.remove('on'); if (el.matches('.ed')) el.setAttribute('marker-end', 'url(#arrOff)'); });
      const s = FLOWS[flow][i];
      svg.classList.add('playing');
      s.n.forEach(id => { const el = $('n-' + id); if (el) el.classList.add('on'); });
      s.e.forEach(id => { const el = $(id); if (el) { el.classList.add('on'); el.setAttribute('marker-end', 'url(#arrOn)'); } });
      stp.textContent = flow + ' · ' + (i + 1) + '/' + FLOWS[flow].length;
      cap.textContent = s.t;
      document.querySelectorAll('.flow-tab').forEach(b => {
        const on = b.dataset.flow === flow;
        b.setAttribute('aria-pressed', on);
        b.classList.toggle('border-emerald-400', on); b.classList.toggle('text-emerald-300', on);
      });
    }
    function stop() { clearInterval(timer); timer = null; play.textContent = (i === FLOWS[flow].length - 1) ? 'Replay' : 'Play'; }
    function next() { if (i < FLOWS[flow].length - 1) { i++; render(); if (i === FLOWS[flow].length - 1) stop(); } }
    function start() { if (i === FLOWS[flow].length - 1) { i = 0; render(); } clearInterval(timer); timer = setInterval(next, 3500); play.textContent = 'Pause'; }
    play.addEventListener('click', () => timer ? stop() : start());
    document.getElementById('flowNext').addEventListener('click', () => { stop(); if (i < FLOWS[flow].length - 1) i++; render(); play.textContent = 'Play'; });
    document.getElementById('flowPrev').addEventListener('click', () => { stop(); if (i > 0) i--; render(); play.textContent = 'Play'; });
    document.querySelectorAll('.flow-tab').forEach(b => b.addEventListener('click', () => { flow = b.dataset.flow; i = 0; render(); reduceMotion ? stop() : start(); }));
    render(); stop(); play.textContent = 'Play';
    if (!reduceMotion) new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { o.disconnect(); start(); } }, { threshold: 0.4 }).observe(svg);
  })();

  // 13. Multi-Tenant Cloud Governance & JIT Interactive Flow Player
  (function () {
    const svg = document.getElementById('pttSvg'); if (!svg) return;
    const cap = document.getElementById('pttCap'), stp = document.getElementById('pttStep');
    const play = document.getElementById('pttPlay');
    const FLOWS = {
      A: [
        { n: ['p-devops','p-pillars','p-files'], e: ['pe5','pe9'], t: "Custom and built-in Azure Policy JSON definitions across 8 security pillars are published by Azure DevOps pipelines (authenticated via Service Principals) into the Management Plane's auto-rollout and manual-rollout file shares." },
        { n: ['p-files','p-mjobs','p-kv'], e: ['pe6','pe8'], t: "The Sync Engine retrieves storage credentials from Azure Key Vault using its Managed Identity and reads the queued policy definitions." },
        { n: ['p-mjobs','p-sstore'], e: ['pe10'], t: "The Management Plane distributes policy definitions and rollout jobs across tenant boundaries into each onboarded division's local Service Plane queue." },
        { n: ['p-sstore','p-sweb','p-sumsi'], e: ['pe11','pe13'], t: "The Service Plane Policy Worker pulls the queued jobs and authenticates via a least-privilege Managed Identity holding the Resource Policy Contributor role." },
        { n: ['p-sumsi','p-subs','p-cat1','p-cat2','p-cat3','p-cat4'], e: ['pe14'], t: "Policies are enforced across 70,000+ subscriptions—covering Entra ID-only auth, PIM/least privilege, TLS 1.2+/TDE encryption, Defender for Cloud, DDoS/WAF, and Classic-to-ARM migration—cutting rollout time by 50%." }
      ],
      B: [
        { n: ['p-stree','p-mjobs','p-cosmos'], e: ['pe4','pe3'], t: "Onboarded divisions register their organizational directory ID. The Sync Engine automatically pulls tenant, service, and subscription hierarchies into Azure Cosmos DB." },
        { n: ['p-subs','p-sweb','p-sstore'], e: ['pe11','pe14'], t: "Inside each onboarded tenant, the Policy Worker continuously scans subscription and resource compliance against assigned security policies." },
        { n: ['p-sweb','p-mapi','p-cosmos'], e: ['pe15','pe3'], t: "Compliance results report back to the central Orchestrator API and are stored in Cosmos DB, driving 99% resource compliance and a 50% reduction in security incidents." },
        { n: ['p-mapi','p-bot','p-teams'], e: ['pe2','pe1'], t: "The Orchestrator API sends real-time compliance and deployment notifications to service owners and security admins in Microsoft Teams and Outlook." },
        { n: ['p-teams','p-bot','p-mapi','p-sweb','p-subs'], e: ['pe1','pe2','pe15','pe14'], t: "Because the Management Plane is decoupled from the Service Plane, admins retain central control to trigger manual policy rollouts or instant rollbacks across any onboarded subscription via the Teams ChatOps Bot." }
      ],
      C: [
        { n: ['p-teams','p-bot','p-stree'], e: ['pe1'], t: "Engineers request Just-In-Time (JIT) privilege elevation in Microsoft Teams. The ChatOps Bot enforces OAuth 2.0 Zero-Trust Conditional Access (hardened admin workstations) and verifies reporting hierarchy via Microsoft Graph." },
        { n: ['p-bot','p-mapi','p-cosmos','p-kv'], e: ['pe2','pe3','pe8'], t: "The Bot forwards the request to the Orchestrator API, which validates subscription ownership and JIT policy rules in Cosmos DB." },
        { n: ['p-mapi','p-sfunc','p-sstore'], e: ['pe16','pe12'], t: "Upon approval, the Management Plane triggers the serverless JIT Access Function in the target Service Plane via the local JIT request queue." },
        { n: ['p-sfunc','p-sumsi','p-subs','p-cat1'], e: ['pe13','pe14'], t: "The Function App assumes a dedicated JIT Managed Identity with the User Access Administrator role to grant time-bound RBAC access, eliminating permanent standing privileges." },
        { n: ['p-mapi','p-bot','p-teams'], e: ['pe2','pe1'], t: "Once time-bound JIT access is provisioned (or automatically revoked upon expiration), the requester and approvers receive an instant confirmation in Microsoft Teams." }
      ]
    };
    let flow = 'A', i = 0, timer = null;
    const $ = id => svg.querySelector('#' + id);
    function render() {
      svg.querySelectorAll('.on').forEach(el => { el.classList.remove('on'); if (el.matches('.ed')) el.setAttribute('marker-end', 'url(#pttArrOff)'); });
      const s = FLOWS[flow][i];
      svg.classList.add('playing');
      s.n.forEach(id => { const el = $('n-' + id); if (el) el.classList.add('on'); });
      s.e.forEach(id => { const el = $(id); if (el) { el.classList.add('on'); el.setAttribute('marker-end', 'url(#pttArrOn)'); } });
      stp.textContent = flow + ' · ' + (i + 1) + '/' + FLOWS[flow].length;
      cap.textContent = s.t;
      document.querySelectorAll('.ptt-tab').forEach(b => {
        const on = b.dataset.pttFlow === flow;
        b.setAttribute('aria-pressed', on);
        b.classList.toggle('border-cyan-400', on); b.classList.toggle('text-cyan-300', on);
      });
    }
    function stop() { clearInterval(timer); timer = null; play.textContent = (i === FLOWS[flow].length - 1) ? 'Replay' : 'Play'; }
    function next() { if (i < FLOWS[flow].length - 1) { i++; render(); if (i === FLOWS[flow].length - 1) stop(); } }
    function start() { if (i === FLOWS[flow].length - 1) { i = 0; render(); } clearInterval(timer); timer = setInterval(next, 3800); play.textContent = 'Pause'; }
    play.addEventListener('click', () => timer ? stop() : start());
    document.getElementById('pttNext').addEventListener('click', () => { stop(); if (i < FLOWS[flow].length - 1) i++; render(); play.textContent = 'Play'; });
    document.getElementById('pttPrev').addEventListener('click', () => { stop(); if (i > 0) i--; render(); play.textContent = 'Play'; });
    document.querySelectorAll('.ptt-tab').forEach(b => b.addEventListener('click', () => { flow = b.dataset.pttFlow; i = 0; render(); reduceMotion ? stop() : start(); }));
    render(); stop(); play.textContent = 'Play';
    if (!reduceMotion) new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { o.disconnect(); start(); } }, { threshold: 0.35 }).observe(svg);
  })();
});
