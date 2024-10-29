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
    return import_server.html`
      <body>
      <main class="page">
        <header>
          ${links}
          <label slot="dark-mode-label"> Dark Mode
            <input type="checkbox" ${darkModeLabel ? "checked" : ""} />
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RestaurantPage
});