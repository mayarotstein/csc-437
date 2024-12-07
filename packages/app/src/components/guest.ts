import { LitElement, css, html } from "lit";
import { define, Form, Observer, Auth} from "@calpoly/mustang";
import { state } from "lit/decorators.js";
//import { property } from "lit/decorators.js";
import { Guest } from "server/models";
//import { Msg } from "../messages";
//import { Model } from "../model";

export class GuestProfile extends LitElement {
    
    _user = new Auth.User();
    _authObserver = new Observer<Auth.Model> (this, "slofoodguide:auth");


    static uses = define({
      "mu-form": Form.Element,
    });

    @state()
    guest?: Guest;
    
    @state()
    userid: string = "guest";


    render() {

      const {
        username, favoritemeal, nickname, partysize} = this.guest || {};
      
        return html`
          <section class="profile">
            <h2>Your Profile</h2>
            <p>Username: ${username}</p>
            <img src=${favoritemeal} alt="Favorite Meal" />
            <p>Nickname: ${nickname}</p>
            <p>Party Size: ${partysize}</p>
            <a href="/app/guest/edit/${this.userid}" class="button">Edit Profile</a>
          </section>
        `;
      }


      connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe(({ user }) => {
          if (user && user.username != this.userid) {
            this.userid = user.username;
          }
          if (user) {
          this._user = user;}
          if (this.src && this.mode !== "new") {
            this.hydrate(this.src);
          }
        });
      }

      hydrate(url: string) {
        fetch(url, {
          headers: Auth.headers(this._user),
        })
          .then((res) => {
            if (res.status !== 200) throw new Error(`Status: ${res.status}`);
            return res.json();
          })
          .then((json) => {
            this.guest = json as Guest;
          })
          .catch((error) => {
            console.error(`Failed to render data from ${url}:`, error);
          });
      }


  static styles = css`
    :host {
      display: contents;
    }

    h2{
        font-family: var(--font-family-display);
        font-size: var(--size-type-large);
        font-weight: var(--font-weight-normal);
        grid-column: 1 / -1;
        margin: 0;
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

  

  get src(): string | null {
    return this.getAttribute("src");
  }

  set mode(value: string | null) {
    if (value) {
      this.setAttribute("mode", value);
    }
  }

  /*get editButton(): HTMLElement | null {
    return this.shadowRoot?.getElementById("edit") || null;
  }*/

  get favoritemealInput(): HTMLInputElement | null {
    return (
      this.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement
    ) || null;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === "src" && oldValue !== newValue && this.mode !== "new") {
      this.hydrate(newValue as string);
    }
  }


  /*handleFavoritemealSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];

    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => (this._favoritemeal = reader.result as string);
    reader.onerror = (err) => console.error("FileReader error:", err);
    reader.readAsDataURL(selectedFile);
  }

  _favoritemeal?: string;
}*/

}