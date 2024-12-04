import { css, html, shadow, define, Form, Observer, Auth } from "@calpoly/mustang";
import reset from "../../public/styles/reset.css.ts";

export class GuestProfile extends HTMLElement {
    
    _user = new Auth.User();
    _authObserver = new Observer(this, "slofoodguide:auth");


    static uses = define({
      "mu-form": Form.Element,
    });

    static template = html`
        <template>
          <section class="view">
            <div class="card">
              <h2>Your Profile</h2>
              <p>Username: <slot name="username"></slot></p>
              <slot name="favoritemeal"></slot>
              <p>Nickname: <slot name="nickname"></slot></p>
              <p>Party Size: <slot name="partysize"></slot></p>
              <button id="edit" class="button">Edit</a>
            </div>
          </section>
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
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      --display-editor-none: none;
    }

    section.view {
      display: var(--display-view-none, grid);
    }
    
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

    mu-form.edit {
      display: var(--display-editor-none, grid);
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(GuestProfile.template)
      .styles(reset.styles, GuestProfile.styles);

    this._authObserver = new Observer(this, "slofoodguide:auth");

    this._initializeEventListeners();
  }

  static observedAttributes = ["src"];


  get src(): string | null {
    return this.getAttribute("src");
  }

  get form(): Form.Element | null {
    return this.shadowRoot?.querySelector("mu-form.edit") || null;
  }

  get mode(): string | null {
    return this.getAttribute("mode");
  }

  set mode(value: string | null) {
    if (value) {
      this.setAttribute("mode", value);
    }
  }

    get editButton(): HTMLElement | null {
    return this.shadowRoot?.getElementById("edit") || null;
  }

  get favoritemealInput(): HTMLInputElement | null {
    return (
      this.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement
    ) || null;
  }
  /*constructor() {
    super();
    shadow(this)
      .template(GuestProfile.template)
      .styles(reset.styles, GuestProfile.styles);

      this?.editButton?.addEventListener(
        "click",
        () => (this.mode = "edit")
      );

      this?.favoritemealInput?.addEventListener("change", (event) =>
      this.handleFavoritemealSelected(event)
    );

      this.addEventListener("mu-form:submit", (event) =>
      this.submit(this.src, event.detail)
    );
  }*/

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      if (this.src && this.mode !== "new") {
        this.hydrate(this.src);
      }
    });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === "src" && oldValue !== newValue && this.mode !== "new") {
      this.hydrate(newValue as string);
    }
  }

  get authorization(): Record<string, string> | undefined {
    return this._user?.authenticated
      ? { Authorization: `Bearer ${this._user.token}` }
      : undefined;
  }


  hydrate(url: string) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (res.status !== 200) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        if (this.form) this.form.init = json;
        this.mode = "view";
      })
      .catch((error) => {
        console.error(`Failed to render data from ${url}:`, error);
      });
  }

  renderSlots(json: Record<string, any>) {
    const entries = Object.entries(json);
    const fragment = entries.map(([key, value]) => {
      switch (key) {
        case "favoritemeal":
          return html`<img slot="${key}" src="${value}" />`;
        default:
          return html`<span slot="${key}">${value}</span>`;
      }
    });

    this.replaceChildren(...fragment);
  }

  submit(url: string | null, json: Record<string, any>) {
    const method = this.mode === "new" ? "POST" : "PUT";

    if (this._favoritemeal) {
      json.favoritemeal = this._favoritemeal;
    }

    fetch(url as string, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.authorization,
      },
      body: JSON.stringify(json),
    })
      .then((res) => {
        if (res.status !== (this.mode === "new" ? 201 : 200))
          throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        this.renderSlots(data);
        if (this.form) this.form.init = data;
        this.mode = "view";
      })
      .catch((error) => console.error(`Failed to submit to ${url}:`, error));
  }

  handleFavoritemealSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];

    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => (this._favoritemeal = reader.result as string);
    reader.onerror = (err) => console.error("FileReader error:", err);
    reader.readAsDataURL(selectedFile);
  }

  private _initializeEventListeners() {
    this.editButton?.addEventListener("click", () => {
      this.mode = "edit";
    });

    this.favoritemealInput?.addEventListener("change", (event) => {
      this.handleFavoritemealSelected(event);
    });

    this.addEventListener("mu-form:submit", (event: Event) => {
      const detail = (event as CustomEvent).detail;
      this.submit(this.src, detail);
    });
  }

  private _favoritemeal?: string;
}