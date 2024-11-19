//src/components/slofood-header.ts
import { LitElement, css, html } from "lit";
import { Auth, define, Dropdown, Events, Observer} from "@calpoly/mustang";
import { state } from "lit/decorators.js";
//import reset from "../styles/reset.css";

function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as HTMLInputElement;
  const checked = target.checked;

  Events.relay(ev, "dark-mode", { checked });
}

export class SloFoodHeaderElement extends LitElement {
  static uses = define({
    "mu-dropdown": Dropdown.Element
  });

  @state()
  userid: string = "guest";
  
  render() {
    return html`
      <header>
        <h1>San Luis Obispo Food Guide</h1>
        <nav>
            <slot name="nav"></slot>
        </nav>
        <mu-dropdown>
          <a slot="actuator">
            Hello,
            <span id="userid">${this.userid}</span>
          </a>
            <menu>
              <li>
                <label>
                  <input type="checkbox" id="dark-mode-toggle" autocomplete="off"/>
                  <slot name="dark-mode"></slot>
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout">Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>
        </mu-dropdown>
      </header>
    `;
  }

  static styles = [
    //reset.styles,
    css`
    header{
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: var(--size-spacing-medium);
      background-color: var(--color-background-header);
      color: var(--color-text-header);
    }

    h1 {
        flex-basis: 100%;
        font-family: var(--font-family-display);
        font-size: var(--size-type-xxxlarge);
        font-weight: var(--font-weight-light);

    }

    nav {
        display: flex;
        color: var(--color-text-header);
        margin: var(--size-spacing-small);
        ::slotted(a:not(:first-child))::before {
          content: ">";
          padding: 0.25em;
        }
    }

    a[slot="actuator"] {
      color: var(--color-link-inverted);
      cursor: pointer;
    }

    #userid:empty::before {
      content: "Guest";
    }
    menu {
      color: var(--color-link);
      cursor: pointer;
      text-decoration: underline;
    }

    a:has(#userid:empty) ~ menu > .when-signed-in,
    a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
      display: none;
    }  
  `
  ];

  _authObserver = new Observer<Auth.Model>(
    this,
    "slofoodguide:auth"
  );

  connectedCallback() {
    super.connectedCallback()
    this._authObserver.observe(({ user }) => {
      if (user && user.username !== this.userid) {
        this.userid = user.username;
      }
    });
  }
  
  static initializeOnce() {
    function toggleDarkMode(
      page: HTMLElement,
      checked: boolean) {
      page.classList.toggle("dark-mode", checked);
    }

    document.body.addEventListener("darkmode:toggle", (event) =>
      toggleDarkMode(event.currentTarget as HTMLElement,
      (event as CustomEvent).detail?.checked
      )
    );
  }
}
