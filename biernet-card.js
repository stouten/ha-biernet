const BiernetCardVersion = "1.0.0";

class BiernetCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("hui-card-picker");
  }

  static getStubConfig() {
    return { entity: "sensor.biernet_alcoholvrije_blikjes_en_flesjes", title: "Bier aanbiedingen" };
  }

  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("biernet-card: je moet een sensor opgeven (entity)");
    }
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    const stateObj = this._hass && this._hass.states[this._config.entity];
    const items = stateObj && stateObj.attributes.items;
    return Math.min((items ? items.length : 0) + 2, 20);
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (!this._config || !this._hass || !this.isConnected) {
      return;
    }
    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj) {
      this.innerHTML = `<ha-card><div class="biernet-error">biernet-card: sensor ${this._config.entity} niet gevonden</div></ha-card>`;
      return;
    }

    const items = stateObj.attributes.items || [];
    const maxItems = this._config.max_items || 10;
    const title = this._config.title || stateObj.attributes.friendly_name || "Biernet";
    const siteUrl = stateObj.attributes.site_url;

    const rows = items.slice(0, maxItems).map((item) => {
      const logo = item.winkel_logo
        ? `<img class="biernet-store-logo" src="${item.winkel_logo}" alt="${this._escape(item.winkel)}">`
        : "";
      const image = item.afbeelding
        ? `<img class="biernet-product-image" src="${item.afbeelding}" alt="${this._escape(item.naam)}">`
        : "";
      const geldig = item.geldig ? `<div class="biernet-valid">${this._escape(item.geldig)}</div>` : "";
      return `
        <a class="biernet-row" href="${item.url}" target="_blank" rel="noopener noreferrer">
          <div class="biernet-image-cell">${image}</div>
          <div class="biernet-main">
            <div class="biernet-name">${this._escape(item.naam)}</div>
            <div class="biernet-packaging">${this._escape(item.verpakking)}</div>
            ${geldig}
          </div>
          <div class="biernet-store">${logo}<span>${this._escape(item.winkel)}</span></div>
          <div class="biernet-prices">
            <div class="biernet-price">&euro;${this._escape(item.prijs)}</div>
            <div class="biernet-liter-price">&euro;${this._escape(item.literprijs)}/l</div>
          </div>
        </a>`;
    });

    const shown = Math.min(items.length, maxItems);
    const total = stateObj.attributes.total_aanbiedingen || items.length;
    const headerLink = siteUrl
      ? `<a class="biernet-header-link" href="${siteUrl}" target="_blank" rel="noopener noreferrer">${shown} van ${total} aanbiedingen op biernet.nl</a>`
      : "";

    this.innerHTML = `
      <ha-card>
        <div class="biernet-card-header">
          <div class="biernet-card-title">${this._escape(title)}</div>
          ${headerLink}
        </div>
        <div class="biernet-rows">${rows.join("") || "Geen aanbiedingen gevonden."}</div>
      </ha-card>
      ${this._styles()}`;
  }

  _styles() {
    return `
      <style>
        .biernet-card-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 16px 16px 0 16px;
        }
        .biernet-card-title {
          font-size: 1.2em;
          font-weight: 500;
        }
        .biernet-header-link {
          color: var(--secondary-text-color);
          font-size: 0.9em;
          text-decoration: none;
        }
        .biernet-rows {
          padding: 8px 8px 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .biernet-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: var(--ha-card-border-radius, 12px);
          text-decoration: none;
          color: inherit;
        }
        .biernet-row:hover {
          background: var(--secondary-background-color);
        }
        .biernet-image-cell {
          flex: 0 0 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          overflow: hidden;
        }
        .biernet-product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .biernet-main {
          flex: 1;
          min-width: 0;
        }
        .biernet-name {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .biernet-packaging {
          font-size: 0.85em;
          color: var(--secondary-text-color);
        }
        .biernet-valid {
          font-size: 0.8em;
          color: var(--primary-color);
        }
        .biernet-store {
          flex: 0 0 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 0.8em;
          color: var(--secondary-text-color);
          text-align: center;
        }
        .biernet-store-logo {
          width: 100%;
          height: 32px;
          object-fit: contain;
        }
        .biernet-prices {
          flex: 0 0 auto;
          text-align: right;
        }
        .biernet-price {
          font-size: 0.85em;
          color: var(--secondary-text-color);
        }
        .biernet-liter-price {
          font-weight: 600;
          font-size: 1.05em;
        }
        .biernet-error {
          padding: 16px;
          color: var(--error-color);
        }
        @media (max-width: 480px) {
          .biernet-store span {
            display: none;
          }
        }
      </style>`;
  }

  _escape(value) {
    if (value === null || value === undefined) {
      return "";
    }
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}

customElements.define("biernet-card", BiernetCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "biernet-card",
  name: "Biernet Card",
  description: "Toont bieraanbiedingen van biernet.nl met logo's, afbeeldingen, verpakking en geldigheid",
});
