import { Auth, Observer, View } from "@calpoly/mustang";
import { css, html } from "lit";
//import { state } from "lit/decorators.js";
import reset from "../../public/styles/reset.css.ts";
import { Msg } from "../messages.ts";
import { Model } from "../model.ts";



export class MealViewElement extends View<Model, Msg> {

    //api source and user
    src = `/api/guests/`;
    _user = new Auth.User();

    _authObserver = new Observer<Auth.Model>(
        this,
        "slofoodguide:auth"
      );
    
    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe(({ user }) => {
          if (user) {
            this._user = user;
          }
          this.hydrate(this.src);
        });
      }

      hydrate(url: string) {
        fetch(url, {
          headers: Auth.headers(this._user)
        })
          .then((res: Response) => {
            if (res.status === 200) return res.json();
            throw `Server responded with status ${res.status}`;
          })
          .catch((err) =>
            console.log("Failed to load main data:", err)
          )
          .catch((err) =>
            console.log("Failed to convert main data:", err)
          );
      }

    render() {

      return html`
      <body>
        <section>
          <div class="card">
              <h1>Low-Cost Meals in San Luis Obispo</h1>
              <h2>Salty Options</h2>
              <p>Enjoy delicious savory meals without breaking the bank.</p>
              <ul>
                  <li><strong>Thai Delight</strong></li>
                  <li><strong>High Street Deli</strong> - Go at 4:20 everyday for $8 sandwiches</li>
                  <li><strong>Finney's</strong></li>
                  <li><strong>Taqueria San Miguel</strong> - Go on Taco Tuesdays for $1 Tacos</li>
                  <li><strong>In-N-Out</strong> - A California classic with a beautiful drive to Pismo along the coast</li>
              </ul>
              <h2>Sweet Options</h2>
              <p>Treat yourself to some affordable sweets in SLO.</p>
              <ul>
                  <li><strong>SloDoCo Donuts</strong></li>
                  <li><strong>Batch Old Fashioned Ice Cream</strong></li>
                  <li><strong>House of Bread</strong></li>
              </ul>
          </div>
        <div class="card">
          <h1>High-Cost Meals in San Luis Obispo
          <h2>Salty Options</h2>
          <p>Great spots for dinner!</p>
          <ul>
              <li><strong>Giuseppe’s Cucina Italiana</strong></li>
              <li><strong>Nate's on Marsh</strong></li>
              <li><strong>Bear & The Wren</strong></li>
              <li><strong>Luna Red</strong></li>
              <li><strong>Alex Madonna’s Gold Rush Steak House</strong></li>    
          </ul>
          <h2>Sweet Options</h2>
          <p>A fancy sweet treat</p>
          <ul>
              <li><strong>Madonna Inn Copper Cafe</strong></li>
              <li><strong>Mistura</strong></li>
          </ul>
        </div>
      </section>           
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
        li strong {
          color: var(--color-text-list-strong);
        }
        p em {
          font-style: var(--font-italic-body);
          font-weight: var(--font-weight-medium);
        }
        section {
          display: grid;
          grid-gap: var(--grid-gap);
          grid-template-columns: var(--grid-columns);
          padding: var(--grid-container-padding);
          max-width: var(--grid-max-width);
          align-items: stretch;
        }
        section h1 {
          grid-column: 1 / -1;
          font-size: var(--size-type-xlarge);
      
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
      h1 {
        font-family: var(--font-family-display);
        font-size: var(--size-type-xlarge);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-h1);
    
    }
    `
    ];
}