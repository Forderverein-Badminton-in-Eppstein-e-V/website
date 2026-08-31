# TSV Eppstein Badminton – Website (GitHub Pages)

## Überblick

Statische Jekyll-Website der Badminton-Abteilung des TSV Eppstein bzw. des
Förderverein Badminton in Eppstein e.V., gehostet auf GitHub Pages.

- **Repo:** https://github.com/Forderverein-Badminton-in-Eppstein-e-V/website
  (Branch `main`)
- **Live-Domain:** https://tsv-eppstein-badminton.de (Custom Domain via
  `CNAME`-Datei, DNS und Domain bei Netcup)
  
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
│   ├── sidebar-trainingszeiten.html  ← Trainingszeiten-Box (Modul für Sidebar)
│   ├── cookie-banner.html      ← Consent-Banner fürs Google-Ads-Conversion-Tracking (s. u.)
│   └── schema-sportsclub.html  ← strukturierte Daten (JSON-LD, schema.org/SportsClub)
├── _data/
│   ├── nav.yml                 ← Navigationsstruktur (an EINER Stelle pflegen)
│   ├── mannschaften.yml        ← Mannschaftsdaten (Liga, Links, Kader)
│   ├── sponsoren.yml           ← Sponsoren-Liste
│   └── gallery.yml             ← Bild-Daten für die Galerie-Seiten
├── _config.yml                 ← Jekyll-Konfiguration (Plugins, Vereins-Kennzahlen, SEO)
├── _posts/
│   └── YYYY-MM-DD-titel.md     ← News-Beiträge (URL verschachtelt nach Datum, s.u.)
├── assets/
│   ├── css/style.css           ← komplettes Design (Farben, Schrift, Layout)
│   ├── js/main.js              ← Mobile-Menü, Galerie-Paginierung, Lightbox, Cookie-Banner
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
| `title` | ja | Seitentitel, u. a. für Hero-Überschrift (Fallback für `hero_title`) und `<title>`-Tag – Layout hängt automatisch `– {{ site.title }}` an (siehe `_layouts/default.html`). Auf der Startseite bewusst themenbezogen formuliert (nicht nur der Markenname), da "Eppstein" auch eine bekannte, unabhängige Stadt in Hessen ist und ein unterscheidendes Keyword im wichtigsten Title-Tag der Seite fehlte |
| `description` | ja | Meta-Description für Suchmaschinen (siehe Abschnitt SEO) |
| `hero_title` | nein | überschreibt die H1 in der Hero-Sektion, falls sie vom `title` abweichen soll (z. B. bei den Galerie-Seiten) |
| `hero_image` | nein | schaltet auf die große Foto-Hero-Variante um (aktuell nur `index.html`) |
| `hero_subtitle`, `hero_cta_text`, `hero_cta_url` | nein | nur relevant zusammen mit `hero_image` |
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

- **Alle internen Links/Pfade sind root-relativ, mit führendem Slash**
  (`/kontakt.html`, nicht `kontakt.html`). Die Seite läuft an der
  Domain-Wurzel (eigene Custom Domain, kein Unterpfad), dadurch
  funktioniert das unabhängig davon, unter welchem Pfad eine Seite
  selbst liegt – wichtig vor allem für die News-Posts (siehe unten),
  die verschachtelt nach Datum liegen.
- **Post-Permalinks folgen Jekylls Standard-Schema**
  (`permalink: /:year/:month/:day/:title.html` in `_config.yml`),
  landen also verschachtelt nach Datum (z. B. `/2026/08/22/titel.html`).
  Das funktioniert nur, weil alle Links/Pfade root-relativ sind (siehe
  Punkt oben) – bei Pfaden ohne führenden Slash würden CSS, Bilder und
  Navigation auf jeder Post-Seite ins Leere zeigen, weil der Browser sie
  relativ zum verschachtelten Datums-Unterpfad auflösen würde.
- **Navigation ändern:** nur `_data/nav.yml` anpassen –
  `_includes/header.html` muss dafür nicht angefasst werden.
- **Kein Gendern in Fließtexten** (weder `:innen`, `*innen`, `/innen` noch
  Binnen-I). Stattdessen entweder einen neutralen Begriff finden (z. B.
  "Mitglieder", "Teilnehmende" nur falls es wirklich neutral gemeint ist)
  oder einfach die klassische männliche Form verwenden (z. B. "Spieler",
  "Teilnehmer"). Gilt für alle Seiten, News-Posts und Front-Matter-Texte
  (Title/Description).

