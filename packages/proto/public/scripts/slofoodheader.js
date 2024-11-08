import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";


export class SloFoodHeaderElement extends HTMLElement {
    static template = html`
        <template>
            <header>
                <h1><slot name="title">San Luis Obispo Food Guide</slot></h1>
                <nav>
                    <slot name="nav"></slot>
                </nav>
                <label>
                    <input type="checkbox" id="dark-mode-toggle" autocomplete="off"/>
                    <slot name="dark-mode"></slot>
                </label>
                <a slot="actuator">
                  Hello,
                  <span id="userid"></span>
                </a>
            </header>
        </template>
  `;

  static styles = css`
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
    
  `;

  constructor() {
    super();
    shadow(this)
      .template(SloFoodHeaderElement.template)
      .styles(reset.styles, SloFoodHeaderElement.styles);

      const toggle = this.shadowRoot.querySelector('input[type="checkbox"]');

        toggle.addEventListener("change", (event) => {
            relayEvent(event, "darkmode:toggle", { checked: event.target.checked });
        });
      
      this._signout = this.shadowRoot.querySelector("#signout");

      this._signout.addEventListener("click", (event) =>
        Events.relay(event, "auth:message", ["auth/signout"])
      );
  }
  
  static initializeOnce() {
    function toggleDarkMode(page, checked) {
      page.classList.toggle("dark-mode", checked);
    }

    document.body.addEventListener("darkmode:toggle", (event) =>
      toggleDarkMode(event.currentTarget, event.detail.checked)
    );
  }

  _authObserver = new Observer(this, "slofoodguide:auth");

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      if (user && user.username !== this.userid) {
        this.userid = user.username;
      }
    });
  }

    get userid() {
    return this._userid.textContent;
  }

  set userid(id) {
    if (id === "anonymous") {
      this._userid.textContent = "";
      this._signout.disabled = true;
    } else {
      this._userid.textContent = id;
      this._signout.disabled = false;
    }
  }
}

function relayEvent(event, eventName, detail) {
    event.stopPropagation();

    const customEvent = new CustomEvent(eventName, {
        bubbles: true,
        detail,
        composed: true,
    });

    event.target.dispatchEvent(customEvent);
}


