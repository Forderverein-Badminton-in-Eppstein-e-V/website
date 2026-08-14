# TSV Eppstein Badminton – Website (GitHub Pages)

## Überblick

Statische Jekyll-Website der Badminton-Abteilung des TSV Eppstein bzw. des
Förderverein Badminton in Eppstein e.V., gehostet kostenlos auf GitHub
Pages.

- **Repo:** https://github.com/Forderverein-Badminton-in-Eppstein-e-V/website
  (Branch `main`)
- **Live-Domain:** https://new.tsv-eppstein-badminton.de (Custom Domain via
  `CNAME`-Datei, DNS bei IONOS)
- **Vorgänger:** WordPress bei IONOS, migriert 2026

Kein Datenbank-Backend, kein Server-seitiger Code – alles wird beim Push
automatisch von GitHub aus den Quelldateien zu fertigem HTML gebaut (siehe
"Jekyll-Grundprinzip" unten) und direkt ausgeliefert.

## Struktur

```
/
├── index.html                  ← Startseite
├── impressum.html, datenschutz.html, ueber-uns.html, foerderverein.html, ...
├── spielbetrieb*.html          ← Übersicht + 5 Unterseiten
├── galerie*.html               ← Übersicht + 4 Themen-Seiten (Jekyll)
├── news.html                   ← Newsliste (Jekyll)
├── kontakt.html                ← Kontaktformular (Formspree)
├── 404.html                    ← eigene Fehlerseite im Vereinsdesign
├── CNAME                       ← Custom-Domain-Konfiguration für GitHub Pages
├── _layouts/
│   ├── default.html            ← gemeinsames HTML-Grundgerüst (Kopf, Header, Hero, Footer, Script)
│   └── post.html               ← Layout für einzelne News-Post-Seiten
├── _includes/
│   ├── header.html             ← Topbar + Logo + Navigation (Liquid-Schleife über _data/nav.yml)
│   ├── footer.html              ← Vereinsinfos + rechtliche Links
│   └── sidebar-trainingszeiten.html  ← Trainingszeiten-Box (Modul für Sidebar)
├── _data/
│   ├── nav.yml                 ← Navigationsstruktur (an EINER Stelle pflegen)
│   ├── mannschaften.yml        ← Mannschaftsdaten (Liga, Links, Kader)
│   ├── sponsoren.yml           ← Sponsoren-Liste
│   └── gallery.yml             ← Bild-Daten für die Galerie-Seiten
├── _config.yml                 ← Jekyll-Konfiguration (Plugins, Vereins-Kennzahlen, SEO)
├── _posts/
│   └── YYYY-MM-DD-titel.md     ← News-Beiträge
├── assets/
│   ├── css/style.css           ← komplettes Design (Farben, Schrift, Layout)
│   ├── js/main.js              ← Mobile-Menü, Galerie-Paginierung, Lightbox, Cookie-Consent
│   ├── js/theme-switcher.js    ← TEMPORÄR: Farbschema-Testwerkzeug, siehe unten
│   ├── fonts/                  ← selbst gehostete Google Fonts (Oswald, Source Sans 3)
│   ├── img/site/               ← normale Layout-Bilder (Logo, Favicon, Vereinsfotos)
│   ├── img/gallery/<thema>/<jahr>/  ← Galerie-Fotos (.webp)
│   └── docs/                   ← PDFs (Satzung, Mitgliedsanträge)
└── README.md                   ← diese Datei (von Jekyll beim Build ignoriert, siehe _config.yml exclude)
```

## Jekyll-Grundprinzip

GitHub Pages baut die Seite automatisch mit **Jekyll**, sobald eine Datei
oben mit einem Front-Matter-Block (`---`) beginnt. Kein `Gemfile` nötig,
das ist bei GitHub Pages eingebaut.

**Jede normale Seite besteht nur aus Front Matter + eigentlichem Inhalt.**
Das komplette `<html>`-Grundgerüst steckt zentral in `_layouts/default.html`
und wird automatisch drumherum gebaut:

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

### Front-Matter-Felder (Seiten mit `layout: default`)

