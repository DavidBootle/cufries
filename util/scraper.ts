import {
    DayMenu,
    AllFood,
    FoodItem,
    LOCATIONS,
    TIMES,
    Menu,
    Product,
    ResponseMenu,
    FoodItemInstance,
} from "./types";

export async function get_location_menu(
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

export async function get_day_menu(
    date: Date,
): Promise<[DayMenu | null, Error | null]> {
    const items: FoodItemInstance[] = [];
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

            const item: FoodItemInstance = {
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

function remove_food_instance(item: FoodItemInstance): FoodItem {
    return {
        name: item.name,
        desc: item.desc,
    };
}

export async function get_all_food(): Promise<[AllFood | null, Error | null]> {
    let date = new Date();
    const items: FoodItem[] = [];

    for (let i = 0; i < 6; i++) {
        date = new Date(date.getTime() + i * (1000 * 60 * 60 * 24));

        const [instances, err] = await get_day_menu(date);
        if (err != null) {
            return [null, err];
        }
        if (instances == null) {
            return [null, new Error("instances is null for some reason")];
        }
        const has_dup = (name: string): boolean => {
            return items.findIndex((item) => item.name == name) != -1;
        };
        for (const instance of instances.items) {
            if (has_dup(instance.name)) continue;
            items.push(remove_food_instance(instance));
        }
    }
    return [{ items }, null];
}