### Lokal testen

Jekyll lässt sich in einer Linux-Umgebung einfach per `apt-get install
jekyll ruby-jekyll-seo-tag ruby-jekyll-sitemap` installieren, dann
`jekyll build` im Repo-Root ausführen und den Ordner `_site/` prüfen.
Ein einfacher `python -m http.server` reicht **nicht**, um
`{% include %}`/`{% for %}`/Layouts darzustellen – das braucht echtes
Jekyll. **Jede nicht-triviale Code-Änderung sollte vor dem Ausliefern so
getestet werden**, nicht blind gepusht.

## Design-System

- **Farben:** kräftiges Wappen-Blau (`--court`) für Header/Footer, ein
  kräftiges Wappen-Gold (`--accent`) als Akzent für Buttons/Links –
  alles als CSS-Variablen in `assets/css/style.css` zentral definiert.
  Angelehnt an die Farben im Vereinswappen, aber abgeschwächt/verfeinert
  gegenüber den reinen Wappenfarben.
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
`assets/img/site/`), `mannschaftsfuehrer`, `spieler` (Liste der Namen auf
dem Teambild, von links nach rechts), `spieler_ohne_bild` (Liste
weiterer Spieler, die noch nicht mit auf dem Teambild sind).
Fehlende optionale Felder werden auf `spielbetrieb-mannschaften.html`
einfach nicht angezeigt, kein Fehler. Liga-Tabellen/Spielpläne verlinken direkt
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
- **Offen:** `laenderspiele` und `strohhutfest` sind in `_data/gallery.yml`
  noch leer (`[]`), bis Bilder dafür hochgeladen sind. Die entsprechenden
  Galerie-Seiten zeigen bis dahin automatisch einen "noch keine Bilder"-Hinweis
  (`empty-state`).
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
- **Bild(er) zum Post:** optionales `images:`-Feld im Front Matter statt
  Bild inline in den Markdown-Text zu setzen – erscheint dann auf der
  einzelnen Post-Seite rechts neben dem Text (an der Stelle, an der auf
  anderen Seiten die Trainingszeiten-Box steht; auf Mobile darunter),
  nicht im Fließtext. Dateien liegen flach unter `assets/img/news/`,
  Dateiname mit Datum des Posts als Präfix (analog zum Post-Dateinamen),
  z. B. `assets/img/news/2026-08-22-titel.jpg`. Pro Bild ein Listeneintrag
  mit `src` (Pfad mit führendem Slash) und `alt` (dient auch als
  Bildunterschrift), optional `width`/`height` (verhindert Layout-Sprung
  beim Laden):
  ```yaml
  images:
    - src: /assets/img/news/2026-08-22-titel.jpg
      alt: "Kurze Bildbeschreibung"
      width: 261
      height: 392
  ```
  Mehrere Einträge sind möglich, werden dann untereinander in der
  Sidebar angezeigt. Ohne `images:`-Feld sieht die Post-Seite aus wie
  bisher (volle Breite, keine Sidebar).
- Inhalt: normaler Markdown-Text (`**fett**` etc. funktioniert). Für
  externe Links im Post-Text **kein** Markdown-`[Text](url)` verwenden,
  sondern rohes HTML mit `target="_blank" rel="noopener"` – Markdown-Links
  unterstützen kein `target`-Attribut. Interne Links/Bilder im Post-Text
  brauchen den führenden Slash (`/kontakt.html`, `/assets/img/site/...`),
  da jeder Post unter einem verschachtelten Datums-Pfad liegt (siehe
  "Wichtige Konventionen" oben) – ohne Slash würden sie relativ zu
  diesem Unterpfad aufgelöst und ins Leere zeigen.
- Jeder Post bekommt automatisch eine eigene Seite (`_layouts/post.html`,
  Permalink verschachtelt nach Datum, z. B. `/2026/08/22/titel.html`)
  sowie einen Eintrag in der News-Liste (`news.html`, zeigt nur
  Zusammenfassung + "Weiterlesen"-Link) und in der Startseiten-Vorschau
  (aktuell die 4 neuesten, Datum + Titel als kompakte Liste).

### Sponsoren (`sponsoren.html`)

Datenquelle: `_data/sponsoren.yml` – ein Eintrag pro Sponsor (`name`,
`logo`-Dateiname, optional `website`). Logo-Datei nach
`assets/img/site/` hochladen, dann eintragen.

### Globale Vereins-Kennzahlen (`_config.yml`)