| Feld | Pflicht? | Zweck |
|---|---|---|
| `layout` | ja, immer `default` | aktiviert das gemeinsame Grundgerüst |
| `title` | ja | Seitentitel, u. a. für `<title>`-Tag und Hero-Überschrift. Startseite lässt `title` bewusst weg, damit `jekyll-seo-tag` automatisch auf `site.title` zurückfällt (keine Dopplung) |
| `description` | ja | Meta-Description für Suchmaschinen (siehe Abschnitt SEO) |
| `hero_title` | nein | überschreibt die H1 in der Hero-Sektion, falls sie vom `title` abweichen soll (z. B. bei den Galerie-Seiten) |
| `hero_image` | nein | schaltet auf die große Foto-Hero-Variante um (aktuell nur `index.html`) |
| `hero_image_alt`, `hero_subtitle`, `hero_cta_text`, `hero_cta_url` | nein | nur relevant zusammen mit `hero_image` |
| `noindex` | nein | setzt `<meta name="robots" content="noindex, nofollow">` (aktuell nur Impressum/Datenschutz) |
| `sitemap` | nein | `false` schließt die Seite aus `sitemap.xml` aus (aktuell nur Impressum/Datenschutz) |

News-Posts (`_posts/*.md`) brauchen **kein** `layout:` mehr im Front
Matter selbst – das setzt ein `defaults:`-Block in `_config.yml`
automatisch (`layout: post`). Das war früher schon mal vergessen worden
und hat zu unformatierten Post-Seiten geführt, daher der Schutz.

### Was bewusst NICHT im Layout steckt

Weil es sich von Seite zu Seite unterscheidet:

- Die `.layout`-Grid-Struktur mit Hauptinhalt + Sidebar
- `{% include sidebar-trainingszeiten.html %}` – nur auf Seiten, die die
  Box zeigen sollen
- Sonderfälle wie die Förderverein-Seite (eigene Bild-Sidebar statt
  Trainingszeiten) oder die Datenschutzerklärung (keine Sidebar, volle
  Breite)

### Wichtige Konventionen

- **Alle internen Links/Pfade relativ, ohne führenden Slash**
  (`kontakt.html`, nicht `/kontakt.html`). Das war am Anfang mal ein
  echtes Problem (Seite lief zwischenzeitlich unter einem Unterpfad),
  seitdem strikt durchgehalten.
- **Post-Permalinks sind flach** (`permalink: /:title.html` in
  `_config.yml`), nicht Jekylls Standard-Schema
  `/YYYY/MM/DD/titel.html` – ein verschachtelter Pfad würde alle
  relativen Pfade auf der jeweiligen Post-Seite brechen (CSS, Bilder,
  Navigation).
- **Navigation ändern:** nur `_data/nav.yml` anpassen –
  `_includes/header.html` muss dafür nicht angefasst werden.

### Lokal testen

Jekyll lässt sich in einer Linux-Umgebung einfach per `apt-get install
jekyll ruby-jekyll-seo-tag ruby-jekyll-sitemap` installieren, dann
`jekyll build` im Repo-Root ausführen und den Ordner `_site/` prüfen.
Ein einfacher `python -m http.server` reicht **nicht**, um
`{% include %}`/`{% for %}`/Layouts darzustellen – das braucht echtes
Jekyll. **Jede nicht-triviale Code-Änderung sollte vor dem Ausliefern so
getestet werden**, nicht blind gepusht.

## Design-System

- **Farben:** dunkles "Spielfeld-Grün" (`--court`) für Header/Footer, ein
  frisches Grün-Gelb (`--accent`, Filzball-Farbe) als Akzent für
  Buttons/Links – alles als CSS-Variablen in `assets/css/style.css`
  zentral definiert.
- **Schrift:** "Oswald" (kondensiert, sportlich) für Überschriften/Nav,
  "Source Sans 3" für Fließtext – beide selbst gehostet (siehe unten).
- **Wiederkehrendes Element:** gestrichelte Trennlinie (`.court-divider`)
  erinnert an eine Feldmarkierung; Statistik-Badges statt reinem
  Fließtext für Kennzahlen.
