export interface Restaurant {
    name: string;
    category: Category;
    image: Image;
    link: string;
}

export interface Header {
    nav: Array <Link>;
    darkModeLabel: boolean;
}

export interface Link {
    label: string;
    href: string;
}

export interface Image {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export type Category =
| "Meals"
| "Small Bites"
| "Beverages";
