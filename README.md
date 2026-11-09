# Biernet for Home Assistant

Custom integration that fetches filtered beer offers from [biernet.nl](https://www.biernet.nl/bier/aanbiedingen) and exposes them as a sensor, sorted by liter price. One integration entry per search profile ("zoekopdracht"), each with its own filters and sensor.

## Installation

### Marketplace / HACS (custom repository)

1. Marketplace → custom repositories → add `https://github.com/stouten/ha-biernet`, category **Integration**
2. Install **Biernet**
3. Restart Home Assistant

### Manual

Copy `custom_components/biernet/` to `<config>/custom_components/biernet/` and restart Home Assistant.

## Setup

1. **Instellingen → Apparaten & Diensten → Integratie toevoegen → Biernet**
2. Vul de zoekopdracht in:
   - **Naam** – vrij te kiezen, bepaelt de sensornaam
   - **Winkels** – meerdere te selecteren (Albert Heijn, Jumbo, Gall & Gall, ...)
   - **Biersoorten** – alcoholvrij, pils, radler, IPA, ...
   - **Verpakkingen** – alle blikjes / flessen / kratten / fusten
   - **Alcoholpercentage** – min en max met schuifbalken, hele procenten (bijv. 0 tot 1% voor alcoholvrij)
   - **Sortering** – bijv. literprijs oplopend
   - **Top N** – aantal aanbiedingen in de sensor (standaard 10)
   - **Verversinterval** – uren (standaard 24)
3. Voeg de integratie nogmaals toe voor elke extra zoekopdracht.

Bestaande zoekopdrachten pas je aan via **Configureren** op de integratie-entry.

## Sensor

- **State**: laagste literprijs (€/l) van de zoekopdracht
- **Attributen**:
  - `items` – lijst met `naam`, `verpakking`, `winkel`, `prijs`, `literprijs`, `geldig`, `url`
  - `count`, `total_aanbiedingen`
  - `filters` – leesbare samenvatting van de filters
  - `site_url` – link naar de bijbehorende biernet.nl-pagina

## Voorbeeldkaart

Zie [`examples/biernet-markdown-card.yaml`](examples/biernet-markdown-card.yaml) voor een kant-en-klare kaart.
Gebruik `content: |` (niet `>`): een `>` vouwt alle regels tot één regel, waardoor de tabel niet als tabel wordt gerenderd.

```yaml
type: markdown
title: Alcoholvrij — beste literprijs
content: |
  {%- set sensor = 'sensor.biernet_alcoholvrije_blikjes_en_flesjes' %}
  {%- set items = state_attr(sensor, 'items') or [] %}
  {%- if items %}
  {% set total = state_attr(sensor, 'total_aanbiedingen') %}
  {% set site = state_attr(sensor, 'site_url') %}
  **{{ states(sensor) }} per liter** — [{{ total }} aanbiedingen op biernet.nl]({{ site }})
  | # | Bier | Winkel | Prijs | per liter | Geldig |
  |---|---|---|---|---|---|
  {%- for i in items %}
  | {{ loop.index }} | [{{ i.naam }}]({{ i.url }}) | {{ i.winkel }} | €{{ i.prijs }} | **€{{ i.literprijs }}** | {{ i.geldig }} |
  {%- endfor %}
  {%- else %}
  Geen aanbiedingen gevonden.
  {%- endif %}
```

## Biernet Card (custom card)

Voor een kaart met winkellogo's, productafbeeldingen, verpakking (sixpack, krat, fles, fust)
en de geldigheid van elke aanbieding is er een custom card: [`biernet-card.js`](biernet-card.js).

### Installeren

1. Download [`biernet-card.js`](biernet-card.js) naar `<config>/www/biernet-card.js`
2. Voeg het bestand toe als resource:
   - Dashboard → Bewerken → Dashboard-resources beheren → **Resource toevoegen**
   - URL: `/local/biernet-card.js`, type: `JavaScript-module`
3. Herlaad de pagina (hard refresh)

### Gebruik

```yaml
type: custom:biernet-card
entity: sensor.biernet_alcoholvrije_blikjes_en_flesjes
title: Alcoholvrij — beste literprijs
max_items: 10
```

Opties:

- `entity` (verplicht) – de Biernet-sensor
- `title` – koptekst van de kaart (standaard: de sensornaam)
- `max_items` – aantal rijen (standaard: 10)

Elke rij toont de productafbeelding, naam, verpakking, geldigheid (bijv. "t/m dinsdag 10 november"),
winkellogo met winkelnaam, prijs en literprijs. Klik op een rij opent de aanbieding op biernet.nl.

## Technische werking

De aanbiedingen op biernet.nl worden via een AJAX-endpoint geladen
(`POST /site/php/data/aanbiedingen.php` met een per-sessie token uit de pagina).
Deze integratie doet exact wat de site zelf doet en parseert het HTML-fragment.
Er is geen officiële API; als biernet.nl de site herstructureert kan de integratie breken.

## Notes

- No official API exists; this integration uses biernet.nl's internal AJAX endpoint.
- Keep the update interval at 24 hours (default); the Dutch offers change weekly.

## Support

Report issues via [GitHub Issues](https://github.com/stouten/ha-biernet/issues).
