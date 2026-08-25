/**
 * TEMPORÄRES TESTWERKZEUG - Farbschema-Umschalter
 * ================================================
 * Zeigt eine kleine Dropdown-Box oben rechts, mit der man live
 * zwischen verschiedenen Farbschemata hin- und herschalten kann,
 * ohne jedes Mal Dateien hochzuladen. Die Wahl wird in localStorage
 * gemerkt, bleibt also auch beim Wechsel zwischen Seiten bestehen.
 *
 * WIEDER ENTFERNEN, sobald ihr euch entschieden habt:
 * 1. Diese Datei löschen (assets/js/theme-switcher.js)
 * 2. In _layouts/default.html die eine Zeile
 *    <script src="assets/js/theme-switcher.js"></script>
 *    wieder rausnehmen
 * 3. Fertig - keine weiteren Spuren im Code.
 *
 * Die eigentlichen Farbschema-Dateien (assets/css/theme-*.css)
 * können danach bleiben oder ebenfalls gelöscht werden, sie werden
 * ohne dieses Skript einfach nicht mehr geladen.
 */
(function () {
  var STORAGE_KEY = "theme-test-choice";
  var LINK_ID = "theme-override-link";

  var DEFAULT_THEME = "vereinsfarben-original";

  var THEMES = {
    "vereinsfarben-original": "/assets/css/theme-vereinsfarben-original.css",
    hauptverein: "/assets/css/theme-hauptverein-webfarben.css",
    gedaempft: "/assets/css/theme-vereinsfarben.css",
    kraeftig: "/assets/css/theme-vereinsfarben-kraeftig.css",
    rotakzent: "/assets/css/theme-vereinsfarben-rotakzent.css",
  };

  var LABELS = {
    "vereinsfarben-original": "1. Vereinsfarben, exakt (Wappen)",
    hauptverein: "2. Vereinsfarben, exakt (TSV Webseite)",
    gedaempft: "3. Vereinsfarben, gedämpft",
    kraeftig: "4. Vereinsfarben, kräftiger",
    rotakzent: "5. Vereinsfarben, Rot-Akzent",
  };

  function applyTheme(key) {
    var href = THEMES[key];
    var link = document.getElementById(LINK_ID);
    if (href) {
      if (!link) {
        link = document.createElement("link");
        link.id = LINK_ID;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = href;
    } else if (link) {
      link.remove();
    }
  }

  function init() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (!saved || !THEMES.hasOwnProperty(saved)) {
      // Fängt auch alte localStorage-Werte von Besuchern ab, die noch
      // "original" (das jetzt entfernte grüne Schema) gespeichert haben.
      saved = DEFAULT_THEME;
    }
    applyTheme(saved);

    var box = document.createElement("div");
    box.style.cssText =
      "position:fixed; top:10px; right:10px; z-index:999; " +
      "background:#fff; border:2px dashed #ff5500; border-radius:6px; " +
      "padding:8px 10px; font-family:sans-serif; font-size:12px; " +
      "box-shadow:0 2px 10px rgba(0,0,0,0.25); color:#222;";

    var label = document.createElement("label");
    label.textContent = "Farbschema testen: ";
    label.style.cssText = "display:block; margin-bottom:4px; font-weight:bold;";

    var select = document.createElement("select");
    select.style.cssText = "font-size:12px; padding:2px 4px;";
    Object.keys(LABELS).forEach(function (key) {
      var opt = document.createElement("option");
      opt.value = key;
      opt.textContent = LABELS[key];
      select.appendChild(opt);
    });
    select.value = saved;
    select.addEventListener("change", function () {
      localStorage.setItem(STORAGE_KEY, select.value);
      applyTheme(select.value);
    });

    label.appendChild(select);
    box.appendChild(label);
    document.body.appendChild(box);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
