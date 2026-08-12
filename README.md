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
├── _layouts/
│   └── default.html            ← gemeinsames HTML-Grundgerüst (Kopf, Header, Hero, Footer, Script)
├── _includes/
│   ├── header.html             ← Topbar + Logo + Navigation (Liquid-Schleife über _data/nav.yml)
│   ├── footer.html             ← Vereinsinfos + rechtliche Links
│   └── sidebar-trainingszeiten.html  ← Trainingszeiten-Box (Modul für Sidebar)
├── _data/
│   ├── nav.yml                 ← Navigationsstruktur (an EINER Stelle pflegen)
│   ├── sponsoren.yml           ← Sponsoren-Liste
│   └── gallery.yml             ← Bild-Daten für die Galerie-Seiten
├── _config.yml                 ← Jekyll-Konfiguration (Plugins, URL für Sitemap)
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
oben mit einem Front-Matter-Block beginnt. Kein `Gemfile` nötig, das ist
bei GitHub Pages eingebaut.

**Jede Seite besteht nur noch aus Front Matter + eigentlichem Inhalt.**
Das komplette `<html>`-Grundgerüst (Kopf, Header, Footer, Hero-Sektion,
Script-Einbindung) steckt zentral in `_layouts/default.html` und wird
automatisch drumherum gebaut:

```html
---
layout: default
title: "Seitentitel"
description: "Meta-Beschreibung für Suchmaschinen"
---
<div class="container page-body">
  ...eigentlicher Seiteninhalt...
</div>
```

Das war's – kein `<head>`, kein `{% include header.html %}`, keine
Hero-Sektion mehr pro Seite nötig, das übernimmt `layout: default`.

### Front-Matter-Felder

| Feld | Pflicht? | Zweck |
|---|---|---|
| `layout` | ja, immer `default` | aktiviert das gemeinsame Grundgerüst |
| `title` | ja | Seitentitel. Wird über das `jekyll-seo-tag`-Plugin automatisch zu `<title>Titel – Förderverein Badminton in Eppstein e.V.</title>` (Startseite ist Sonderfall: zeigt nur den Titel ohne Dopplung, weil er exakt dem Site-Titel entspricht); außerdem Standard-Überschrift in der Hero-Sektion |
| `description` | ja | Meta-Description für Suchmaschinen (ebenfalls über `jekyll-seo-tag`, inkl. Open-Graph-/Twitter-Card-Tags fürs Teilen auf Social Media) |
| `hero_title` | nein | überschreibt die H1-Überschrift in der Hero-Sektion, falls sie vom `title` abweichen soll (z. B. bei den Gallerie-Seiten) |
| `hero_image` | nein | schaltet auf die große Foto-Hero-Variante um (aktuell nur `index.html`) statt der schlichten Balken-Hero |
| `hero_image_alt`, `hero_subtitle`, `hero_cta_text`, `hero_cta_url` | nein | nur relevant zusammen mit `hero_image` |

### Was weiterhin pro Seite im Inhalt steht

Bewusst NICHT ins Layout gewandert, weil es sich von Seite zu Seite
unterscheidet:

- Die `.layout`-Grid-Struktur mit Hauptinhalt + Sidebar
- `{% include sidebar-trainingszeiten.html %}` – nur auf Seiten, die die
  Box zeigen sollen (weglassen, wenn nicht gewünscht)
- Sonderfälle wie die Förderverein-Seite (eigene Bild-Sidebar statt
  Trainingszeiten) oder die Datenschutzerklärung (keine Sidebar, volle
  Breite) – jede Seite bringt ihre eigene Inhalts-Struktur mit

**Navigation ändern:** nur `_data/nav.yml` anpassen – `_includes/header.html`
muss dafür nicht angefasst werden.

**Wichtig zu allen internen Links/Pfaden:** immer relativ, ohne
führenden Slash (`kontakt.html`, nicht `/kontakt.html`).

