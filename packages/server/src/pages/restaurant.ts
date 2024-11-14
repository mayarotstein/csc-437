// src/pages/restaurant.ts
import { css, html } from "@calpoly/mustang/server";
import { Restaurant, Header, Link } from "../models/restaurant";
import renderPage from "./renderPage"; // generic page renderer
import { Schema, model } from "mongoose";
import { Guest } from "../models/guest";

interface PageData {
  restaurant: Restaurant; header: Header; guest: Guest
}
export class RestaurantPage {
  data: PageData;

  constructor(data: PageData) {
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
      <a slot="nav" href="${l.href}">
        ${l.label}
      </a>
    `;
  }


  renderBody() {
    const { restaurant, header, guest } = this.data;
    const { category, image, description, link } = restaurant;
    const { nav, darkModeLabel } = header;
    /*const { username, nickname, favoritemeal, partysize} = guest;*/
    const { username } = guest;
    
    const api = `/api/guests/${username}`;


    const links = nav.map(this.renderNavLink);

    return html`
      <body>
      <main class="page">
        <mu-auth provides="slofoodguide:auth">
          <slo-food-header>
            ${links}
            <span slot="dark-mode"> Dark Mode ${darkModeLabel}</span>
        </slo-food-header>
          <section class="restaurant">
            <h1 slot="title">Best Restaurants in San Luis Obispo</h1>
            <guest-profile src="${api}">
            </guest-profile>
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
            <a class="button" slot="link" href="${link}">Visit Restaurants</a>
            </div>
          </section>
        </mu-auth>
      </main>
    </body>`;
  }
}
