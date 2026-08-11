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

/**
 * Paginiert alle .gallery-grid-Elemente auf der Seite: zeigt anfangs nur
 * eine Portion der Bilder, weitere kommen per "Weitere Bilder laden"-Klick
 * dazu. Läuft rein clientseitig, da GitHub Pages/Jekyll keine echte
 * Server-Paginierung für Datendateien (nur für Blog-Posts) unterstützt.
 *
 * Portionsgröße einstellbar per data-page-size="N" direkt am
 * .gallery-grid-Element im HTML, sonst Standardwert PAGE_SIZE_DEFAULT.
 */
function initGalleryPagination() {
  const PAGE_SIZE_DEFAULT = 12;

  document.querySelectorAll(".gallery-grid").forEach((grid) => {
    const items = Array.from(grid.children);
    const pageSize = parseInt(grid.dataset.pageSize, 10) || PAGE_SIZE_DEFAULT;

    if (items.length <= pageSize) return; // passt eh komplett hin, keine Paginierung nötig

    let visibleCount = pageSize;
    items.forEach((item, index) => {
      if (index >= visibleCount) item.style.display = "none";
    });

    const wrap = document.createElement("div");
    wrap.className = "gallery-more-wrap";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-more-btn";

    const updateLabel = () => {
      const rest = items.length - visibleCount;
      button.textContent = `Weitere Bilder laden (noch ${rest} von ${items.length})`;
    };
    updateLabel();

    button.addEventListener("click", () => {
      const next = Math.min(visibleCount + pageSize, items.length);
      for (let i = visibleCount; i < next; i++) {
        items[i].style.display = "";
      }
      visibleCount = next;
      if (visibleCount >= items.length) {
        wrap.remove();
      } else {
        updateLabel();
      }
    });

    wrap.appendChild(button);
    grid.insertAdjacentElement("afterend", wrap);
  });
}

/**
 * Lightbox für alle .gallery-grid-Bilder: Klick öffnet das Bild groß im
 * selben Fenster (statt in einem neuen Tab), mit Vor/Zurück-Navigation
 * und Escape/Klick-daneben zum Schließen. Funktioniert unabhängig von
 * initGalleryPagination() - auch per "Weitere Bilder laden" noch
 * ausgeblendete Bilder lassen sich in der Lightbox per Weiter-Pfeil
 * erreichen.
 */
function initLightbox() {
  const grids = document.querySelectorAll(".gallery-grid");
  if (!grids.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Schließen">&times;</button>
    <button type="button" class="lightbox-prev" aria-label="Vorheriges Bild">&#8249;</button>
    <img class="lightbox-img" alt="">
    <button type="button" class="lightbox-next" aria-label="Nächstes Bild">&#8250;</button>
    <div class="lightbox-counter"></div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector(".lightbox-img");
  const counterEl = overlay.querySelector(".lightbox-counter");
  const closeBtn = overlay.querySelector(".lightbox-close");
  const prevBtn = overlay.querySelector(".lightbox-prev");
  const nextBtn = overlay.querySelector(".lightbox-next");

  let currentLinks = [];
  let currentIndex = 0;

  function show(index) {
    if (!currentLinks.length) return;
    currentIndex = (index + currentLinks.length) % currentLinks.length;
    const link = currentLinks[currentIndex];
    imgEl.src = link.getAttribute("href");
    imgEl.alt = link.querySelector("img")?.alt || "";
    counterEl.textContent = `${currentIndex + 1} / ${currentLinks.length}`;
  }

  function open(links, index) {
    currentLinks = links;
    show(index);
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });

  grids.forEach((grid) => {
    const links = Array.from(grid.querySelectorAll("a"));
    links.forEach((link, index) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        open(links, index);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await includePartial("site-header", "partials/header.html");
  await includePartial("site-footer", "partials/footer.html");
  await includePartial("sidebar-trainingszeiten", "partials/sidebar-trainingszeiten.html");
  initNavToggle();
  setActiveNavItem();
  setFooterYear();
  initGalleryPagination();
  initLightbox();
});
