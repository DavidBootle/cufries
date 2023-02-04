export enum Location {
    CORE = "core",
}
export const LOCATIONS = {
    9713: Location.CORE,
};
export enum Times {
    BREAKFAST = "breakfast",
    LUNCH = "lunch",
    DINNER = "dinner",
}
export const TIMES = {
    "891": Times.BREAKFAST,
    "892": Times.LUNCH,
    "893": Times.DINNER,
};

export interface ResponseMenu {
    Menu: Menu;
}

export interface Menu {
    MenuProducts: Product[];
}

export interface Product {
    PeriodId: string;
    Product: {
        MarketingName: string;
        ShortDescription: string;
        Categories: {
            DisplayName: string;
        }[];
    };
}

export interface DayMenu {
    items: FoodItemInstance[];
}

export interface AllFood {
    items: FoodItem[];
}

export interface FoodItemInstance {
    name: string;
    desc: string;
    time: Times;
    location: Location;
}

export interface FoodItem {
    name: string;
    desc: string;
}
