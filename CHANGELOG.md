# Changelog

Alle opvallende wijzigingen aan de Biernet-integratie staan in dit bestand.
Het versienummer komt overeen met de tag/release op GitHub en de `version` in `manifest.json`.

## [1.2.0] — niet gereleased

- Fix: de entry-migratie crashte met `AttributeError: version cannot be changed directly`; de versie wordt nu via `async_update_entry` gezet en de percentage-mapping gebruikt hele procenten (`0tm1` in plaats van `0.0tm1.0`)
- Fix: de markdown-voorbeeldkaart gebruikte `content: >` waardoor de tabel niet als tabel werd gerenderd; nu `content: |`, met kant-en-klare kaart in `examples/`
- Nieuw: winkellogo (`winkel_logo`) en productafbeelding (`afbeelding`) per aanbieding in de sensor-attributen
- Nieuw: `biernet-card.js` custom card met logo's, productafbeeldingen, verpakking, geldigheid per aanbieding, prijzen en links naar biernet.nl
- De markdown-voorbeeldkaart toont nu ook de kolommen Verpakking en Geldig
- Installatie-instructies voor de custom card toegevoegd aan de README

## [1.1.0]

- Fix: de integratie kon niet meer opstarten met recente Home Assistant-versies (`async_forward_platforms` bestaat niet meer); nu wordt `async_forward_entry_setups` gebruikt
- Nette labels in de configuratieflow: winkels, biersoorten, verpakkingen en sortering tonen leesbare namen
- Alcoholpercentage met min/max-schuifbalken in hele procenten (0–20), zoals op biernet.nl
- Automatische migratie van bestaande zoekopdrachten naar het nieuwe percentage-formaat
- "Configureren" past gewijzigde opties nu daadwerkelijk toe
- Vertalingen (NL/EN) en README bijgewerkt

## [1.0.0]

- Eerste versie: één entry per zoekopdracht met filters voor winkels, biersoorten, verpakkingen, alcoholpercentage en sortering
