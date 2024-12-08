import { Auth, define, History, Switch, Store} from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { SloFoodHeaderElement } from "./components/slofood-header";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { HomeViewElement } from "./views/home-view";
import { RestaurantViewElement } from "./views/restaurant-view";
import { TestViewElement } from "./views/test-view";
import { MealViewElement } from "./views/meal-view";
import { GuestEdit } from "./views/guestedit";

const routes = [
  {
    path: "/app/guest/:id",
    view: (params: Switch.Params) => html`
      <restaurant-view guest-id=${params.id}></restaurant-view>
    `
  },
  {
    path: "/app/meal",
    view: () => html`
      <meal-view></meal-view>
    `
  },
  {
    path: "/app/test",
    view: () => html`
      <test-view></test-view>
    `
  },
  {
    path: "/app/guest/edit/:id",
    view: (params: Switch.Params) => html`
      <guest-edit guest-id=${params.id}></guest-edit>
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
    "test-view": TestViewElement,
    "guest-edit": GuestEdit
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
  "mu-store": class AppStore extends Store.Provider<
    Model,
    Msg
  > {
    constructor() {
      super(update, init, "slofoodguide:auth");
    }
  },
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "slofoodguide:history", "slofoodguide:auth");
    }
  },
  "slofoodguide-app": AppElement,
  "slo-food-header": SloFoodHeaderElement,
  "home-view": HomeViewElement,
  "restaurant-view": RestaurantViewElement,
  "meal-view": MealViewElement,
  "guest-edit": GuestEdit
});