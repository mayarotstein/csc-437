import { LitElement, css, html } from "lit";
import { define, Form, Observer, Auth } from "@calpoly/mustang";
import { state } from "lit/decorators.js";
import { Guest } from "server/models";

export class GuestProfile extends LitElement {
    
    _user = new Auth.User();
    _authObserver = new Observer<Auth.Model> (this, "slofoodguide:auth");


    static uses = define({
      "mu-form": Form.Element,
    });

    @state()
    guest?: Guest;

    render() {

      const {
        username, favoritemeal, nickname, partysize} = this.guest || {};
      
        console.log(this.guest)
      return html`
          <section class="view">
              <h2>Your Profile</h2>
              <p>Username: ${username}</p>
              <img src=${favoritemeal}>
              <p>Nickname: ${nickname}</p>
              <p>Party Size: ${partysize}</p>
              <button id="edit" class="button">Edit</a>
          </section>
            <mu-form class="edit">
              <h3><label>
                <span>Username</span>
                <input name="username" />
              </label></h2>
              <h3><label>
                <span>Favorite Meal</span>
                <input type="file" name="favoritemeal" />
              </label></h2>
              <h3><label>
                <span>Nickname</span>
                <input name="nickname" />
              </label></h2>
              <h3><label>
                <span>Party Size</span>
                <input name="partysize" />
              </label></h2>
            </mu-form>
  `;}


  static styles = css`
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      //--display-editor-none: none;
    }

    h2{
        font-family: var(--font-family-display);
        font-size: var(--size-type-large);
        font-weight: var(--font-weight-normal);
        grid-column: 1 / -1;
        margin: 0;
    }

    h3{
      font-family: var(--font-family-display);
      font-size: var(--size-type-mlarge);
      font-weight: var(--font-weight-normal);
      grid-column: 1 / -1;
  }

    p {
        font-size: var(--size-type-medium);
    }

    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      object-position: center;
      display: block;
      border-radius: var(--img-border-radius);
    }

    button {
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

    button:hover {
      background-color: var(--color-button-hover);
    }

    mu-form.edit {
      display: var(--display-editor-none, grid);
    }

    mu-form.edit h3,
    mu-form.edit label,
    mu-form.edit input {
    margin: 0; /* Remove all default margins */
    padding: 0; /* Ensure no extra padding */
  }

    mu-form.edit {
      gap: var(--size-spacing-medium); /* Add controlled spacing between form fields */
      display: grid; /* Use grid layout for alignment */
      grid-template-columns: 1fr; /* Single column for fields */
      margin: 0;
      padding: 0;
    }
  `;

  get src(): string | null {
    return this.getAttribute("src");
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

  hydrate(url: string) {
    fetch(url, {
      headers: Auth.headers(this._user),
    })
      .then((res) => {
        if (res.status !== 200) throw new Error(`Status: ${res.status}`);
        if (!res.body) throw new Error("Empty response body");
        return res.json();
      })
      .then((json) => {
        this.guest = json as Guest;
      })
      .catch((error) => {
        console.error(`Failed to render data from ${url}:`, error);
      });
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
      this._user = user;}
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


  handleFavoritemealSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];

    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => (this._favoritemeal = reader.result as string);
    reader.onerror = (err) => console.error("FileReader error:", err);
    reader.readAsDataURL(selectedFile);
  }

  _favoritemeal?: string;
}