**Lokal testen** (optional): Jekyll lokal laufen lassen, z. B. mit
`bundle exec jekyll serve` (Ruby + Jekyll-Gem nötig), oder direkt auf
GitHub Pages testen. Ein einfacher `python -m http.server` reicht
**nicht**, da `{% include %}`/`{% for %}`/Layouts nur von echtem Jekyll
verarbeitet werden.

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

## Sponsoren (`sponsoren.html`)

Datenquelle: `_data/sponsoren.yml` – ein Eintrag pro Sponsor (`name`,
`logo`-Dateiname, optional `website` für einen Link). Logo-Datei nach
`assets/img/site/` hochladen, dann in `sponsoren.yml` eintragen. Kein
HTML anfassen nötig.

## SEO, Sitemap & Jekyll-Konfiguration (`_config.yml`)

Zwei Plugins aktiviert (auf GitHub Pages ohne Gemfile nutzbar, Teil der
bereitgestellten Plugin-Sammlung):

- **`jekyll-sitemap`** – erzeugt beim Build automatisch eine
  `sitemap.xml` mit allen Seiten, keine manuelle Pflege nötig.
- **`jekyll-seo-tag`** – der `{% seo %}`-Tag im `<head>` von
  `_layouts/default.html` generiert daraus automatisch `<title>`,
  Meta-Description, kanonische URL sowie Open-Graph-/Twitter-Card-Tags
  (für Vorschaubilder beim Teilen auf Social Media). Nutzt `page.title`
  und `page.description` aus dem Front Matter jeder Seite sowie `title`,
  `description`, `title_separator` und `logo` aus `_config.yml`.

`url` + `baseurl` sind auf die aktuelle Domain
(`https://new.tsv-eppstein-badminton.de`) gesetzt; falls ihr nochmal die
Domain wechselt, hier anpassen (bei eigener Domain an der Wurzel immer
`baseurl: ""`, nicht `"/"`).

## Duplikation vermieden: Karten-Übersichten aus `_data/nav.yml`

`spielbetrieb.html` und `gallerie.html` zeigen Karten zu ihren
Unterseiten. Statt das doppelt zu pflegen (einmal in `_data/nav.yml`
fürs Dropdown-Menü, einmal hart codiert auf der jeweiligen
Übersichtsseite), generieren beide Seiten ihre Karten per Liquid direkt
aus dem `submenu` des passenden `nav.yml`-Eintrags:

- Neuer Menüpunkt mit Untermenü hinzufügen/ändern → nur `nav.yml`
  anfassen, taucht automatisch in Dropdown UND Karten-Übersicht auf.
- `description` (auf Submenu-Ebene) liefert den Kartentext für
  `spielbetrieb.html`.
- `data_key` (auf Submenu-Ebene) verknüpft einen Gallerie-Menüpunkt mit
  dem passenden Schlüssel in `_data/gallery.yml`, damit
  `gallerie.html` weiterhin dynamisch "Neueste Bilder: <Jahr>" anzeigen
  kann.

## 404-Seite (`404.html`)

Eigene, im Vereinsdesign gehaltene Seite für ungültige/alte Links, statt
GitHub Pages' Standard-Fehlerseite. Liegt im Repo-Root, wird von GitHub
Pages automatisch für alle nicht existierenden URLs ausgeliefert.

## Schriften (selbst gehostet)

`assets/fonts/fonts.css` + `assets/fonts/files/*.woff2` statt Nachladen
von `fonts.googleapis.com`/`fonts.gstatic.com`. Grund: Google Fonts vom
CDN einzubinden überträgt die Besucher-IP an Google-Server, was
datenschutzrechtlich in Deutschland seit einem Urteil des LG München I
(2022) als heikel gilt. Selbst gehostet entfällt das Thema komplett.

Dateien stammen von [Fontsource](https://fontsource.org) (npm-Pakete
`@fontsource/oswald`, `@fontsource/source-sans-3`), nur Latin-Subset
(deckt deutsche Umlaute ä/ö/ü/ß ab) und nur die tatsächlich genutzten
Schriftschnitte (Oswald 500/600/700, Source Sans 3 400/600/700) – macht
zusammen nur ca. 100 KB.

