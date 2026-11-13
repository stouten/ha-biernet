# Changelog

Alle opvallende wijzigingen aan de Biernet-integratie staan in dit bestand.
Het versienummer komt overeen met de tag/release op GitHub en de `version` in `manifest.json`.

## [1.2.3] — niet gereleased

- Fix: de icoontjes staan nu ook in `custom_components/biernet/brand/` (icon.png + logo.png). Sinds Home Assistant 2026.3 leest HA de brand-afbeeldingen van custom integraties uit die map, en de Marketplace (2026.11+) serveert ze zo ook voor nog niet geïnstalleerde integraties

## [1.2.2] — niet gereleased

- Fix: het service-apparaat toonde "door biernet.nl" als maker; nu "Biernet integration"
- Nieuw: eigen getekend icoon (`icon.png`) en logo (`logo.png`) in de repo-root, zichtbaar in HACS en het Home Assistant Marketplace

## [1.2.1]

- Fix: winkelnamen zoals "Poiesz Logo" zijn nu zonder het "Logo"-achtervoegsel (biernet.nl gebruikt de titel van het logo als winkelnaam)
- Custom card: productafbeeldingen hebben geen grijze achtergrond meer, de winkelkolom heeft een vaste breedte (logo's en namen verspringen niet meer tussen rijen) en de koptekst toont "10 van 30 aanbiedingen" in plaats van alleen het totaal

## [1.2.0]

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
