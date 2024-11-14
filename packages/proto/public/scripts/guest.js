import { css, html, shadow, define, Form, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class GuestProfile extends HTMLElement {
    static uses = define({
      "mu-form": Form.Element,
    });

    static template = html`
        <template>
          <div class="card">
            <h2>Your Profile</h2>
            <p>Username: <slot name="username"></slot></p>
            <slot name="favoritemeal"></slot>
            <p>Nickname: <slot name="nickname"></slot></p>
            <p>Party Size: <slot name="partysize"></slot></p>
            <a button class="button" href="meal.html">Make A Reservation</a>
          </div>
          <div class="card">
            <mu-form class="edit">
              <h2><label>
                <span>Username</span>
                <input name="username" />
              </label></h2>
              <h2><label>
                <span>Favorite Meal</span>
                <input type="file" name="favoritemeal" />
              </label></h2>
              <h2><label>
                <span>Nickname</span>
                <input name="nickname" />
              </label></h2>
              <h2><label>
                <span>Party Size</span>
                <input name="partysize" />
              </label></h2>
            </mu-form>
          </div>
        </template>
  `;


  static styles = css`
  
  .card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: var(--card-border-color);
    border-radius: var(--card-border-radius);
    padding: var(--size-spacing-medium);
    background-color: var(--card-background-color);
    gap: var(--size-spacing-medium);
    flex-grow: 1;
    }

    h2{
        font-family: var(--font-family-display);
        font-size: var(--size-type-large);
        font-weight: var(--font-weight-normal);
        grid-column: 1 / -1;
    }

    p {
        font-size: var(--size-type-medium);
    }

    img {
        width: 100vw;
        height: 400px;
        object-fit: cover;
        object-position: center;
        display: block;
        border-radius: var(--img-border-radius);
    }

    .button {
      display: inline-block;
      padding: var(--size-spacing-medium);
      font-size: var(--size-type-medium);
      font-family: var(--font-family-display);
      background-color: var(--color-button-background);
      color: var(--color-button-text);
      border-radius: var(--card-border-radius);
      text-decoration: none;
      text-align: center;
      border: none;
      transition: background-color 0.3s ease;
  }

  .button:hover {
    background-color: var(--color-button-hover);
  }
  `;

  get src() {
    return this.getAttribute("src");
  }
  
  get form() {
    return this.shadowRoot.querySelector("mu-form.edit");
  }
  

  constructor() {
    super();
    shadow(this)
      .template(GuestProfile.template)
      .styles(reset.styles, GuestProfile.styles);

      this.addEventListener("mu-form:submit", (event) =>
      this.submit(this.src, event.detail)
    );
  }

  _authObserver = new Observer(this, "slofoodguide:auth");

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      if (this.src && this.mode !== "new")
        this.hydrate(this.src);
    });
  }

  static observedAttributes = ["src"];

  attributeChangedCallback(name, oldValue, newValue) {
    if (
      name === "src" &&
      oldValue !== newValue &&
      oldValue &&
      newValue &&
      this.mode !== "new"
    )
      this.hydrate(newValue);
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        this.form.init = json;
      })
      .catch((error) => {
        console.log(`Failed to render data ${url}:`, error);
      });
  }

  renderSlots(json) {
  const entries = Object.entries(json);
  const toSlot = ([key, value]) =>{
    switch (key) {
      case "favoritemeal":
        return html`<img slot="${key}" src="${value}" />`;
      
      default:
        return html`<span slot="${key}">${value}</span>`;
    }
  };
  const fragment = entries.map(toSlot);

  this.replaceChildren(...fragment);
}

  submit(url, json) {
    const method = this.mode === "new" ? "POST" : "PUT";

    if (this._favoritemeal) json.favoritemeal = this._favoritemeal;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.authorization
      },
      body: JSON.stringify(json)
    })
      .then((res) => {
        if (res.status !== (this.mode === "new" ? 201 : 200))
          throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        this.form.init = json;
        this.mode = "view";
      })
      .catch((error) => {
        console.log(`Failed to submit ${url}:`, error);
      });
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