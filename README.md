# TSV Eppstein Badminton – Website (GitHub Pages)

## Struktur

```
/
├── index.html                  ← Startseite
├── impressum.html, datenschutz.html, ueber-uns.html, foerderverein.html, ...
├── spielbetrieb*.html          ← Übersicht + 5 Unterseiten
├── gallerie*.html              ← Übersicht + 4 Themen-Seiten (Jekyll)
├── news.html                   ← Newsliste (Jekyll)
├── kontakt.html                ← Kontaktformular (Formspree)
├── _includes/
│   ├── header.html             ← Topbar + Logo + Navigation (Liquid-Schleife über _data/nav.yml)
│   ├── footer.html             ← Vereinsinfos + rechtliche Links
│   └── sidebar-trainingszeiten.html  ← Trainingszeiten-Box (Modul für Sidebar)
├── _data/
│   ├── nav.yml                 ← Navigationsstruktur (an EINER Stelle pflegen)
│   └── gallery.yml             ← Bild-Daten für die Galerie-Seiten
├── _posts/
│   └── YYYY-MM-DD-titel.md     ← News-Beiträge
├── assets/
│   ├── css/style.css           ← komplettes Design (Farben, Schrift, Layout)
│   ├── js/main.js              ← Mobile-Menü, Galerie-Paginierung, Lightbox
│   ├── img/site/               ← normale Layout-Bilder
│   ├── img/gallery/<thema>/<jahr>/  ← Galerie-Fotos
│   └── docs/                   ← PDFs (Satzung, Mitgliedsanträge)
```

## Funktionsprinzip (Jekyll)

GitHub Pages baut die Seite automatisch mit **Jekyll**, sobald eine Datei
oben mit einem Front-Matter-Block beginnt (zwei Zeilen `---`). Kein
`_config.yml` oder Gemfile nötig, das ist bei GitHub Pages eingebaut.

Header, Footer und die Trainingszeiten-Sidebar werden dadurch schon
**beim Build** eingesetzt:

```html
---
---
<!DOCTYPE html>
...
{% include header.html %}
...Seiteninhalt...
{% include sidebar-trainingszeiten.html %}   (nur auf Seiten mit Sidebar)
...
{% include footer.html %}
<script src="assets/js/main.js"></script>
```

**Navigation ändern:** nur `_data/nav.yml` anpassen (Menüpunkt
hinzufügen/umbenennen/Reihenfolge ändern) – `_includes/header.html` muss
dafür nicht angefasst werden. Format und Beispiele stehen als Kommentar
in der Datei selbst.

**Wichtig zu allen internen Links/Pfaden:** immer relativ, ohne
führenden Slash (`kontakt.html`, nicht `/kontakt.html`). Das Repo ist
eine GitHub *Project Page* (URL mit `/website/`-Unterpfad) – ein
führender Slash würde auf die Domain-Wurzel statt auf den Unterpfad
zeigen und die Navigation kaputt machen. Das ist uns am Anfang einmal
passiert, seitdem bewusst vermieden.

**Lokal testen** (optional): Jekyll lokal laufen lassen, z. B. mit
`bundle exec jekyll serve` (Ruby + Jekyll-Gem nötig), oder direkt auf
GitHub Pages testen. Ein einfacher `python -m http.server` reicht
**nicht**, um `{% include %}`/`{% for %}` darzustellen – das brauchht
echtes Jekyll.

## Design-Entscheidungen

- **Farben:** dunkles "Spielfeld-Grün" für Header/Footer, ein frisches
  Grün-Gelb (Filzball-Farbe) als Akzent für Buttons/Links, statt der
  generischen Creme/Terracotta- oder Dunkel-mit-Neongrün-Templates.
- **Schrift:** "Oswald" (kondensiert, sportlich) für Überschriften/Nav,
  "Source Sans 3" für Fließtext.
- **Wiederkehrendes Element:** gestrichelte Trennlinie (`.court-divider`)
  erinnert an eine Feldmarkierung; Statistik-Badges (Anzahl Mannschaften,
  Liga, Saisonstart) statt reinem Fließtext.
- Responsive: Menü klappt unter 860px zu einem Burger-Menü zusammen.

## Bilder

### Ordnerstruktur

