# TSV Eppstein Badminton – Website (GitHub Pages)

## Struktur

```
/
├── index.html                  ← Startseite (fertig, als Vorlage für weitere Seiten)
├── partials/
│   ├── header.html             ← Topbar + Logo + Navigation (an EINER Stelle pflegen)
│   ├── footer.html             ← Vereinsinfos + rechtliche Links
│   └── sidebar-trainingszeiten.html  ← Trainingszeiten-Box (Modul für Sidebar)
├── assets/
│   ├── css/style.css           ← komplettes Design (Farben, Schrift, Layout)
│   └── js/main.js              ← bindet header.html/footer.html ein, Mobile-Menü
```

## Funktionsprinzip

Jede Seite hat im HTML nur zwei leere Platzhalter:

```html
<div id="site-header"></div>
...Seiteninhalt...
<div id="site-footer"></div>
<script src="/assets/js/main.js"></script>
```

`main.js` lädt beim Aufruf automatisch `partials/header.html`,
`partials/footer.html` und, falls auf der Seite vorhanden,
`partials/sidebar-trainingszeiten.html` per `fetch()` und fügt sie ein.
Ändert sich z. B. ein Navigationspunkt oder eine Trainingszeit, reicht es,
die jeweilige Partial-Datei einmal anzupassen – alle Seiten sind sofort
aktuell.

**Die Trainingszeiten-Box als Sidebar-Modul einbinden:** In jeder Seite,
die die Box zeigen soll, einfach einen leeren Platzhalter einbauen –
keinen Inhalt reinschreiben:

```html
<div id="sidebar-trainingszeiten"></div>
```

`main.js` füllt diesen Platzhalter automatisch. Ist auf einer Seite kein
Element mit dieser ID vorhanden (z. B. bei einer reinen Vollbreite-Seite
ohne Sidebar), passiert einfach nichts – kein Fehler.

**Wichtig:** `fetch()` auf lokale Dateien funktioniert nur über HTTP(S).
Auf GitHub Pages ist das automatisch der Fall. Zum lokalen Testen vor dem
Hochladen brauchst du einen kleinen lokalen Server, z. B.:

```bash
cd site-ordner
python -m http.server 8000
```

und dann `http://localhost:8000` im Browser öffnen (nicht die Datei per
Doppelklick öffnen – dann bleibt Header/Footer leer).

## Design-Entscheidungen

- **Farben:** dunkles "Spielfeld-Grün" für Header/Footer, ein frisches
  Grün-Gelb (Filzball-Farbe) als Akzent für Buttons/Links, statt der
  generischen Creme/Terracotta- oder Dunkel-mit-Neongrün-Templates.
- **Schrift:** "Oswald" (kondensiert, sportlich) für Überschriften/Nav,
  "Source Sans 3" für Fließtext – gut lesbar, wirkt nicht wie Standard-
  Bootstrap.
- **Wiederkehrendes Element:** gestrichelte Trennlinie (`.court-divider`)
  erinnert an eine Feldmarkierung; Statistik-Badges (Anzahl Mannschaften,
  Liga, Saisonstart) statt reinem Fließtext.
- Responsive: Menü klappt unter 860px zu einem Burger-Menü zusammen.

## PDFs / Downloads

Dokumente wie Satzung oder Mitgliedsanträge liegen unter `assets/docs/`,
z. B. `assets/docs/satzung-2025.pdf` oder
`assets/docs/mitgliedsantrag-foerderverein.pdf`. Die Links in den HTML-Seiten
zeigen bereits lokal dorthin – du musst die PDFs nur noch in genau diesen
Pfad hochladen (Dateiname beachten, muss exakt passen).

## Bilder

### Ordnerstruktur

```
assets/img/
├── site/                          ← normale Layout-Bilder (Vereinsfotos, Hero-Bilder, Logos, Sponsoren)
│   └── fv-team.jpg
└── gallery/                       ← alle Galerie-Bilder, nach Thema UND Jahr sortiert
    ├── strohhutfest/
    │   └── 2025/
    │       ├── 01.jpg
    │       └── 02.jpg
    ├── stadtmeisterschaft/
    │   └── 2025/
    ├── laenderspiele/
    │   └── 2025/
    └── jugendturniere/
        └── 2025/
```

- **`site/`** für alle "normalen" Bilder, die im Fließtext oder Layout einer Seite
  vorkommen (z. B. Vorstandsfoto auf der Förderverein-Seite).
- **`gallery/<thema>/<jahr>/`** für Galerie-Fotos. Pro Thema (Strohhutfest,
  Stadtmeisterschaft, Länderspiele, Jugendturniere) ein Unterordner pro Jahr.
  Kommt ein neues Jahr dazu, legst du einfach einen neuen Jahresordner an –
  bestehende Bilder/Links bleiben unberührt. Auf der jeweiligen Gallerie-Seite
  kannst du die Jahre z. B. als Abschnitte oder Tabs darstellen.
- Dateinamen bewusst einfach gehalten (`01.jpg`, `02.jpg`, …) statt der
  kryptischen WordPress-Originalnamen.

### Bilder aus WordPress herunterladen

