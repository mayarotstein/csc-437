import { Restaurant, Header, Category } from "../models/restaurant";

const restaurants = {
    Meals: {
        name: "Meals",
        category: "Meals" as Category,
        image: {
          src: "images/meal.jpg",
          alt: "Explore Meals in SLO",
          width: 300,
          height: 200,
        },
        link: "meal.html"
      },

      SmallBites: {
        name: "Small Bites",
        category: "Small Bites" as Category,
        image: {
          src: "images/farmers.jpg",
          alt: "Explore Small Bites in SLO",
          width: 300,
          height: 200,
        },
        link: "small-bite.html"
      },

      Beverages: {
        name: "Beverages",
        category: "Beverages" as Category,
        image: {
          src: "images/beverage.jpg",
          alt: "Explore Beverages in SLO",
          width: 300,
          height: 200,
        },
        link: "beverages"
      },
    };

    const headerData: Header = {
      nav: [{label: "Home", href: "index.html"}, {label: "Restaurant", href: "restaurant.html"}],
      darkModeLabel: true,
    };

    export function getRestaurant(category: string) {
        return restaurants["Meals"];
      }
    export function getHeaderData(): Header {
      return headerData;
    }