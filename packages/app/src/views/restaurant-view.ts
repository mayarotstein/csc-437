import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";

export class RestaurantViewElement extends LitElement {
  
    @state()
    navigationLinks: { label: string; href: string }[] = [
      { label: "Home", href: "/" },
      { label: "Restaurants", href: "/restaurants" }
    ];
    
    render() {
  
      return html`
      <body class="page">
        <mu-auth provides="slofoodguide:auth">
            <slo-food-header>
                <span slot="title">San Luis Obispo Food Guide</span>
                <span slot="nav">
                <a href="index.html">Home</a> > 
                Restaurant
                </span>
                <span slot="dark-mode"> Dark Mode</span>
            </slo-food-header>

            <section class="restaurant">
                <h1>Best Restaurants in San Luis Obispo</h1>
                <div class="card">
                    <h2>Meals</h2>
                    <img src="images/meal.jpg" alt="Explore Meals in SLO" width="300" height="200">
                    <p>Hungry for a full meal? Check out our selection of restaurants offering everything from low-cost bites to high-end gourmet dishes. There’s something to satisfy every appetite.</p>
                    <a href="meal.html" class="button">Explore Meals in SLO</a>
                </div>
        
                <div class="card">
                    <h2>Small Bites</h2>
                    <img src="images/farmers.jpg" alt="Explore Small Bites in SLO" width="300" height="200">
                    <p>If you're in the mood for something light, why not grab a quick snack or treat? Find the best spots for small bites, from frozen yogurt to tasty street snacks.</p>
                    <a href="small-bite.html" class="button">Explore Small Bites in SLO</a>
                </div>
        
                <div class="card">
                    <h2>Beverages</h2>
                    <img src="images/beverage.jpg" alt="Explore Beverages in SLO" width="300" height="200">
                    <p>Need something to quench your thirst? Explore the top spots for coffee, craft cocktails, wine, and non-alcoholic options around town.</p>
                    <a href="beverage.html" class="button">Explore Beverages in SLO</a>
                </div>
            </section>

            <script>
                document.body.addEventListener("darkmode:toggle", (event) => {
                    const { checked } = event.detail;
                    document.body.classList.toggle("dark-mode", checked);
                });
            </script>
        </mu-auth>
      </body>
      `;
    }
  
    // more to come
  }