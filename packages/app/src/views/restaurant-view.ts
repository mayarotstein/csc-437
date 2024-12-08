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
                    <h2>Meals</h2>
                    <img
                        src="/images/meal.jpg"
                        alt="Explore Meals in SLO"
                    />
                    <p>Hungry for a full meal? Check out our selection of restaurants offering everything from low-cost bites to high-end gourmet dishes. There’s something to satisfy every appetite.</p>
                    <a class="button" href="/app/meal">Explore Meals in SLO</a>
                </div>
                <div class="card">
                    <h2>Small Bites</h2>
                    <img
                      src="/images/farmers.jpg"
                      alt="Explore Small Bites in SLO"
                      />
                    <p>If you're in the mood for something light, why not grab a quick snack or treat? Find the best spots for small bites, from frozen yogurt to tasty street snacks.</p>
                    <a  class="button" href="small-bite.html">Explore Small Bites in SLO</a>
                </div>
                <div class="card">
                    <h2>Beverages</h2>
                    <img 
                      src="/images/beverage.jpg"
                      alt="Explore Beverages in SLO"
                      />
                    <p>Need something to quench your thirst? Explore the top spots for coffee, craft cocktails, wine, and non-alcoholic options around town.</p>
                    <a href="beverage.html" class="button">Explore Beverages in SLO</a>
                </div>
            </section>
          </main>
        </body>
    `;
    }
    
    static styles = [
      reset.styles,
      css `
      section {
        display: grid;
        grid-gap: var(--grid-gap);
        grid-template-columns: var(--grid-columns);
        padding: var(--grid-container-padding);
        max-width: var(--grid-max-width);
        //align-items: stretch;
    }

      img {
        width: 100%;
        height: 400px;
        object-fit: cover;
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

        .card {
          flex: 1 1 calc(50% - var(--grid-gap));
          display: flex;
          flex-direction: column;
          //justify-content: space-between;
          gap: var(--size-card-gap);
          padding: var(--size-card-padding);
          background-color: var(--card-background-color);
          border-radius: var(--card-border-radius);
          box-sizing: border-box;
        }

        .card h2,
        .card p {
          margin: 0;
        }

        @media (max-width: 768px) {
          section {
              grid-template-columns: 1fr;
          }
      
          img {
              width: 100%;
          }
      
          .card {
              margin-bottom: var(--size-spacing-large);
          }
      }`
    ];

    constructor() {
      super("slofoodguide:model");
    }
}