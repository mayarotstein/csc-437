export interface Restaurant {
    category: Category;
    image: Image;
    description: string;
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
