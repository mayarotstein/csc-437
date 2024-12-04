import { Auth, define, History, Switch} from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { SloFoodHeaderElement } from "./components/slofood-header";
import { HomeViewElement } from "./views/home-view";
import { RestaurantViewElement } from "./views/restaurant-view";
import { TestViewElement } from "./views/test-view";

const routes = [
  {
    path: "/app/guests/:id",
    view: (params: Switch.Params) => html`
      <restaurant-view guest-id=${params.id}></restaurant-view>
    `
  },
  {
    path: "/app/test",
    view: () => html`
      <test-view></test-view>
    `
  },
  {
    path: "/app",
    view: () => html`
      <home-view></home-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];

class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement,
    "restaurant-view": RestaurantViewElement,
    "test-view": TestViewElement
  });

  protected render() {
    return html`
      <mu-switch></mu-switch>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    SloFoodHeaderElement.initializeOnce();
  }
}

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "slofoodguide:history", "slofoodguide:auth");
    }
  },
  "slofoodguide-app": AppElement,
  "slo-food-header": SloFoodHeaderElement
});