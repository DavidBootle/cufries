// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import internal from "stream";

enum Location {
    CORE = "core",
}
const LOCATIONS = {
    9713: Location.CORE,
};
enum Times {
    BREAKFAST = "breakfast",
    LUNCH = "lunch",
    DINNER = "dinner",
}
const TIMES = {
    "891": Times.BREAKFAST,
    "892": Times.LUNCH,
    "893": Times.DINNER,
};

interface ResponseMenu {
    Menu: Menu;
}

interface Menu {
    MenuProducts: Product[];
}

interface Product {
    PeriodId: string;
    Product: {
        MarketingName: string;
        ShortDescription: string;
        Categories: {
            DisplayName: string;
        }[];
    };
}

interface DayMenu {
    items: FoodItem[];
}

interface FoodItem {
    name: string;
    desc: string;
    time: Times;
    location: Location;
}

async function get_location_menu(
    id_location: string,
    date: Date,
): Promise<[Menu | null, Error | null]> {
    const date_formatted = `${
        date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    const url = `https://clemson.campusdish.com/api/menu/GetMenus?locationId=${id_location}&storeIds=&mode=Daily&date=${date_formatted}&time=&periodId=892&fulfillmentMethod=`;
    const response = await fetch(url);
    if (!response.ok) {
        return [null, new Error("Menu request failed")];
    }
    const json = (await response.json()) as ResponseMenu;
    return [json.Menu, null];
}

async function get_day_menu(
    date: Date,
): Promise<[DayMenu | null, Error | null]> {
    const items: FoodItem[] = [];
    for (const id_location of Object.keys(LOCATIONS)) {
        const [menu, err] = await get_location_menu(id_location, date);
        if (err != null) {
            return [null, err];
        }
        if (menu == null) {
            return [null, new Error("No error was given but menu was null")];
        }
        const has_dup = (name: string): boolean => {
            return items.findIndex((item) => item.name == name) != -1;
        };
        const skip_group = (product: Product): boolean => {
            return (
                product.Product.Categories.findIndex(
                    (cat) => cat.DisplayName == "Condiments",
                ) != -1
            );
        };

        for (const product of menu.MenuProducts) {
            const name = product.Product.MarketingName.replace(/\(.*?\)/, "");
            if (has_dup(name) || skip_group(product)) {
                continue;
            }

            const desc = product.Product.ShortDescription;
            // @ts-ignore
            const time = TIMES[product.PeriodId];
            // @ts-ignore
            const location = LOCATIONS[id_location];

            const item: FoodItem = {
                name,
                desc,
                time,
                location,
            };
            items.push(item);
        }
    }
    return [{ items }, null];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DayMenu>,
) {
    const { date } = req.query;
    const date_obj = new Date(date as string);
    let [menu, err] = await get_day_menu(date_obj);
    if (err != null || menu == null) {
        res.status(400);
        return;
    }

    res.status(200).json(menu);
}