**Neuen Schriftschnitt ergänzen** (z. B. Oswald 400 für Fließtext in
Überschriften-Optik): im gleichen npm-Paket die passende
`latin-<gewicht>.css`-Datei in `node_modules/@fontsource/<schrift>/`
suchen, die referenzierte `.woff2`-Datei nach `assets/fonts/files/`
kopieren, `@font-face`-Regel in `assets/fonts/fonts.css` ergänzen.

## Cookie-Consent

Schlanke, nicht blockierende Leiste unten am Bildschirmrand
(`initCookieConsent()` in `main.js`, Styles unter `.cookie-consent` in
`style.css`). Erscheint nur, wenn noch keine Entscheidung gespeichert
ist (`localStorage`, Key `cookie-consent`). Zwei echte Optionen
("Akzeptieren"/"Ablehnen") – wichtig für eine rechtsgültige Einwilligung,
ein reiner "OK"-Button oder vorausgewählte Zustimmung reicht nicht.

**Aktuell wird noch nichts Einwilligungspflichtiges eingesetzt** – die
Leiste ist Vorbereitung für Google Analytics. Google Analytics
einrichten:

1. In Google Analytics eine Property für die Domain anlegen, Mess-ID
   (`G-XXXXXXXXXX`) kopieren.
2. In `assets/js/main.js` die Konstante `GA_MEASUREMENT_ID` oben in der
   Datei setzen (aktuell leerer String – ohne ID passiert bei
   "Akzeptieren" nichts).
3. **Datenschutzerklärung aktualisieren** (`datenschutz.html`, Abschnitt
   5) – dort steht bislang nur die alte IONOS-WebAnalytics-Beschreibung,
   die durch einen Google-Analytics-Absatz ersetzt werden muss (siehe
   Warnbox oben auf der Seite).

**Entscheidung später ändern:** Link "Cookie-Einstellungen" im Footer
(`{% include footer.html %}`) setzt die gespeicherte Entscheidung zurück
und lädt die Seite neu, Banner erscheint erneut.

## PDFs / Downloads

Liegen unter `assets/docs/`, z. B. `assets/docs/satzung-2025.pdf` oder
`assets/docs/mitgliedsantrag-foerderverein.pdf`. Dateiname muss exakt
passen, die HTML-Links zeigen schon lokal dorthin.

## Kontaktformular

`kontakt.html` nutzt Formspree (Form-ID `mwleoorw`) für den Versand, da
GitHub Pages kein PHP/Server-Backend hat.

## Fertige Seiten

Alle statischen Seiten sind fertig: Startseite, Impressum, Förderverein,
Kontakt, alle 5 Spielbetrieb-Seiten, alle Galerie-Seiten, News,
Sponsoren, Datenschutzerklärung.

**Über uns** ist wie Spielbetrieb/Gallerie eine reine Kachel-Übersicht
(`ueber-uns.html`, generiert die Karten wie beschrieben aus
`_data/nav.yml`) mit vier Unterseiten:
- `ueber-uns-meilensteine.html` – Vereinsgeschichte/wichtigste Stationen
- `ueber-uns-was-ist-badminton.html` – kurze Einführung in den Sport für
  Neueinsteiger:innen (Regeln, Zählweise, kurzer geschichtlicher Abriss
  des Sports selbst, nicht der Abteilung)
- `ueber-uns-faq.html` – häufige Fragen (Reinschnuppern, Ausrüstung,
  Alter, Mitgliedschaft, Unterschied Abteilung/Förderverein)
- `kontakt.html` – bestehende Kontaktseite, unverändert

**Noch offen:**
- Bilder für `laenderspiele` und `kinder_jugendturniere` in der Galerie
- Datenschutzerklärung: Abschnitt "Hosting" nennt noch IONOS, muss vor
  Veröffentlichung an GitHub Pages angepasst werden (Hinweis-Box steht
  bereits oben auf der Seite)
- Strohhutfest-Vorschaubilder auf der Startseite zeigen noch auf die
  alte WordPress-Domain
