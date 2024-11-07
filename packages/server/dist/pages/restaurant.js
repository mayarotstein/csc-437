"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var restaurant_exports = {};
__export(restaurant_exports, {
  RestaurantPage: () => RestaurantPage
});
module.exports = __toCommonJS(restaurant_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class RestaurantPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)(
      {
        body: this.renderBody()
      }
    );
  }
  renderNavLink(l) {
    return import_server.html`
      <a slot="nav" href="${l.href}">
        ${l.label}
      </a>
    `;
  }
  renderBody() {
    const { restaurant, header, guest } = this.data;
    const { category, image, description, link } = restaurant;
    const { nav, darkModeLabel } = header;
    const { username } = guest;
    const api = `/api/guests/${username}`;
    const links = nav.map(this.renderNavLink);
    return import_server.html`
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
            <a class="button" slot="link" href="${link}">Visit Website</a>
            </div>
          </section>
        </mu-auth>
      </main>
    </body>`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RestaurantPage
});
