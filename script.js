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
 
/* ===== WELCOME SCREEN ===== */
const welcome = $("#welcome");
if (welcome) {
  const WELCOME_MS = { desktop: 16200, mobile: 2800 }; // durasi dalam milidetik (1000 = 1 detik)
  const minMs = reduced ? 700 : matchMedia("(min-width:1024px)").matches ? WELCOME_MS.desktop : WELCOME_MS.mobile;
  welcome.style.setProperty("--wdur", minMs + "ms");
  let closed = false;
  const skipKey = e => { if (e.key === "Escape" || e.key === "Enter") closeWelcome(); };
  function closeWelcome() {
    if (closed) return; closed = true;
    document.removeEventListener("keydown", skipKey);
    welcome.classList.add("out");                                            // tirai naik
    setTimeout(() => root.classList.remove("loading"), reduced ? 0 : 550);   // hero & navbar mulai masuk saat tirai naik
    setTimeout(() => welcome.remove(), reduced ? 50 : 1300);
  }
  const pageReady = new Promise(r => document.readyState === "complete" ? r() : addEventListener("load", r, { once: true }));
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.all([new Promise(r => setTimeout(r, minMs)), pageReady, fontsReady]).then(closeWelcome);
  setTimeout(closeWelcome, minMs + 4000);               // pengaman jika ada resource yang lambat
  $("#wSkip").addEventListener("click", closeWelcome);
  document.addEventListener("keydown", skipKey);
  $("#wSkip").focus({ preventScroll: true });
}
 
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
 
/* ===== IMAGE SLOT: ukuran tetap; gambar di-crop otomatis (cover). Jika file tidak ada -> placeholder ===== */
const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-8 8"/></svg>';
const slot = (src, cls, ph, alt) =>
  `<span class="slot ${cls}"><span class="slot-ph">${cls.includes("sm") ? ph : ICON + ph}</span>${src ? `<img src="${src}" alt="${alt || ""}" loading="lazy" decoding="async">` : ""}</span>`;
document.addEventListener("error", e => { if (e.target.matches && e.target.matches(".slot img")) e.target.remove(); }, true);
 
/* ===== DATA (placeholder — ganti dengan data asli) =====
   Ukuran gambar yang disarankan:
   - Work & Experience & detail dialog : 1280 x 800 px (16:10)
   - Certification (thumbnail kotak)   : pakai file cert-XX.jpg yang sama, otomatis di-crop 1:1
   Taruh semua gambar di folder images/. Kosongkan image: "" untuk menampilkan placeholder saja. */
const projects = [
  { title: "Fintra", sub: "Finance dashboard concept", year: "YYYY", role: "Your role", tools: "Tools used (replace)", demo: "", repo: "", image: "images/project-1.jpg",
    desc: "Demo placeholder. Replace with a real project: describe the goal, your role, the tools used, and the result." },
  { title: "Healora", sub: "Health app landing concept", year: "YYYY", role: "Your role", tools: "Tools used (replace)", demo: "", repo: "", image: "images/project-2.jpg",
    desc: "Demo placeholder. Replace with a real project description." },
  { title: "Shopzee", sub: "E-commerce UI concept", year: "YYYY", role: "Your role", tools: "Tools used (replace)", demo: "", repo: "", image: "images/project-3.jpg",
    desc: "Demo placeholder. Replace with a real project description." },
  { title: "Travello", sub: "Travel booking UI concept", year: "YYYY", role: "Your role", tools: "Tools used (replace)", demo: "", repo: "", image: "images/project-4.jpg",
    desc: "Demo placeholder. Replace with a real project description." }
];
const cert = (n, title, issuer) => ({ title, issuer, year: "YYYY", id: "CREDENTIAL-ID-" + n, verify: "", image: `images/cert-${n}.jpg`,
  about: "Short description of what this certification covers (replace)." }); // verify: isi URL verifikasi asli
const certs = [
  cert("01", "Certificate Title 01", "Issuer Name"), cert("02", "Certificate 02", "Issuer"), cert("03", "Certificate 03", "Issuer"),
  cert("04", "Certificate 04", "Issuer"), cert("05", "Certificate Title 05", "Issuer"), cert("06", "Certificate Title 06", "Issuer Name"),
  cert("07", "Certificate 07", "Issuer"), cert("08", "Certificate 08", "Issuer"), cert("09", "Certificate Title 09", "Issuer Name")
];
const experience = [
  { date: "DD MMM YYYY — DD MMM YYYY", title: "Praktik Kerja Lapangan — Network Operations Center", image: "images/experience-1.jpg",
    text: "Company name (replace). Short summary of your internship at the NOC." },
  { date: "Responsibilities", title: "What I worked on", image: "images/experience-2.jpg",
    text: "Describe your main tasks at the NOC, for example monitoring, incident handling, or documentation (replace with your real tasks)." },
  { date: "Learning outcomes", title: "What I learned", image: "images/experience-3.jpg",
    text: "Describe the skills and lessons you gained during the internship (replace this text)." }
];
 
