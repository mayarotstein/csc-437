"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var restaurant_svc_exports = {};
__export(restaurant_svc_exports, {
  getHeaderData: () => getHeaderData,
  getRestaurant: () => getRestaurant
});
module.exports = __toCommonJS(restaurant_svc_exports);
const restaurants = {
  Meals: {
    category: "Meals",
    image: {
      src: "../images/meal.jpg",
      alt: "Explore Meals in SLO",
      width: 300,
      height: 200
    },
    description: "Hungry for a full meal? Check out our selection of restaurants offering everything from low-cost bites to high-end gourmet dishes. There\u2019s something to satisfy every appetite.",
    link: "meal.html"
  },
  SmallBites: {
    category: "Small Bites",
    image: {
      src: "images/farmers.jpg",
      alt: "Explore Small Bites in SLO",
      width: 300,
      height: 200
    },
    link: "small-bite.html"
  },
  Beverages: {
    category: "Beverages",
    image: {
      src: "images/beverage.jpg",
      alt: "Explore Beverages in SLO",
      width: 300,
      height: 200
    },
    link: "beverages"
  }
};
const headerData = {
  nav: [{ label: "Home", href: "index.html" }, { label: "Restaurant", href: "restaurant.html" }],
  darkModeLabel: true
};
function getRestaurant(category) {
  return restaurants["Meals"];
}
function getHeaderData() {
  return headerData;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getHeaderData,
  getRestaurant
});
