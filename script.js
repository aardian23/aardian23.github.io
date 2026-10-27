(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
 
/* ===== THEME (tersimpan di localStorage) ===== */
const themeBtn = $("#themeBtn");
const setTheme = t => { root.setAttribute("data-theme", t); themeBtn.setAttribute("aria-pressed", t === "light"); try { localStorage.setItem("theme", t); } catch (e) {} };
themeBtn.setAttribute("aria-pressed", root.dataset.theme === "light");
themeBtn.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
 
/* ===== NAVBAR ===== */
const header = $("header"), burger = $("#burger"), menu = $("#menu");
const setMenu = open => {
  menu.classList.toggle("open", open); root.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
const closeMenu = () => setMenu(false);
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
addEventListener("resize", () => { if (innerWidth >= 1024) closeMenu(); });
$$("#menu a").forEach(a => a.addEventListener("click", closeMenu));
addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
const links = $$(".nl");
const navObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("section[data-nav]").forEach(s => navObs.observe(s));
 
/* ===== DATA (placeholder — ganti dengan data asli) ===== */
const certs = [ // [title, issuer, year, credentialId, verifyUrl, about] — placeholder, ganti dengan data asli
  ["Certificate Title 01", "Issuer Name", "YYYY", "CREDENTIAL-ID-01", "", "Short description of what this certification covers (replace)."],
  ["Certificate 02", "Issuer", "YYYY", "CREDENTIAL-ID-02", "", "Short description (replace)."],
  ["Certificate 03", "Issuer", "YYYY", "CREDENTIAL-ID-03", "", "Short description (replace)."],
  ["Certificate 04", "Issuer", "YYYY", "CREDENTIAL-ID-04", "", "Short description (replace)."],
  ["Certificate Title 05", "Issuer", "YYYY", "CREDENTIAL-ID-05", "", "Short description (replace)."],
  ["Certificate Title 06", "Issuer Name", "YYYY", "CREDENTIAL-ID-06", "", "Short description (replace)."],
  ["Certificate 07", "Issuer", "YYYY", "CREDENTIAL-ID-07", "", "Short description (replace)."],
  ["Certificate 08", "Issuer", "YYYY", "CREDENTIAL-ID-08", "", "Short description (replace)."],
  ["Certificate Title 09", "Issuer Name", "YYYY", "CREDENTIAL-ID-09", "", "Short description (replace)."]
];
const projects = [
  ["Fintra", "Finance dashboard concept", "Demo placeholder. Replace with a real project: describe the goal, your role, the tools used, and the result."],
  ["Healora", "Health app landing concept", "Demo placeholder. Replace with a real project description."],
  ["Shopzee", "E-commerce UI concept", "Demo placeholder. Replace with a real project description."],
  ["Travello", "Travel booking UI concept", "Demo placeholder. Replace with a real project description."]
];
$("#certGrid").innerHTML = certs.map((c, i) => `<button type="button" class="card tile t${i + 1} reveal" data-c="${i}" aria-haspopup="dialog" aria-label="${c[0]} — view validation info"><span class="ttop"><span class="tnum">0${i + 1}</span><span class="tchk">✓ Verify</span></span><span class="tbody"><span class="ttitle">${c[0]}</span><span class="tsub muted">${c[1]} · ${c[2]}</span></span></button>`).join("");
$("#projects").innerHTML = projects.map((p, i) => `<div class="reveal reveal-zoom" style="--i:${i}"><button class="card tilt" data-p="${i}" aria-haspopup="dialog"><div class="thumb"></div><span class="tag">Demo placeholder</span><h3 style="font-size:1.4rem;margin:.6rem 0 .2rem">${p[0]}</h3><p class="muted" style="font-size:.9rem">${p[1]}</p></button></div>`).join("");
 
/* ===== REVEAL ON SCROLL ===== */
const revObs = new IntersectionObserver(es => {
  // elemen yang muncul bersamaan dianimasikan berurutan (atas -> bawah, kiri -> kanan)
  es.filter(e => e.isIntersecting)
    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
    .forEach((e, i) => {
      const el = e.target, d = i * 120; revObs.unobserve(el);
      el.style.transitionDelay = d + "ms"; el.classList.add("in");
      setTimeout(() => { el.style.transitionDelay = ""; el.classList.add("done"); }, d + 1050);
    });
}, { threshold: .15, rootMargin: "0px 0px -6% 0px" });
$$(".reveal").forEach(el => revObs.observe(el));
 
/* ===== CARDS: pointer glow + 3D tilt (hanya mouse) ===== */
$$(".card").forEach(c => {
  c.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
    if (c.classList.contains("tilt") && !reduced) { c.style.setProperty("--ry", (x - .5) * 10 + "deg"); c.style.setProperty("--rx", (.5 - y) * 10 + "deg"); }
  });
  c.addEventListener("pointerleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
});
 
/* ===== MAGNETIC CTA (ringan) ===== */
if (!reduced) $$(".magnet").forEach(b => {
  b.addEventListener("pointermove", e => { if (e.pointerType !== "mouse") return; const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
  b.addEventListener("pointerleave", () => b.style.transform = "");
});
 
/* ===== PROJECT MODAL (<dialog> aksesibel) ===== */
const modal = $("#modal");
$("#projects").addEventListener("click", e => {
  const b = e.target.closest("[data-p]"); if (!b) return;
  const p = projects[+b.dataset.p];
  $("#mTitle").textContent = p[0]; $("#mDesc").textContent = p[2]; modal.showModal();
});
$("#mClose").addEventListener("click", () => modal.close());
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });
 
/* ===== CERTIFICATION VALIDATION DIALOG ===== */
const cm = $("#certModal");
$("#certGrid").addEventListener("click", e => {
  const b = e.target.closest("[data-c]"); if (!b) return;
  const c = certs[+b.dataset.c];
  $("#cTitle").textContent = c[0];
  $("#cInfo").innerHTML = [["Certificate", c[0]], ["Issued by", c[1]], ["Year", c[2]], ["Credential ID", c[3]],
    ["Status", c[4] ? "Verifiable online" : "Verification link not added yet (placeholder)"]].map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join("");
  $("#cAbout").textContent = c[5];
  const l = $("#cLink"); l.hidden = !c[4]; if (c[4]) l.href = c[4];
  cm.showModal();
});
$("#cClose").addEventListener("click", () => cm.close());
cm.addEventListener("click", e => { if (e.target === cm) cm.close(); });
 
/* ===== INTERACTIVE WHEEL ===== */
const segsInfo = [
  { t: "About Me", id: "about", d: "Who I am, what I care about, and how I like to work." },
  { t: "Projects", id: "work", d: "Selected work and ideas (currently demo placeholders)." },
  { t: "Certification", id: "certification", d: "Certificates and credentials I have earned (placeholders)." },
  { t: "Experience", id: "experience", d: "My on-the-job training at a Network Operations Center." }
];
const NS = "http://www.w3.org/2000/svg";
const svg = $("#wheel"), rotG = $("#rot"), segsG = $("#segs");
const mk = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
const pt = (r, deg) => { const a = deg * Math.PI / 180; return [200 + r * Math.sin(a), 200 - r * Math.cos(a)]; };
const arc = (a0, a1, ro, ri) => { const p1 = pt(ro, a0), p2 = pt(ro, a1), p3 = pt(ri, a1), p4 = pt(ri, a0); return `M${p1} A${ro} ${ro} 0 0 1 ${p2} L${p3} A${ri} ${ri} 0 0 0 ${p4}Z`; };
const labs = [], segEls = [];
segsInfo.forEach((s, i) => {
  const g = mk("g", { class: "seg", tabindex: 0, role: "button", "aria-label": `${s.t}. ${s.d}`, "data-i": i });
  g.appendChild(mk("path", { d: arc(i * 90 + 2, i * 90 + 88, 176, 106) }));
  const [x, y] = pt(141, i * 90 + 45);
  const lg = mk("g", { transform: `translate(${x} ${y})` }), inner = mk("g", {});
  const n = mk("text", { y: -8, class: "num" }); n.textContent = "0" + (i + 1);
  const t = mk("text", { y: 9 }); t.textContent = s.t;
  inner.append(n, t); lg.appendChild(inner); g.appendChild(lg); segsG.appendChild(g);
  labs.push(inner); segEls.push(g);
});
 
let R = 0, lastR = null, active = 0, anim = null, hov = false, drag = false, down = false, pid = null, sx = 0, sy0 = 0, lastA = 0, dragEnd = 0;
const h = new Date().getHours();
const greet = h < 5 ? "Good Night" : h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : h < 21 ? "Good Evening" : "Good Night";
$("#greet").textContent = greet;
if (h < 5 || h >= 19) $("#cIcon").innerHTML = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
 
function show(i) {
  const s = segsInfo[i];
  $("#cActive").textContent = s.t; $("#iTitle").textContent = s.t; $("#iDesc").textContent = s.d;
}
function setActive(i) {
  active = i; segEls.forEach((g, k) => { g.classList.toggle("active", k === i); g.setAttribute("aria-pressed", k === i); });
  show(i);
}
function goTo(i) {
  setActive(i);
  const target = -(i * 90 + 45), diff = ((target - R) % 360 + 540) % 360 - 180;
  anim = { f: R, to: R + diff, t0: performance.now(), dur: reduced ? 1 : 900 };
}
const snap = () => goTo(Math.floor((((-R) % 360) + 360) % 360 / 90));
setActive(0);
 
const ang = e => { const r = svg.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
svg.addEventListener("pointerdown", e => { down = true; pid = e.pointerId; sx = e.clientX; sy0 = e.clientY; lastA = ang(e); anim = null; });
svg.addEventListener("pointermove", e => {
  if (!down || e.pointerId !== pid) return;
  if (!drag) { if (Math.hypot(e.clientX - sx, e.clientY - sy0) < 6) return; drag = true; svg.setPointerCapture(pid); svg.classList.add("dragging"); }
  const a = ang(e); let d = a - lastA; if (d > 180) d -= 360; if (d < -180) d += 360; R += d; lastA = a;
});
const endDrag = e => {
  if (!down || e.pointerId !== pid) return; down = false;
  if (drag) { drag = false; svg.classList.remove("dragging"); dragEnd = performance.now(); snap(); }
};
svg.addEventListener("pointerup", endDrag); svg.addEventListener("pointercancel", endDrag);
svg.addEventListener("click", e => {
  if (performance.now() - dragEnd < 250) return;
  const g = e.target.closest(".seg"); if (g) goTo(+g.dataset.i);
});
svg.addEventListener("pointerover", e => { const g = e.target.closest(".seg"); if (g && e.pointerType === "mouse") { hov = true; show(+g.dataset.i); } });
svg.addEventListener("pointerout", e => { if (e.pointerType === "mouse" && !e.relatedTarget?.closest?.(".seg")) { hov = false; show(active); } });
svg.addEventListener("focusin", e => { const g = e.target.closest(".seg"); if (g) show(+g.dataset.i); });
svg.addEventListener("focusout", () => show(active));
svg.addEventListener("keydown", e => {
  const g = e.target.closest(".seg"); if (!g) return; const i = +g.dataset.i;
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goTo(i); }
  else if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); segEls[(i + 1) % 4].focus(); }
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); segEls[(i + 3) % 4].focus(); }
});
$("#iOpen").addEventListener("click", () => document.getElementById(segsInfo[active].id).scrollIntoView({ behavior: reduced ? "auto" : "smooth" }));
 
