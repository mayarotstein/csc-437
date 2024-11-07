import { Restaurant, Header, Category } from "../models/restaurant";

const restaurants = {
    Meals: {
        category: "Meals" as Category,
        image: {
          src: "/images/meal.jpg",
          alt: "Explore Meals in SLO",
          width: 300,
          height: 200,
        },
        description:"Hungry for a full meal? Check out our selection of restaurants offering everything from low-cost bites to high-end gourmet dishes. There’s something to satisfy every appetite.",
        link: "meal.html"
      },

      SmallBites: {
        category: "Small Bites" as Category,
        image: {
          src: "/images/farmers.jpg",
          alt: "Explore Small Bites in SLO",
          width: 300,
          height: 200,
        },
        link: "small-bite.html"
      },

      Beverages: {
        category: "Beverages" as Category,
        image: {
          src: "/images/beverage.jpg",
          alt: "Explore Beverages in SLO",
          width: 300,
          height: 200,
        },
        link: "beverages"
      },
    };

    const headerData: Header = {
      nav: [{label: "Home", href: "index.html"}, {label: "Restaurant", href: "restaurant.html"}],
      darkModeLabel: false,
    };

    export function getRestaurant(category: string) {
        return restaurants["Meals"];
      }
    export function getHeaderData(): Header {
      return headerData;
    }