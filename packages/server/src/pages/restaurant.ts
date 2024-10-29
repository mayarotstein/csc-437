// src/pages/restaurant.ts
import { css, html } from "@calpoly/mustang/server";
import { Restaurant, Header, Link } from "../models/restaurant";
import renderPage from "./renderPage"; // generic page renderer

export class RestaurantPage {
  data: { restaurant: Restaurant; header: Header };

  constructor(data: { restaurant: Restaurant; header: Header }) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
    }, 
  );
  }

  renderNavLink(l: Link) {
    return html`
      <a slot="nav-item" href="${l.href}">
        ${l.label}
      </a>
    `;
  }

  renderBody() {
    const { restaurant, header } = this.data;
    const { name, category, image, link } = restaurant;
    const { nav, darkModeLabel } = header;

    const links = nav.map(this.renderNavLink);

    return html`
      <body>
      <main class="page">
        <header>
          ${links}
          <label slot="dark-mode-label"> Dark Mode
            <input type="checkbox" ${darkModeLabel ? 'checked' : ''} />
          </label>      
        </header>
        <section class="restaurant">
          <span slot="name">${name}</span>
          <span slot="category">${category}</span>
          <a slot="link" href="${link}">Visit Website</a>
          <img
            slot="image"
            src="${image.src}"
            alt="${image.alt}"
            width="${image.width}"
            height="${image.height}"
          />
        </section>
      </main>
    </body>`;
  }
}