/* ===== SCROLL + POINTER PARALLAX ===== */
const waves = $("#waves"), tl = $("#tl"), tlItems = $$(".tl-item");
let tlTarget = 0, tlP = 0, tlH = 1, tlTops = [];
const measureTl = () => { tlH = tl.offsetHeight; tlTops = tlItems.map(i => i.offsetTop + 13); };
measureTl(); addEventListener("resize", measureTl); addEventListener("load", measureTl);
let px = 0, tpx = 0, sy = 0, tsy = 0;
addEventListener("pointermove", e => { tpx = (e.clientX / innerWidth - .5) * 2; }, { passive: true });
function onScroll() {
  header.classList.toggle("scrolled", scrollY > 20);
  tsy = clamp(scrollY / Math.max(1, document.body.scrollHeight - innerHeight), 0, 1);
  const r = tl.getBoundingClientRect();
  tlTarget = clamp((innerHeight * .7 - r.top) / r.height, 0, 1) * 100;
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();
 
/* ===== SMOOTH (inertia) WHEEL SCROLL — desktop mouse only ===== */
if (!reduced && matchMedia("(pointer:fine)").matches) {
  let cur = scrollY, tgt = scrollY, raf = 0, own = false;
  const maxY = () => document.documentElement.scrollHeight - innerHeight;
  const run = () => {
    cur += (tgt - cur) * .1;
    if (Math.abs(tgt - cur) < .5) { cur = tgt; own = false; raf = 0; } else raf = requestAnimationFrame(run);
    scrollTo({ top: cur, behavior: "instant" });
  };
  addEventListener("wheel", e => {
    if (e.ctrlKey || document.querySelector("dialog[open]") || root.classList.contains("menu-open")) return;
    e.preventDefault();
    if (!own) cur = tgt = scrollY;
    own = true;
    tgt = clamp(tgt + e.deltaY * (e.deltaMode === 1 ? 16 : 1), 0, maxY());
    if (!raf) raf = requestAnimationFrame(run);
  }, { passive: false });
  addEventListener("scroll", () => { if (!own) cur = tgt = scrollY; }, { passive: true });
  // klik anchor/tombol navigasi: hentikan inertia agar tidak bentrok dengan smooth anchor scroll
  document.addEventListener("click", e => {
    if (e.target.closest('a[href^="#"], #iOpen')) { cancelAnimationFrame(raf); raf = 0; own = false; }
  });
}
 
/* ===== SINGLE RENDER LOOP ===== */
let last = performance.now();
document.addEventListener("visibilitychange", () => { last = performance.now(); });
function tick(now) {
  const dt = Math.min(64, now - last); last = now;
  if (anim) {
    const k = clamp((now - anim.t0) / anim.dur, 0, 1);
    R = anim.f + (anim.to - anim.f) * (1 - Math.pow(1 - k, 4)); if (k === 1) anim = null;
  } else if (!drag && !hov && !reduced) R += dt * 0.003;
  if (R !== lastR) {
    rotG.setAttribute("transform", `rotate(${R} 200 200)`);
    const c = `rotate(${-R})`; labs.forEach(l => l.setAttribute("transform", c)); lastR = R;
  }
  if (Math.abs(tlTarget - tlP) > .02) { // garis timeline mengikuti scroll dengan easing
    tlP += (tlTarget - tlP) * .08;
    tl.style.setProperty("--p", tlP.toFixed(2) + "%");
    const head = 6 + tlH * tlP / 100;
    tlItems.forEach((it, k) => it.classList.toggle("reached", head >= tlTops[k]));
  }
  if (!reduced) {
    px += (tpx - px) * .05; sy += (tsy - sy) * .08;
    waves.style.setProperty("--px", px.toFixed(3)); waves.style.setProperty("--sy", sy.toFixed(3));
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
$("#yr").textContent = new Date().getFullYear();
})();
 