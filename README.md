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
| `title` | ja | `<title>`-Tag-Text (bekommt automatisch " – Förderverein Badminton in Eppstein e.V." angehängt) sowie Standard-Überschrift in der Hero-Sektion |
| `description` | ja | Meta-Description für Suchmaschinen |
| `full_title` | nein | überschreibt `title` im `<title>`-Tag komplett, ohne Suffix (aktuell nur bei `index.html` genutzt) |
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

## Sitemap & Jekyll-Konfiguration (`_config.yml`)

Aktiviert das `jekyll-sitemap`-Plugin (auf GitHub Pages ohne Gemfile
nutzbar, da Teil der bereitgestellten Plugin-Sammlung). Erzeugt beim
Build automatisch eine `sitemap.xml` mit allen Seiten – gut fürs SEO,
keine manuelle Pflege nötig. `url` + `baseurl` sind auf die aktuelle
GitHub-Pages-Adresse (`https://fv-badminton-eppstein.github.io/website`)
gesetzt; falls ihr mal auf eine eigene Domain wechselt, hier anpassen.

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
