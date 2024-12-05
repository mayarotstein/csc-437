import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import reset from "../../public/styles/reset.css.ts";
import { GuestProfile } from "../components/guest.ts";
import { property } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { Guest } from "server/models";

export class RestaurantViewElement extends View<Model, Msg> {


    static uses = define({
        "guest-profile": GuestProfile
    })

    @property()
    userid?: string;

    @property({attribute: "guest-id"})
    guestId?: string;

    @state()
    get profile(): Guest | undefined {
      return this.model.profile;
    }

    render() {

      return html`
      <body>
        <main class="page">
            <section>
                <h1 slot="title">Best Restaurants in San Luis Obispo</h1>
                <div class="card">
                    <guest-profile src="/api/guests/${this.guestId}">
                    </guest-profile>
                </div>
                <div class="card">
                    <h2 slot="category">Meals</h2>
                    <img
                        slot="image"
                        src="/images/meal.jpg"
                        alt="Explore Meals in SLO"
                        width= 300
                        height= 200
                    />
                    <p>Hungry for a full meal? Check out our selection of restaurants offering everything from low-cost bites to high-end gourmet dishes. There’s something to satisfy every appetite.</p>
                    <a class="button" slot="link" href="meal.html">Visit Restaurants</a>
                </div>
            </section>
          </main>
        </body>
    `;
    }
    
    static styles = [
      reset.styles,
      css `
        
        img {
          width: 100vw;
          height: 400px;
          object-fit: cover;
          object-position: center;
          display: block;
          border-radius: var(--img-border-radius);
      
        }

        h1 {
            font-family: var(--font-family-display);
            font-size: var(--size-type-xlarge);
            font-weight: var(--font-weight-medium);
            color: var(--color-text-h1);
        
        }

        section h1 {
            grid-column: 1 / -1;
            font-size: var(--size-type-xlarge);        
        }

        h2{
          font-family: var(--font-family-display);
          font-size: var(--size-type-large);
          font-weight: var(--font-weight-normal);
        }

        p {
          font-size: var(--size-type-medium);
        }

        svg.icon {
          display: inline;
          height: 2em;
          width: 2em;
          vertical-align: top;
          fill: currentColor;
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

        section {
            display: grid;
            grid-gap: var(--grid-gap);
            grid-template-columns: var(--grid-columns);
            padding: var(--grid-container-padding);
            max-width: var(--grid-max-width);
            align-items: stretch;
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
        }`
    ];

    constructor() {
      super("blazing:model");
    }
  
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