$("#projects").innerHTML = projects.map((p, i) => `<div class="reveal" style="--i:${i}"><button class="card tilt pcard" data-p="${i}" aria-haspopup="dialog">${slot(p.image, "wide", "Add image", p.title)}<span class="tag">Demo placeholder</span><h3 style="font-size:1.4rem;margin:.6rem 0 .2rem">${p.title}</h3><p class="muted" style="font-size:.9rem">${p.sub}</p></button></div>`).join("");
$("#certGrid").innerHTML = certs.map((c, i) => `<button type="button" class="card tile t${i + 1} reveal" data-c="${i}" aria-haspopup="dialog" aria-label="${c.title} — view details"><span class="ttop">${slot(c.image, "sm", "0" + (i + 1), c.title)}<span class="tchk">✓ Verify</span></span><span class="tbody"><span class="ttitle">${c.title}</span><span class="tsub muted">${c.issuer} · ${c.year}</span></span></button>`).join("");
$("#tl").insertAdjacentHTML("beforeend", experience.map((x, i) => `<div class="tl-item reveal"><div class="muted" style="font-size:.8rem">${x.date}</div><h3 style="font-size:1.25rem">${x.title}</h3><p class="muted">${x.text}</p>${slot(x.image, "wide exp", "Add image", x.title)}</div>`).join(""));
 
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
 
/* ===== DETAIL DIALOGS (<dialog> aksesibel): Project & Certification ===== */
const modal = $("#modal"), cm = $("#certModal");
const chips = arr => arr.filter(Boolean).map(t => `<span class="tag">${t}</span>`).join("");
const facts = rows => rows.map(r => `<div class="fact${r[2] ? " wide" : ""}"><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join("");
const linkBtns = (arr, note) => arr.filter(a => a[1]).map((a, i) => `<a class="btn${i ? "" : " primary"}" href="${a[1]}" target="_blank" rel="noopener">${a[0]}</a>`).join("") || `<p class="note">${note}</p>`;
const openDlg = d => { d.querySelector(".dlg-scroll").scrollTop = 0; d.showModal(); };
 
$("#projects").addEventListener("click", e => {
  const b = e.target.closest("[data-p]"); if (!b) return;
  const p = projects[+b.dataset.p];
  $("#mMedia").innerHTML = slot(p.image, "wide", "Add image", p.title);
  $("#mTitle").textContent = p.title;
  $("#mChips").innerHTML = chips(["Demo placeholder", p.year]);
  $("#mDesc").textContent = p.desc;
  $("#mFacts").innerHTML = facts([["Role", p.role], ["Year", p.year], ["Tools", p.tools, true]]);
  $("#mActions").innerHTML = linkBtns([["Live demo", p.demo], ["Repository", p.repo]], "Project links have not been added yet (placeholder).");
  openDlg(modal);
});
$("#certGrid").addEventListener("click", e => {
  const b = e.target.closest("[data-c]"); if (!b) return;
  const c = certs[+b.dataset.c];
  $("#cMedia").innerHTML = slot(c.image, "wide", "Add certificate image", c.title);
  $("#cTitle").textContent = c.title;
  $("#cChips").innerHTML = chips([c.issuer, c.year, c.verify ? "Verifiable online" : "Verification pending"]);
  $("#cAbout").textContent = c.about;
  $("#cFacts").innerHTML = facts([["Issued by", c.issuer], ["Year", c.year], ["Credential ID", c.id, true],
    ["Status", c.verify ? "Verifiable online" : "Verification link not added yet (placeholder)", true]]);
  $("#cActions").innerHTML = linkBtns([["Verify online", c.verify]], "Add a verification URL to enable the “Verify online” button.");
  openDlg(cm);
});
[[modal, "#mClose"], [cm, "#cClose"]].forEach(([d, x]) => {
  $(x).addEventListener("click", () => d.close());
  d.addEventListener("click", e => { if (e.target === d) d.close(); }); // klik area gelap di luar kartu
});
 
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
const lite = matchMedia("(max-width:1023px), (pointer:coarse)").matches; // mobile: tanpa parallax wave
if (!lite) addEventListener("pointermove", e => { tpx = (e.clientX / innerWidth - .5) * 2; }, { passive: true });
function onScroll() {
  header.classList.toggle("scrolled", scrollY > 20);
  tsy = clamp(scrollY / Math.max(1, document.body.scrollHeight - innerHeight), 0, 1);
  const r = tl.getBoundingClientRect();
  tlTarget = clamp((innerHeight * .7 - r.top) / r.height, 0, 1) * 100;
}
let dirty = false; // kerjakan pembaruan scroll di rAF, bukan di setiap event scroll
addEventListener("scroll", () => { dirty = true; }, { passive: true }); onScroll();
 
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
    if (e.ctrlKey || root.classList.contains("loading") || document.querySelector("dialog[open]") || root.classList.contains("menu-open")) return;
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
  if (dirty) { dirty = false; onScroll(); }
  if (anim) {
    const k = clamp((now - anim.t0) / anim.dur, 0, 1);
    R = anim.f + (anim.to - anim.f) * (1 - Math.pow(1 - k, 4)); if (k === 1) anim = null;
  } else if (!drag && !hov && !reduced && !root.classList.contains("menu-open")) R += dt * 0.003;
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
  if (!reduced && !lite) {
    px += (tpx - px) * .05; sy += (tsy - sy) * .08;
    waves.style.setProperty("--px", px.toFixed(3)); waves.style.setProperty("--sy", sy.toFixed(3));
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
const aImg = $("#aboutImg"); // jika foto tidak ditemukan, tampilkan placeholder
if (aImg) {
  const dropBroken = () => { // tampilkan placeholder + path yang dicoba, supaya mudah dicek
    console.warn("Foto About tidak ditemukan:", aImg.getAttribute("src"));
    const ph = $("#phPath"); if (ph) ph.textContent = aImg.getAttribute("src");
    aImg.remove();
  };
  aImg.addEventListener("error", dropBroken);
  if (aImg.complete && aImg.naturalWidth === 0) dropBroken(); // error bisa terjadi sebelum listener terpasang
}
$("#yr").textContent = new Date().getFullYear();
})();
 