import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
//import { state } from "lit/decorators.js";
import reset from "../../public/styles/reset.css.ts";


export class HomeViewElement extends LitElement {

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

   /*@state()
    navigationLinks: { label: string; href: string }[] = [
      { label: "Home", href: "/" }
    ];*/


    render() {
  
      return html`
      <body>
        <section class="main-page">
          <img src="images/slo-guide.jpg" alt="Explore Restaurants in SLO">
          <p>Discover the best food and drink options in SLO, whether you're in the mood for meals, snacks, or beverages!</p>
          <p>SLO Food Guide from a <em>SLOCAL!</em></p>
          <h2><a href="restaurant.html" class="button">Explore Restaurants</a></h2>
          <p>
            <svg class="icon">
              <use href="icons/food.svg#icon-utensils" />
            </svg>
            Find all the best places for meals, snacks, and drinks in San Luis Obispo.
          </p>
        </section>            
        <script>
          document.body.addEventListener("darkmode:toggle", (event) => {
            const { checked } = event.detail;
              document.body.classList.toggle("dark-mode", checked);
          });
        </script>
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

        section.main-page {
          display: grid;
          grid-template-columns: var(--grid-columns-main);
          grid-gap: var(--grid-gap);
          padding: var(--grid-container-padding);
          max-width: var(--grid-max-width);
          margin: auto;
          text-align: center;
      }
    `
    ];
}