- **Externe Links:** bekommen automatisch ein kleines SVG-Pfeil-Icon
  (`a[target="_blank"]::after` in `style.css`, per CSS-Maske eingefärbt,
  passt sich automatisch der Textfarbe an) – gilt auch für Buttons.
- **Responsive:** Menü klappt unter 860px zu einem Burger-Menü zusammen.
  Untermenüs (Über uns/Spielbetrieb/Galerie) öffnen sich am Desktop per
  Hover, auf Mobile per Klick auf einen eigenen Pfeil-Button neben dem
  Hauptlink (`initSubmenuToggles()` in `main.js`) – der Hauptlink selbst
  führt weiterhin direkt zur Übersichtsseite.

### Farbschema-Test noch offen

Aktuell läuft testweise ein Umschalter für alternative
Vereinsfarben-Paletten (`assets/js/theme-switcher.js`, eingebunden in
`_layouts/default.html`, plus mehrere `assets/css/theme-*.css`-Dateien).
Auf der Live-Seite erscheint dadurch oben rechts eine kleine, bewusst
auffällig gestaltete Test-Box. **Sobald final entschieden**, sollte das
Testwerkzeug + alle nicht gewählten Paletten-Dateien entfernt werden
(eine Zeile in `default.html` + die betroffenen Dateien löschen).

## Content-Verwaltung

Alle wiederkehrenden Inhalte sind datengetrieben (`_data/*.yml`) statt
hart codiertem HTML – ein neuer Eintrag bedeutet i. d. R. nur eine
YAML-Datei anpassen, kein HTML.

### Navigation (`_data/nav.yml`)

Ein Eintrag pro Hauptmenüpunkt, optional mit `submenu`. Felder:
`label`, `url`, `submenu`, `button` (als Button statt Link darstellen,
aktuell für "Mitgliedsantrag"), `external` (öffnet in neuem Tab).
Submenu-Einträge können zusätzlich `description` (Kartentext für
Übersichtsseiten wie `spielbetrieb.html`) und `data_key` (Verknüpfung zu
`_data/gallery.yml`, siehe unten) haben.

### Mannschaften (`_data/mannschaften.yml`)

Ein Eintrag pro Mannschaft: `name`, `liga`, `tabelle_url`,
`spielplan_url` (Pflicht), optional `bild` (Dateiname in
`assets/img/site/`), `mannschaftsfuehrer`, `spieler` (Liste). Fehlende
optionale Felder werden auf `spielbetrieb-mannschaften.html` einfach
nicht angezeigt, kein Fehler. Liga-Tabellen/Spielpläne verlinken direkt
zu nuLiga (BVRP); ein Live-Einbetten der Tabelle wurde geprüft und
verworfen (kein offizielles Embed-Feature, Community-Lösung würde einen
PHP-Server voraussetzen, den GitHub Pages nicht bietet).

### Galerie (`galerie.html` + `galerie-*.html`)

- Datenquelle: `_data/gallery.yml` – pro Thema (`stadtmeisterschaft`,
  `laenderspiele`, `kinder_jugendturniere`, `strohhutfest`) eine Liste
  von Jahren, pro Jahr eine Liste von Bild-Dateinamen. Neuestes Jahr
  steht in der Liste zuerst (wird dann auch zuerst angezeigt).
- Dateinamen-Schema: `<thema>-<jahr>-<nummer>.webp`, dreistellig
  durchnummeriert, z. B. `stadtmeisterschaft-2025-001.webp`. Ursprünglich
  wurden `.jpg` verwendet, wurde aber komplett auf `.webp` umgestellt
  (kleinere Dateigröße).
- Bilddateien liegen unter `assets/img/gallery/<thema>/<jahr>/<dateiname>`.
- **Paginierung:** jedes Jahres-Grid zeigt anfangs nur 12 Bilder, Rest
  per "Weitere Bilder laden"-Button (clientseitig, `initGalleryPagination()`
  in `main.js`). Portionsgröße pro Grid überschreibbar via
  `data-page-size="N"` am `.gallery-grid`-Element.