Zahlen wie Mitgliederzahl, Gründungsjahr oder Anzahl Mannschaften stehen
zentral unter `verein:` in `_config.yml` und werden auf mehreren Seiten
per Liquid eingebunden (`{{ site.verein.mitglieder_gesamt }}` usw.) –
Startseite, Über uns, Abteilung & Verein, Mannschaften. Verfügbare Werte:
`gegruendet`, `mitglieder_gesamt`, `mitglieder_kinder`,
`mitglieder_erwachsene`, `mannschaften_aktuell`, `saison_start_monat`,
`saison_aktuell`. Liga-Infos pro Mannschaft stehen NICHT hier, sondern
strukturiert in `_data/mannschaften.yml` (siehe oben).

## Bilder & Assets

### Ordnerstruktur

```
assets/img/
├── site/                          ← normale Layout-Bilder (Vereinsfotos, Hero-Bilder, Logo, Favicon, Sponsoren)
├── news/                          ← Bilder zu einzelnen News-Posts (siehe Abschnitt News unten)
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

### GoatCounter – aktiv

Einziges Analytics-Tool der Website (Google Analytics wurde entfernt,
siehe Git-Historie). Eingebunden per Script-Tag in
`_layouts/default.html`
(`data-goatcounter="https://stats.tsv-eppstein-badminton.de/count"`), lädt
bei **jedem** Seitenaufruf ohne Cookie-Hinweis, da cookielos und ohne
personenbezogene Kennungen – daher keine Einwilligungspflicht nach § 25
TDDDG. `stats.tsv-eppstein-badminton.de` ist eine per CNAME eingerichtete
Custom Domain auf den GoatCounter-Account `fv-badminton.goatcounter.com`
(reine Vanity-Domain, kein Adblocker-Umgehungsmechanismus – das
`count.js`-Script selbst lädt weiterhin von `gc.zgo.at`). Dashboard
weiterhin auch unter https://fv-badminton.goatcounter.com erreichbar.
Dokumentiert in `datenschutz.html` unter "4. Analyse-Tools".

### Google Ads Conversion-Tracking + Cookie-Banner

Zusätzlich zu GoatCounter läuft (unabhängig davon) Google Ads
Conversion-Tracking (`gtag.js`), Pflichtvoraussetzung für die Teilnahme am
kostenlosen **Google Ad Grants**-Kontingent für gemeinnützige Vereine –
Google verlangt eine funktionierende Conversion-Messung, sonst wird die
Anzeigenauslieferung eingeschränkt.

- Eingebunden im `<head>` von `_layouts/default.html`, ausführlich
  kommentiert direkt im Code.
- Läuft über **Google Consent Mode**: Beim Seitenaufruf ist der Zustand
  standardmäßig `denied` (keine Werbe-Cookies, keine Personalisierung, nur
  ein anonymes cookiefreies Signal). Erst nach Klick auf "Akzeptieren" im
  Cookie-Banner (`_includes/cookie-banner.html`, Logik in `main.js` unter
  `initCookieBanner()`) wird auf `granted` umgeschaltet. Die getroffene Wahl
  wird in `localStorage` unter `ads_consent` gespeichert und beim nächsten
  Seitenaufruf direkt als Startzustand übernommen.
- `ad_personalization` ist bewusst von der Nutzerwahl entkoppelt und bleibt
  immer `denied` – gewollt ist ausschließlich Conversion-Tracking, kein
  Remarketing.
- Ein "Cookie-Einstellungen"-Button im Footer (`_includes/footer.html`)
  öffnet den Banner erneut, um die Wahl jederzeit zu ändern.
- Dokumentiert in `datenschutz.html` unter "5. Google Ads
  Conversion-Tracking" (Anker `#google-ads-tracking`), verlinkt aus dem
  Cookie-Banner und aus "3. Datenerfassung auf dieser Website".

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
  Auftragsverarbeiter GitHub/Formspree mit Details) sind erhalten.
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
  generiert Meta-Description, kanonische URL, Open-Graph-/Twitter-Card-Tags
  sowie ein generisches `WebSite`-JSON-LD-Schema. `<title>` wird bewusst
  NICHT vom Plugin erzeugt (`{% seo title=false %}`), sondern per eigener
  Liquid-Logik im Layout, damit auf jeder Seite automatisch
  `"<page.title> – <site.title>"` entsteht statt der vom Plugin
  bevorzugten Schreibweise mit Pipe-Trenner. Nutzt `page.title`/
  `page.description` sowie `title`, `description`, `logo`, `lang`,
  `locale` aus `_config.yml`. `lang`/`locale` explizit auf `de`/`de_DE`
  gesetzt – ohne das würde das Plugin für `og:locale` fälschlich auf
  `en_US` zurückfallen (Standardwert, unabhängig vom `<html lang="de">`
  im Layout).
