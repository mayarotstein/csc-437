import { Auth, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { SloFoodHeaderElement } from "./components/slofood-header";
import { HomeViewElement } from "./views/home-view";

class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement
  });

  protected render() {
    return html`
      <home-view></home-view>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    SloFoodHeaderElement.initializeOnce();
  }
}

define({
  "mu-auth": Auth.Provider,
  "slofoodguide-app": AppElement,
  "slo-food-header": SloFoodHeaderElement
});