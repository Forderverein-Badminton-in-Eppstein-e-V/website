# Arbeitsweise in diesem Repo

## Git-Workflow: immer direkt auf `main`

- Pull Requests sind für dieses Repository absichtlich deaktiviert. Es wird
  ausschließlich direkt auf `main` gearbeitet – kein PR-Workflow, kein
  liegen gelassener Feature-Branch.
- Claude Code (Web-Sessions) legt pro Task automatisch einen eigenen
  `claude/...`-Branch an und pusht zunächst dorthin – das ist eine
  Plattform-Vorgabe der Web-Session selbst und lässt sich nicht abschalten.
  Er ist aber reine Zwischenstation, kein Ziel: **ausnahmslos bei jedem
  Task**, ohne Nachfragen, direkt im Anschluss:
  1. Branch nach `main` mergen und pushen
     (`git checkout -B main origin/main && git merge <branch>`, dann
     `git push origin main`).
  2. Den Feature-Branch danach löschen (lokal per `git branch -d <branch>`
     und remote per `git push origin --delete <branch>`).
  3. Schlägt das Remote-Löschen fehl (z. B. HTTP 403 durch fehlende
     Berechtigung des Session-Tokens), nicht endlos wiederholen – kurz im
     Chat erwähnen und mit der eigentlichen Aufgabe fortfahren, statt darauf
     zu warten.
- Ausnahme vom Löschen nur, wenn die Nutzerin/der Nutzer ausdrücklich darum
  bittet, den Branch (vorerst) zu behalten.

## Content-Pflege: README.md lesen

Vor inhaltlichen Änderungen an der Website (neue Seiten, Content-Struktur,
Jekyll-Konventionen, SEO, Datenschutz, Bilder/Assets) **README.md lesen** –
dort steht das komplette Datenmodell sowie die Build-/Test-Konventionen im
Detail. Hier nur die wichtigsten Stolperfallen, die man sonst versehentlich
bricht:

- Alle internen Links/Pfade sind root-relativ mit führendem Slash
  (`/kontakt.html`, nicht `kontakt.html`).
- Wiederkehrende Inhalte (Navigation, Mannschaften, Sponsoren, Galerie)
  sind datengetrieben über `_data/*.yml` – dafür kein HTML anfassen.
- Jede nicht-triviale Code-Änderung vor dem Push lokal mit echtem
  `jekyll build` testen (siehe README, Abschnitt "Lokal testen").