Ich kann Bilder von deiner WordPress-Domain nicht automatisch herunterladen
(die Sandbox, in der ich Dateien baue, hat keinen Zugriff auf
`tsv-eppstein-badminton.de`). Für jedes Bild, das eine Seite braucht, gehst
du daher so vor:

1. Bild-URL öffnen (steht jeweils im HTML-Kommentar bzw. ich nenne sie dir)
2. Rechtsklick → "Bild speichern unter" (oder im WordPress-Mediencenter
   herunterladen)
3. Datei in den passenden Ordner legen, z. B. `assets/img/site/fv-team.jpg`
4. Beim Hochladen ins GitHub-Repo denselben Pfad beibehalten

Für die Förderverein-Seite konkret: Lade
`https://tsv-eppstein-badminton.de/wp-content/uploads/2025/11/fv_team-768x1024.jpg`
herunter und speichere sie als `assets/img/site/fv-team.jpg`.

### Alle aktuell benötigten Bilder

| Seite | Original-URL | Lokaler Zielpfad |
|---|---|---|
| Förderverein | `.../uploads/2025/11/fv_team-768x1024.jpg` | `assets/img/site/fv-team.jpg` |
| Training Kinder/Jugend | `.../uploads/2025/11/renate.jpg` | `assets/img/site/renate.jpg` |
| Training Kinder/Jugend | `.../uploads/2025/11/arthur.jpg` | `assets/img/site/arthur.jpg` |
| Unsere Halle | `.../uploads/2025/11/isenachhalle-1024x768.jpg` | `assets/img/site/isenachhalle.jpg` |
| Sponsoren | `.../uploads/2025/11/spiegel.jpg` | `assets/img/site/spiegel.jpg` |
| Sponsoren | `.../uploads/2025/11/SPK-Logo_nCi-rot-tr-RGB-768x1024.png` | `assets/img/site/spk-logo.png` |

(`...` = `https://tsv-eppstein-badminton.de/wp-content`). Alle Bilder kommen
nach `assets/img/site/`, da es Layout-/Inhaltsbilder sind, keine
Galerie-Fotos.

## Kontaktformular

Auf `/kontakt.html` (noch zu bauen) brauchen wir einen externen Formular-
Dienst, da GitHub Pages kein PHP/Server-Backend hat. Empfehlenswert für
kleine Vereine: Formspree (kostenlos bis 50 Nachrichten/Monat) oder ein
einfacher `mailto:`-Link als Fallback.

## Nächste Schritte

Für jede weitere Unterseite gilt dasselbe Muster wie `index.html`:
Kopf/Fuß-Platzhalter + `<link>`/`<script>`-Einbindung übernehmen, nur den
Inhalt zwischen `<main>...</main>` austauschen. Schick mir einfach die
nächste URL, dann bekommst du die passende Datei.

## Fertige Seiten

| WordPress-URL | Neue Datei | Status |
|---|---|---|
| `/` (Startseite) | `index.html` | ✅ fertig |
| `/impressum/` | `impressum.html` | ✅ fertig |
| `/foerderverein/` | `foerderverein.html` | ✅ fertig |
| `/ueber-uns/` | `ueber-uns.html` | ✅ fertig |
| `/ueber-uns/kontakt/` | `kontakt.html` | ⏳ noch offen (Kontaktformular-Dienst nötig) |
| `/spielbetrieb/` | `spielbetrieb.html` | ✅ fertig |
| `/spielbetrieb/training-erwachsene/` | `spielbetrieb-training-erwachsene.html` | ✅ fertig |
| `/spielbetrieb/training-kinder-und-jugend/` | `spielbetrieb-training-kinder-jugend.html` | ✅ fertig |
| `/spielbetrieb/mannschaften/` | `spielbetrieb-mannschaften.html` | ✅ fertig |
| `/spielbetrieb/turniere/` | `spielbetrieb-turniere.html` | ✅ fertig |
| `/spielbetrieb/unsere-halle/` | `spielbetrieb-unsere-halle.html` | ✅ fertig |
| `/gallerie/` + Unterseiten | `gallerie*.html` | ⏳ noch offen (eigenes Konzept mit Jahren) |
| `/news/` | `news.html` | ✅ fertig (aktuell leer, Muster für neue Einträge im Kommentar) |
| `/sponsoren/` | `sponsoren.html` | ✅ fertig |
| `/datenschutzerklaerung/` | `datenschutz.html` | ✅ fertig – **vor Veröffentlichung Hinweis-Box oben auf der Seite lesen!** |

**Namensschema für die noch offenen Seiten:**

| WordPress-URL | Neue Datei |
|---|---|
| `/ueber-uns/kontakt/` | `kontakt.html` |
| `/gallerie/` | `gallerie.html` |
| `/gallerie/stadtmeisterschaft/` | `gallerie-stadtmeisterschaft.html` |
| `/gallerie/laenderspiel/` | `gallerie-laenderspiele.html` |
| `/kinder-und-jugendturniere/` | `gallerie-kinder-jugendturniere.html` |
| `/strohhutfest/` | `gallerie-strohhutfest.html` |

Für diese Seiten braucht es noch eigene Konzepte (Kontaktformular-Dienst
bzw. Jahres-Struktur für die Galerien) – die bauen wir, sobald du bereit
bist.
