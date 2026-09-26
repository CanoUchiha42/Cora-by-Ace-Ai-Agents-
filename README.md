# Cora by ACE AI AGENTS

Produktionsorientierte statische Lead-Landingpage für Cora AI.

## Dateien
- `index.html` – Landingpage, Demo, ROI-Rechner und Leadformular
- `impressum.html` – Impressum mit markierten Anbieter-Platzhaltern
- `datenschutz.html` – Datenschutzerklärung als anzupassende Vorlage

## Google Sheets
Die Landingpage nutzt denselben bestehenden Google-Apps-Script-Web-App-Endpunkt wie die Vorgängerseiten. Die URL steht in `index.html` in `GOOGLE_SHEETS_WEBHOOK_URL`.

Der Submit ist additiv aufgebaut und erhält bestehende Felder wie:
`name`, `company`, `email`, `phone`, `website`, `company_size`, `interest`, `message`, `privacy_consent`, `website_check`.

Zusätzlich werden `source`, `page` und `submitted_at_client` übermittelt.

## Vor Livegang
1. Anbieter-/Kontaktdaten in Impressum und Datenschutz ersetzen.
2. Datenschutzrechtliche Prüfung des tatsächlichen Google-Setups durchführen.
3. Apps-Script-Spaltenmapping prüfen, insbesondere neue Felder.
4. GitHub Pages auf `main` aktivieren.
5. Formular mit einer Testanfrage prüfen.
6. Keine Erfolgsgarantie aus dem ROI-Rechner ableiten.
