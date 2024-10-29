// src/pages/renderPage.ts
import {
  PageParts,
  renderWithDefaults
} from "@calpoly/mustang/server";

const defaults = {
  stylesheets: [
    "/styles/reset.css",
    "/styles/tokens.css",
    "/styles/page.css"
  ],
  styles: [],
  scripts: [
    `import { define } from "@calpoly/mustang";
    import { SloFoodHeaderElement } from "../scripts/slofoodheader.js";

    define({
      "slo-food-header": SloFoodHeaderElement
    });

    SloFoodHeaderElement.initializeOnce();
    `
  ],
  googleFontURL:
    "https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap",
  imports: {
    "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang"
  }
};

export default function renderPage(page: PageParts) {
  return renderWithDefaults(page, defaults);
}