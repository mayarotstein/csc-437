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
    const { category, image, description, link } = restaurant;
    const { nav, darkModeLabel } = header;

    const links = nav.map(this.renderNavLink);

    return html`
      <body>
      <main class="page">
        <slo-food-header>
          <span slot="title">San Luis Obispo Food Guide</span>
          <span slot="nav">
            <a href="index.html">Home</a> > 
            Restaurant
          </span>
          <span slot="dark-mode"> Dark Mode</span>
      </slo-food-header>
        <section class="restaurant">
          <h1 slot="title">Best Restaurants in San Luis Obispo</h1>
          <div class="card">
            <h2 slot="category">${category}</h2>
            <img
              slot="image"
              src="${image.src}"
              alt="${image.alt}"
              width="${image.width}"
              height="${image.height}"
            />
          <p>${description}</p>
          <a class="button" slot="link" href="${link}">Visit Website</a>
          </div>
        </section>
      </main>
    </body>`;
  }
}