- **`_includes/schema-sportsclub.html`** – zusätzliches, manuell
  gepflegtes JSON-LD-Schema (`schema.org/SportsClub`) ergänzend zum
  generischen `WebSite`-Schema von `jekyll-seo-tag`: Vereinsadresse,
  tatsächliche Trainingshalle (Isenachsporthalle) samt Trainingszeiten
  und Sportart, maschinenlesbar für ein mögliches
  Local-/Öffnungszeiten-Snippet bei Google. Trainingszeiten hier bewusst
  redundant zu `_includes/sidebar-trainingszeiten.html` gepflegt (keine
  gemeinsame Datenquelle, um das Datenmodell nicht zu vergrößern) – bei
  Änderung der Zeiten an beiden Stellen anpassen.

`url` + `baseurl` in `_config.yml` sind auf die aktuelle Domain gesetzt;
bei Domain-Wechsel hier anpassen (bei eigener Domain an der Wurzel immer
`baseurl: ""`, nicht `"/"`).

### Canonical-/Duplicate-Content-Fix (`_config.yml` → `defaults`)

Der globale `permalink:`-Wert in `_config.yml` ist eigentlich nur für
News-Posts gedacht, wirkt über Jekylls `permalink_style` aber ungewollt
auch auf normale Seiten: `page.url` wird dadurch OHNE `.html` berechnet
(z. B. `/kontakt` statt `/kontakt.html`), obwohl die tatsächlich
ausgelieferte Datei weiterhin `kontakt.html` heißt und ausnahmslos jeder
interne Link im Menü/Footer/Seiteninhalt auf die `.html`-Variante zeigt.
Das führte dazu, dass Canonical-Tag, `og:url` und `sitemap.xml` auf die
`.html`-lose URL zeigten – im Widerspruch zur kompletten internen
Verlinkung und damit klassischer doppelter Content (beide Varianten
lieferten identischen Inhalt mit Status 200). Fix: ein `defaults:`-Block
in `_config.yml` (Scope `type: "pages"`) erzwingt `page.url` für normale
Seiten explizit auf Basisname + tatsächliche Dateiendung (`:output_ext`
statt hart `.html`, damit von `jekyll-sitemap` automatisch erzeugte
Seiten wie `robots.txt`/`sitemap.xml` ihre eigene Endung behalten).
Betrifft nur normale Seiten – News-Posts haben ihr eigenes
Permalink-Schema (siehe oben) und sind hier bewusst ausgeschlossen.

## Hosting & Domain

- **GitHub Pages**, Custom Domain über die `CNAME`-Datei im Repo-Root
  (aktuell `tsv-eppstein-badminton.de`, Root-Domain).
- **DNS bei Netcup:** A-Records (Apex) auf die vier GitHub-Pages-IPs
  (`185.199.108–111.153`), CNAME für `www` auf
  `forderverein-badminton-in-eppstein-e-v.github.io`.
- **GitHub Pages Build-Limit:** ca. 10 Builds/Stunde (Soft-Limit) –
  betrifft nicht die Anzahl der Commits, sondern wie oft die Seite neu
  gebaut wird. Bei mehreren zusammengehörigen Änderungen daher idealerweise
  in einem Rutsch pushen statt einzeln über die Stunde verteilt.
- **404-Seite** (`404.html`) im Vereinsdesign statt GitHub Pages'
  Standard-Fehlerseite, wird automatisch für alle ungültigen URLs
  ausgeliefert.

## Workflow für Änderungen (für Claude / neue Chats)

Gilt für **Claude-Chat-Sessions ohne direkten Repo-/Git-Zugriff** (Zugriff
nur über die GitHub-API bzw. `raw.githubusercontent.com`, s. u.). Für
**Claude-Code-Sessions mit Git-Zugriff** gilt stattdessen der Workflow aus
`CLAUDE.md` im Repo-Root (eigener `claude/...`-Branch, danach direkt nach
`main` mergen und pushen statt Pull Request, kein Pull-Request-Workflow).

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

- Bilder für `laenderspiele` und `strohhutfest` in der Galerie
  (`_data/gallery.yml`)
