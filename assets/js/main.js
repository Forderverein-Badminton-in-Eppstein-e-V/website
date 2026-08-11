/**
 * Bindet die gemeinsamen Bausteine (Header/Footer) in jede Seite ein
 * und kümmert sich um das mobile Menü.
 *
 * Voraussetzung in jeder HTML-Seite:
 *   <div id="site-header"></div>  ... Inhalt ...  <div id="site-footer"></div>
 *
 * Hinweis: fetch() auf lokale Dateien funktioniert nur über HTTP(S),
 * also auf GitHub Pages einwandfrei, aber NICHT wenn man die HTML-Datei
 * lokal per Doppelklick öffnet (file://). Zum lokalen Testen z. B.
 * "python -m http.server" im Projektordner starten und dann
 * http://localhost:8000 aufrufen.
 */

async function includePartial(targetId, url) {
  const target = document.getElementById(targetId);
  if (!target) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Konnte ${url} nicht laden (${res.status})`);
    target.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    target.innerHTML = "<p style='padding:1rem;color:#900;'>Navigation konnte nicht geladen werden.</p>";
  }
}

function setActiveNavItem() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav > ul > li > a").forEach((link) => {
    const linkPath = link.getAttribute("href")?.split("/").pop();
    if (linkPath === currentPath) {
      link.closest("li").classList.add("active");
    }
  });
}

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", async () => {
  await includePartial("site-header", "partials/header.html");
  await includePartial("site-footer", "partials/footer.html");
  await includePartial("sidebar-trainingszeiten", "partials/sidebar-trainingszeiten.html");
  initNavToggle();
  setActiveNavItem();
  setFooterYear();
});
