import { css, html, shadow, define, Form, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class GuestProfile extends HTMLElement {
    static uses = define({
      "mu-form": Form.Element,
    });

    static template = html`
        <template>
          <div class="card">
              <h2>Username: <slot name="username"></slot></h2>
              <slot name="favoritemeal"></slot>
              <p>Nickname: <slot name="nickname"></slot></p>
              <p>Party Size: <slot name="partysize"></slot></p>
              <a button class="button" href="meal.html">Make A Reservation</a>
          </div>
          <div class="card">
            <mu-form class="edit">
              <label>
                <span>Username</span>
                <input name="username" />
              </label>
              <label>
                <span>Favorite Meal</span>
                <input type="file" name="favoritemeal" />
              </label>
              <label>
                <span>Nickname</span>
                <input name="nickname" />
              </label>
              <label>
                <span>Party Size</span>
                <input name="partysize" />
              </label>
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

  constructor() {
    super();
    shadow(this)
      .template(GuestProfile.template)
      .styles(reset.styles, GuestProfile.styles);
  }


  get src() {
    return this.getAttribute("src");
  }

  connectedCallback() {
    if (this.src) this.hydrate(this.src);
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => this.renderSlots(json))
      .catch((error) =>
        console.log(`Failed to render data ${url}:`, error)
      );
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

  _authObserver = new Observer(this, "blazing:auth");

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
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