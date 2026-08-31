/**
 * Mobiles Menü, aktiver Nav-Punkt, Footer-Jahr, Galerie-Paginierung
 * und Lightbox.
 */

function setActiveNavItem() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".main-nav > ul > li").forEach((item) => {
    const topLink = item.querySelector(":scope > a");
    const topPath = topLink?.getAttribute("href")?.split("/").pop();

    const isDirectMatch = topPath === currentPath;

    // Treffer in einer Unterseite markiert auch den zugehörigen Hauptpunkt.
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

/**
 * Klick-Toggle für die Untermenüs im mobilen Menü (Desktop nutzt
 * Hover-CSS, Buttons dort unsichtbar).
 */
function initSubmenuToggles() {
  document.querySelectorAll(".submenu-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const li = button.closest("li");
      if (!li) return;
      const isOpen = li.classList.toggle("submenu-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/**
 * Paginiert alle .gallery-grid-Elemente: zeigt anfangs nur eine Portion
 * der Bilder, weitere per "Weitere Bilder laden"-Klick. Portionsgröße per
 * data-page-size="N" am .gallery-grid-Element, sonst PAGE_SIZE_DEFAULT.
 */
function initGalleryPagination() {
  const PAGE_SIZE_DEFAULT = 9;

  document.querySelectorAll(".gallery-grid").forEach((grid) => {
    const items = Array.from(grid.children);
    const pageSize = parseInt(grid.dataset.pageSize, 10) || PAGE_SIZE_DEFAULT;

    if (items.length <= pageSize) return;

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
 * Lightbox für alle .gallery-grid-Bilder: Klick öffnet das Bild groß mit
 * Vor/Zurück-Navigation und Escape/Klick-daneben zum Schließen.
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
 * Cookie-Banner für das Google-Ads-Conversion-Tracking (siehe
 * _includes/cookie-banner.html, Datenschutzerklärung Abschnitt 5).
 * Speichert die Wahl in localStorage ("ads_consent": "granted"/"denied").
 */
function initCookieBanner() {
  const banner = document.getElementById("cookieBanner");
  if (!banner) return;

  const acceptBtn = document.getElementById("cookieAccept");
  const declineBtn = document.getElementById("cookieDecline");
  const settingsLink = document.getElementById("cookieSettingsLink");

  function getStoredChoice() {
    try {
      return localStorage.getItem("ads_consent");
    } catch (e) {
      return null;
    }
  }

  function updateConsent(granted) {
    try {
      localStorage.setItem("ads_consent", granted ? "granted" : "denied");
    } catch (e) { /* localStorage evtl. nicht verfügbar */ }

    if (typeof gtag === "function") {
      const state = granted ? "granted" : "denied";
      gtag("consent", "update", {
        ad_storage: state,
        ad_user_data: state,
        ad_personalization: "denied", // nur Conversion-Tracking, kein Remarketing
      });
    }
  }

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  acceptBtn?.addEventListener("click", () => {
    updateConsent(true);
    hideBanner();
  });

  declineBtn?.addEventListener("click", () => {
    updateConsent(false);
    hideBanner();
  });

  settingsLink?.addEventListener("click", showBanner);

  if (getStoredChoice() === null) {
    showBanner();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initSubmenuToggles();
  setActiveNavItem();
  setFooterYear();
  initGalleryPagination();
  initLightbox();
  initCookieBanner();
});