```
assets/img/
├── site/                          ← normale Layout-Bilder (Vereinsfotos, Hero-Bilder, Logos, Sponsoren)
└── gallery/                       ← alle Galerie-Bilder, nach Thema UND Jahr sortiert
    ├── stadtmeisterschaft/
    │   ├── 2025/
    │   └── 2026/
    ├── laenderspiele/
    └── jugendturniere/
```

- **`site/`** für alle "normalen" Bilder im Fließtext/Layout einer Seite.
- **`gallery/<thema>/<jahr>/`** für Galerie-Fotos, siehe Abschnitt Galerie
  unten für Details zum Dateinamen-Schema.
- Kein separates Thumbnail-Bild nötig – die Galerie zeigt die Originale
  in einem CSS-Grid mit `loading="lazy"`. Fotos vor dem Hochladen grob
  auf ca. 1600–2000px verkleinern (z. B. squoosh.app), damit die Seite
  nicht unnötig langsam lädt.

## Galerie (`gallerie.html` + `gallerie-*.html`)

- Datenquelle: `_data/gallery.yml` – pro Thema (`stadtmeisterschaft`,
  `laenderspiele`, `kinder_jugendturniere`, `strohhutfest`) eine Liste
  von Jahren, pro Jahr eine Liste von Bild-Dateinamen. Neuestes Jahr
  steht in der Liste zuerst (wird dann auch zuerst angezeigt).
- Dateinamen-Schema: `<thema>-<jahr>-<nummer>.jpg`, dreistellig
  durchnummeriert, z. B. `stadtmeisterschaft-2025-001.jpg`.
- Bilddateien liegen unter `assets/img/gallery/<thema>/<jahr>/<dateiname>`.
- **Paginierung:** jedes Jahres-Grid zeigt anfangs nur 12 Bilder, Rest
  per "Weitere Bilder laden"-Button (clientseitig in `main.js`,
  `initGalleryPagination()`). Portionsgröße pro Grid überschreibbar via
  `data-page-size="N"` am `.gallery-grid`-Element.
- **Lightbox:** Klick auf ein Bild öffnet es groß im selben Fenster statt
  in neuem Tab, mit Vor/Zurück-Navigation und Escape zum Schließen
  (`main.js`, `initLightbox()`).
- Neues Jahr = neuer Eintrag in `_data/gallery.yml` + neuer Bilderordner,
  kein HTML anfassen nötig.
- **Offen:** `laenderspiele` und `kinder_jugendturniere` sind in
  `_data/gallery.yml` noch leer (`[]`), bis Bilder dafür hochgeladen sind.

## News (`news.html`)

- Neue Beiträge kommen als einzelne Dateien in den Ordner `_posts/`.
- Dateiname **muss** mit dem Datum beginnen: `YYYY-MM-DD-titel.md`
  (z. B. `2026-09-03-saisonstart.md`).
- Inhalt: oben Front-Matter mit `title:` und `date:`, darunter normaler
  Text (Markdown-Formatierung wie `**fett**` funktioniert).
- Posts erscheinen automatisch neueste zuerst.
- Leerzustand ("noch keine News") ist eingebaut, falls `_posts/` leer ist.

## PDFs / Downloads

Liegen unter `assets/docs/`, z. B. `assets/docs/satzung-2025.pdf` oder
`assets/docs/mitgliedsantrag-foerderverein.pdf`. Dateiname muss exakt
passen, die HTML-Links zeigen schon lokal dorthin.

## Kontaktformular

`kontakt.html` nutzt Formspree (Form-ID `mwleoorw`) für den Versand, da
GitHub Pages kein PHP/Server-Backend hat.

## Fertige Seiten

Alle statischen Seiten sind fertig: Startseite, Impressum, Förderverein,
Über uns, Kontakt, alle 5 Spielbetrieb-Seiten, alle Galerie-Seiten, News,
Sponsoren, Datenschutzerklärung.

**Noch offen:**
- Bilder für `laenderspiele` und `kinder_jugendturniere` in der Galerie
- Datenschutzerklärung: Abschnitt "Hosting" nennt noch IONOS, muss vor
  Veröffentlichung an GitHub Pages angepasst werden (Hinweis-Box steht
  bereits oben auf der Seite)
- Strohhutfest-Vorschaubilder auf der Startseite zeigen noch auf die
  alte WordPress-Domain
