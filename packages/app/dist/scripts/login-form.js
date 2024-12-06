import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class LoginForm extends HTMLElement {
  static template = html`
    <template>
      <form>
        <div class="card">
            <slot name="title">
            <h2>Sign in with Username and Password</h3>
            </slot>
            <label>
            <span>
                <slot name="username">Username</slot>
            </span>
            <input name="username" autocomplete="off" />
            </label>
            <label>
            <span>
                <slot name="password">Password</slot>
            </span>
            <input type="password" name="password" />
            </label>
            <slot name="submit">
            <button class="button" type="submit">Sign In</button>
            </slot>
        </div>
      </form>
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

  get form() {
    return this.shadowRoot.querySelector("form");
    }

  constructor() {
    super();

    shadow(this)
      .template(LoginForm.template)
      .styles(reset.styles, LoginForm.styles);

    this.form.addEventListener("submit", (event) =>
    submitLoginForm(
      event,
      this.getAttribute("api"),
      this.getAttribute("redirect") || "/"
    ));
    }
}

function submitLoginForm(event, endpoint, redirect) {
    event.preventDefault();
    const form = event.target.closest("form");
    const data = new FormData(form);
    const method = "POST";
    const headers = {
      "Content-Type": "application/json"
    };
    const body = JSON.stringify(Object.fromEntries(data));
  
    fetch(endpoint, { method, headers, body })
      .then((res) => {
        if (res.status !== 200)
          throw `Form submission failed: Status ${res.status}`;
        return res.json();
      })
      .then((payload) => {
        const { token } = payload;
  
        form.dispatchEvent(
          new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signin", { token, redirect }]
          })
        );
      })
      .catch((err) => console.log("Error submitting form:", err));
  }