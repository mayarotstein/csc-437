//src/components/slofood-header.ts
import { LitElement, css, html } from "lit";
import { Auth, define, Dropdown, Observer, Events} from "@calpoly/mustang";
import { state } from "lit/decorators.js";
import reset from "../../public/styles/reset.css.ts";

function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as HTMLInputElement | null;
  if (target) {
    const checked = target.checked;

    const darkModeEvent = new CustomEvent("darkmode:toggle", {
      bubbles: true,
      composed: true,
      detail: { checked },
    });

    target.dispatchEvent(darkModeEvent);
  }
}

function signOut(ev: MouseEvent) {
  Events.relay(ev, "auth:message", ["auth/signout"]);
}

export class SloFoodHeaderElement extends LitElement {
  static uses = define({
    "drop-down": Dropdown.Element
  });

  @state()
  userid: string = "guest";

  @state()
  private navigationLinks: { label: string; href: string }[] = [];
  
  render() {
    return html`
      <header>
        <h1>San Luis Obispo Food Guide</h1>
        <nav>
          ${this.navigationLinks.map(
            (link) =>
              html`<a href=${link.href}>${link.label}</a>`
          )}
        </nav>
        <drop-down>
          <a slot="actuator">
            Hello,
            <span id="userid">${this.userid}</span>
          </a>
            <menu>
              <li>
                <label>
                <input 
                  type="checkbox"
                  id="dark-mode-toggle"
                  autocomplete="off"
                  @change=${toggleDarkMode}
                  />
                  <slot name="dark-mode">Dark Mode</slot>
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout" @click=${signOut}>Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>
        </drop-down>
      </header>
    `;
  }

  static styles = [
    reset.styles,
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

    nav a {
      color: var(--color-text-header); /* Matches h1 */
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
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user && user.username !== this.userid) {
        this.userid = user.username;
      }
    });

    SloFoodHeaderElement.initializeOnce();
  }
  
  static initializeOnce() {
    if (document.body.dataset.darkModeListener === "true") {
      return;
    }

    document.body.addEventListener("darkmode:toggle", (event: Event) => {
      const customEvent = event as CustomEvent<{ checked: boolean }>;
      const { checked } = customEvent.detail;
      document.body.classList.toggle("dark-mode", checked);
    });

    document.body.dataset.darkModeListener = "true";
  }
}