- **Lightbox:** Klick auf ein Bild öffnet es groß im selben Fenster statt
  in neuem Tab, mit Vor/Zurück-Navigation und Escape zum Schließen
  (`initLightbox()` in `main.js`).
- Neues Jahr = neuer Eintrag in `_data/gallery.yml` + neuer Bilderordner,
  kein HTML anfassen nötig.
- **Offen:** `laenderspiele` ist in `_data/gallery.yml` noch leer (`[]`),
  bis Bilder dafür hochgeladen sind.
- **Duplikation vermieden:** Die Karten-Übersicht auf `galerie.html`
  generiert sich automatisch aus dem `submenu` des "Galerie"-Eintrags in
  `_data/nav.yml` (per `data_key` verknüpft mit `_data/gallery.yml`, für
  die dynamische "Neueste Bilder: <Jahr>"-Anzeige). Genauso funktioniert
  `spielbetrieb.html` mit dem "Spielbetrieb"-Submenu. Ein neuer
  Menüpunkt mit Untermenü taucht dadurch automatisch im Dropdown UND in
  der Kachel-Übersicht auf.

### News (`news.html`)

- Neue Beiträge kommen als einzelne Dateien in `_posts/`.
- Dateiname **muss** mit dem Datum beginnen: `YYYY-MM-DD-titel.md`.
- Front Matter: nur `title:` und `date:` nötig (kein `layout:`, siehe
  oben – wird automatisch gesetzt).
- Inhalt: normaler Markdown-Text (`**fett**` etc. funktioniert). Für
  externe Links im Post-Text **kein** Markdown-`[Text](url)` verwenden,
  sondern rohes HTML mit `target="_blank" rel="noopener"` – Markdown-Links
  unterstützen kein `target`-Attribut.
- Jeder Post bekommt automatisch eine eigene Seite (`_layouts/post.html`,
  flacher Permalink) sowie einen Eintrag in der News-Liste (`news.html`,
  zeigt nur Zusammenfassung + "Weiterlesen"-Link) und in der
  Startseiten-Vorschau (aktuell die 4 neuesten, Datum + Titel als
  kompakte Liste).

### Sponsoren (`sponsoren.html`)

Datenquelle: `_data/sponsoren.yml` – ein Eintrag pro Sponsor (`name`,
`logo`-Dateiname, optional `website`). Logo-Datei nach
`assets/img/site/` hochladen, dann eintragen.

### Globale Vereins-Kennzahlen (`_config.yml`)

Zahlen wie Mitgliederzahl, Gründungsjahr oder Anzahl Mannschaften stehen
zentral unter `verein:` in `_config.yml` und werden auf mehreren Seiten
per Liquid eingebunden (`{{ site.verein.mitglieder_gesamt }}` usw.) –
Startseite, Über uns, Meilensteine, Mannschaften. Verfügbare Werte:
`gegruendet`, `mitglieder_gesamt`, `mitglieder_kinder`,
`mitglieder_erwachsene`, `mannschaften_aktuell`, `saison_start_monat`,
`saison_aktuell`. Liga-Infos pro Mannschaft stehen NICHT hier, sondern
strukturiert in `_data/mannschaften.yml` (siehe oben).

## Bilder & Assets

### Ordnerstruktur

```
assets/img/
├── site/                          ← normale Layout-Bilder (Vereinsfotos, Hero-Bilder, Logo, Favicon, Sponsoren)
└── gallery/                       ← alle Galerie-Bilder, nach Thema UND Jahr sortiert (.webp)
    ├── stadtmeisterschaft/
    │   ├── 2025/
    │   └── 2026/
    ├── laenderspiele/              (noch leer)
    └── jugendturniere/
```

Kein separates Thumbnail-Bild nötig – die Galerie zeigt die Originale in
einem CSS-Grid mit `loading="lazy"`. Fotos vor dem Hochladen grob auf ca.
1600–2000px verkleinern (z. B. squoosh.app), damit die Seite nicht
unnötig langsam lädt.

### Schriften (selbst gehostet)

