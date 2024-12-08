import { View, Form, define, InputArray, History } from '@calpoly/mustang';
import { Guest } from 'server/models';
import { html, css } from 'lit';
import { Msg } from "../messages";
import { Model } from "../model";
import { property } from "lit/decorators.js";
import { state } from "lit/decorators.js";


export class GuestEdit extends View<Model, Msg> {
    
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element
  });

  @state()
  guest?: Guest;

  @property()
  userid?: string;

  @state()
  get profile(): Guest | undefined {
    return this.model.profile;
  }


  _handleSubmit(event: Form.SubmitEvent<Guest>) {
    const userId = this.userid || "";
    

    this.dispatchMessage([
      "profile/save",
      {
        userid: userId,
        profile: event.detail,
        onSuccess: () => {
          History.dispatch(this, "history/navigate", {
            href: `/app/guest/${this.userid}`,
          });
        },
        onFailure: (error: Error) => {
          console.error("ERROR:", error);
        },
      },
    ]);
  }
  
    
    render() {


      return html`
        <section class="edit-profile">
          <h2 class="main">Edit Your Profile</h2>
          <div class="card">
            <mu-form
              init=${this.profile}
              @mu-form:submit=${this._handleSubmit}>
              <label>
                <h2><span>Username</span></h2>
                <input name="username"</input>
              </label>
              <label>
                <h2><span>Favorite Meal</span></h2>
                <input
                  name="favoritemeal"
                  type="file"
                  @change=${this.handleFavoritemealSelected} />
              </label>
              <label>
                <h2><span>Nickname</span></h2>
                <input name="nickname"></input>
              </label>
              <label>
                <h2><span>Party Size</span></h2>
                <input name="partysize"</input>
              </label>
            </mu-form>
          </div>
        </section>
      `;
      }

      static styles = css`
      :host {
        display: contents;
      }

      form {
        display: flex;
        flex-direction: column;
        padding: var(--size-spacing-medium); /* Add some padding for the card */
        gap: var(--size-spacing-medium); /* Space between elements */
        width: 100%;
        margin-left: 0;
      }
  
      h2{
          font-family: var(--font-family-display);
          font-size: var(--size-type-large);
          font-weight: var(--font-weight-normal);
          grid-column: 1 / -1;
      }

      .main{
        font-size: var(--size-type-xlarge);
        margin-bottom: 0;
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

  attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null
  ) {
    super.attributeChangedCallback(name, old, value);

    if (name === "userid" && old !== value && value)
      this.dispatchMessage([
        "profile/select",
        { userid: value }
      ]);
  }
}