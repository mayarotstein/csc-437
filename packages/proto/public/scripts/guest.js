import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class GuestProfile extends HTMLElement {
    static template = html`
        <template>
            <div class="card">
                <h2><slot name="username"></slot></h2>
                <slot name="favoritemeal"></slot>
                <p><slot name="nickname"></slot></p>
                <p><slot name="partysize"></slot></p>
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
    fetch(url)
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