`assets/fonts/fonts.css` + `assets/fonts/*.woff2` statt Nachladen von
`fonts.googleapis.com`/`fonts.gstatic.com`. Grund: Google Fonts vom CDN
einzubinden überträgt die Besucher-IP an Google-Server, was
datenschutzrechtlich in Deutschland seit einem Urteil des LG München I
(2022) als heikel gilt. Dateien stammen von
[Fontsource](https://fontsource.org), nur Latin-Subset (deckt deutsche
Umlaute ä/ö/ü/ß ab) und nur die tatsächlich genutzten Schriftschnitte
(Oswald 500/600/700, Source Sans 3 400/600/700) – zusammen nur ca.
100 KB.

### PDFs / Downloads

Liegen unter `assets/docs/`, z. B. `assets/docs/satzung-2025.pdf` oder
`assets/docs/mitgliedsantrag-foerderverein.pdf`. Dateiname muss exakt
passen.

## Kontaktformular & Datenschutz-relevantes

### Kontaktformular (`kontakt.html`)

Nutzt [Formspree](https://formspree.io) (Form-ID `mwleoorw`) für den
Versand, da GitHub Pages kein PHP/Server-Backend hat. Das `<form>`-Tag
hat zusätzlich `action`/`method` als echten HTML-Fallback gesetzt, falls
das Formspree-AJAX-Skript (von `unpkg.com` nachgeladen) mal nicht lädt
(Adblocker, langsames Netz) – dann funktioniert der Versand trotzdem,
nur ohne die schöne Inline-Erfolgsmeldung.

### Cookie-Consent

Schlanke, nicht blockierende Leiste unten am Bildschirmrand
(`initCookieConsent()` in `main.js`, Styles unter `.cookie-consent` in
`style.css`). Erscheint nur, wenn noch keine Entscheidung gespeichert
ist (`localStorage`, Key `cookie-consent`). Zwei echte Optionen
("Akzeptieren"/"Ablehnen") – wichtig für eine rechtsgültige Einwilligung,
ein reiner "OK"-Button reicht nicht. Entscheidung später ändern: Link
"Cookie-Einstellungen" im Footer setzt die gespeicherte Entscheidung
zurück, Banner erscheint erneut.

### Google Analytics – aktiv

Läuft aktiv, mit echter Mess-ID in `assets/js/main.js`
(`GA_MEASUREMENT_ID`). Wird technisch erst geladen, nachdem im
Cookie-Banner "Akzeptieren" geklickt wurde – kein Tracking ohne
Einwilligung. Datenaufbewahrung in Google Analytics: Ereignisdaten 2
Monate, Nutzerdaten 14 Monate (verlängert sich bei neuer Aktivität).

### Impressum & Datenschutzerklärung

- **Impressum:** nennt beide vertretungsberechtigten Vorstandsmitglieder
  (§ 5 DDG verlangt das bei einem Verein zwingend, lässt sich nicht
  durch die bloße Vereinsnennung ersetzen).
- **Datenschutzerklärung:** "Verantwortliche Stelle" ist der **Verein**
  (Förderverein Badminton in Eppstein e.V.), nicht eine Einzelperson –
  nach Art. 4 Nr. 7 DSGVO korrekt so, und datenschutzfreundlicher als
  eine Privatperson zu nennen. Wurde bewusst gekürzt (redundanter
  "Auf einen Blick"-Abschnitt sowie nicht-anwendbare generische
  Cookie-/SSL-Erklärungen entfernt) – alle Pflichtangaben (Rechte,
  Auftragsverarbeiter GitHub/Formspree/Google mit Details) sind erhalten.
- Beide Seiten haben `noindex: true` + `sitemap: false` im Front
  Matter, tauchen also nicht in Google-Suchergebnissen auf, bleiben aber
  normal erreichbar (Impressumspflicht verlangt Erreichbarkeit, nicht
  Auffindbarkeit über Suchmaschinen).

## SEO

Zwei Plugins aktiv (in `_config.yml`, auf GitHub Pages ohne Gemfile
nutzbar):

- **`jekyll-sitemap`** – erzeugt automatisch `sitemap.xml`, schließt
  Seiten mit `sitemap: false` aus (siehe oben).
- **`jekyll-seo-tag`** – der `{% seo %}`-Tag in `_layouts/default.html`
  generiert `<title>` (eigene Logik im Layout wegen des
  Startseiten-Sonderfalls, `{% seo title=false %}`), Meta-Description,
  kanonische URL, Open-Graph-/Twitter-Card-Tags. Nutzt `page.title`/
  `page.description` sowie `title`, `description`, `logo`, `lang`,
  `locale` aus `_config.yml`. `lang`/`locale` explizit auf `de`/`de_DE`
  gesetzt – ohne das würde das Plugin für `og:locale` fälschlich auf
  `en_US` zurückfallen (Standardwert, unabhängig vom `<html lang="de">`
  im Layout).

`url` + `baseurl` in `_config.yml` sind auf die aktuelle Domain gesetzt;
bei Domain-Wechsel hier anpassen (bei eigener Domain an der Wurzel immer
`baseurl: ""`, nicht `"/"`).

## Hosting & Domain

- **GitHub Pages**, Custom Domain über die `CNAME`-Datei im Repo-Root
  (aktuell `new.tsv-eppstein-badminton.de`).
- **DNS bei IONOS:** A-Records (Apex) auf die vier GitHub-Pages-IPs
  (`185.199.108–111.153`), CNAME für `www` auf
  `forderverein-badminton-in-eppstein-e-v.github.io` (falls `www.`
  ebenfalls genutzt werden soll – aktuell läuft nur die Subdomain
  `new.`, kein Wechsel auf Root-Domain bisher).
- **GitHub Pages Build-Limit:** ca. 10 Builds/Stunde (Soft-Limit) –
  betrifft nicht die Anzahl der Commits, sondern wie oft die Seite neu
  gebaut wird. Bei mehreren zusammengehörigen Änderungen daher idealerweise
  in einem Rutsch pushen statt einzeln über die Stunde verteilt.
- **404-Seite** (`404.html`) im Vereinsdesign statt GitHub Pages'
  Standard-Fehlerseite, wird automatisch für alle ungültigen URLs
  ausgeliefert.

## Workflow für Änderungen (für Claude / neue Chats)

1. **Aktuellen Stand immer live vom Repo holen**, nie auf alte
   Chat-Historie verlassen – über `raw.githubusercontent.com` (einzelne
   Dateien) oder, falls ein GitHub-Token mit Leserechten übergeben
   wurde, über die authentifizierte API (`api.github.com`, 5.000 statt
   60 Anfragen/Stunde, wichtig für die komplette Dateiliste via
   `git/trees`).
2. **Jede nicht-triviale Änderung lokal mit echtem `jekyll build`
   testen** (siehe "Lokal testen" oben), bevor sie ausgeliefert wird.
3. **Falls ein Token mit Schreibrechten (Contents: Read & Write)
   übergeben wurde:** nach erfolgreichem Test direkt per Contents-API
   pushen (`PUT /repos/.../contents/<pfad>`), Commit-Link mitteilen.
   **Danach über die API gegenverifizieren** (`GET` über
   `api.github.com`, **nicht** über `raw.githubusercontent.com` – das
   cached teils einige Minuten und zeigt sonst fälschlich einen alten
   Stand).
4. **Ohne Schreib-Token:** fertige Dateien zum manuellen Hochladen
   bereitstellen.
5. Token gilt jeweils nur für die aktuelle Sandbox-Sitzung, muss in
   jedem neuen Chat erneut übergeben werden.

## Bekannte offene Punkte

- Bilder für `laenderspiele` in der Galerie (`_data/gallery.yml`)
- Farbschema-Entscheidung noch offen, Test-Werkzeug (`theme-switcher.js`
  + `theme-*.css`) noch aktiv auf der Live-Seite, siehe Design-System
  oben
- Root-Domain-Umzug (weg von der `new.`-Subdomain) wurde bisher nur an
  einer privaten Test-Domain durchgespielt, nicht am echten Repo
