/**
 * Mobiles Menü, aktiver Nav-Punkt, Footer-Jahr, Galerie-Paginierung
 * und Lightbox.
 *
 * Header, Footer und die Trainingszeiten-Sidebar werden seit der
 * Umstellung auf Jekyll-Includes (_includes/header.html, footer.html,
 * sidebar-trainingszeiten.html) bereits beim Build ins HTML eingesetzt -
 * dafür ist kein JavaScript mehr nötig.
 */

function setActiveNavItem() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".main-nav > ul > li").forEach((item) => {
    const topLink = item.querySelector(":scope > a");
    const topPath = topLink?.getAttribute("href")?.split("/").pop();

    // Direkter Treffer (man ist genau auf dieser Hauptseite, z. B. gallerie.html)
    const isDirectMatch = topPath === currentPath;

    // Treffer in einer Unterseite (z. B. gallerie-stadtmeisterschaft.html
    // gehört zu "Gallerie") - Hauptpunkt bleibt dann auch markiert, damit
    // erkennbar ist, in welchem Bereich man sich gerade befindet.
    const submenuLinks = item.querySelectorAll(".submenu a");
    const isSubmenuMatch = Array.from(submenuLinks).some(
      (link) => link.getAttribute("href")?.split("/").pop() === currentPath
    );

    if (isDirectMatch || isSubmenuMatch) {
      item.classList.add("active");
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

/**
 * Schlanker Cookie-Consent-Hinweis: schmale Leiste unten, blockiert die
 * Seite nicht, mit echter Ablehnen-Option (Pflicht für eine rechtsgültige
 * Einwilligung - ein reiner "OK"-Button oder vorausgewählte Zustimmung
 * wäre nicht ausreichend). Speichert die Entscheidung in localStorage
 * (kein Cookie nötig für die Speicherung der Entscheidung selbst, das
 * gilt als technisch notwendig).
 *
 * Aktuell wird nichts Einwilligungspflichtiges eingesetzt - die Funktion
 * ist Vorbereitung für Google Analytics, sobald es eingerichtet wird.
 * Dafür einfach GA_MEASUREMENT_ID unten eintragen; ohne ID passiert bei
 * "Akzeptieren" schlicht nichts.
 */
const COOKIE_CONSENT_KEY = "cookie-consent"; // "accepted" | "declined"
const GA_MEASUREMENT_ID = ""; // z. B. "G-XXXXXXXXXX", sobald Analytics eingerichtet ist

function loadAnalytics() {
  if (!GA_MEASUREMENT_ID) return; // noch nicht eingerichtet, nichts zu tun

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
}

function showCookieBanner() {
  const bar = document.createElement("div");
  bar.className = "cookie-consent";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Cookie-Hinweis");
  bar.innerHTML = `
    <p>
      Wir nutzen nur technisch notwendige Funktionen. Optional möchten wir
      anonymisierte Besuchsstatistiken erfassen, um die Seite zu
      verbessern. <a href="datenschutz.html">Mehr dazu</a>.
    </p>
    <div class="cookie-consent-actions">
      <button type="button" class="cookie-decline">Ablehnen</button>
      <button type="button" class="cookie-accept">Akzeptieren</button>
    </div>
  `;
  document.body.appendChild(bar);

  bar.querySelector(".cookie-accept").addEventListener("click", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    loadAnalytics();
    bar.remove();
  });
  bar.querySelector(".cookie-decline").addEventListener("click", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    bar.remove();
  });
}

function initCookieConsent() {
  const existing = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (existing === "accepted") {
    loadAnalytics();
    return;
  }
  if (existing === "declined") {
    return; // Entscheidung liegt vor, Banner nicht nochmal zeigen
  }
  showCookieBanner();
}

// Erlaubt es, die Cookie-Entscheidung später zu ändern (Link im Footer)
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "cookieSettingsLink") {
    e.preventDefault();
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    location.reload();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  setActiveNavItem();
  setFooterYear();
  initGalleryPagination();
  initLightbox();
  initCookieConsent();
});