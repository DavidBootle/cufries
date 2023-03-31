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

const BLACKLIST = [
    "Honeydew Melon",
    "Cantaloupe",
    "Chopped Fresh Spinach",
    "Cucumbers",
    "Croutons",
    "Diced Ham",
    "Diced Chicken",
    "Iceberg Lettuce",
    "Romaine Lettuce",
    "Green Leaf Lettuce",
    "Shredded Carrots",
    "Sliced Green Bell Peppers",
    "Sliced Onions",
    "Sliced Red Onions",
    "Sliced Tomatoes",
    "American Cheese",
    "Cheddar Cheese",
    "Fresh Garlic",
    "Grape Tomatoes",
    "Salami",
    "Snow Peas",
    "Broccoli",
    "Diced Tomatoes",
    "Carrots",
    "Dinner Roll",
    "Raisins",
    "Bacon Pieces",
    "Baby Carrots",
    "Baby Lima Beans",
    "Baby Spinach",
    "Black Olives",
    "Black-Eyed Peas",
    "Celery Sticks",
    "Chopped Hard-Cooked Egg",
    "Cottage Cheese",
    "Couscous",
    "Crispy Bacon Bits",
    "Diced Onions",
    "Edamame",
    "Jalapeno Peppers",
    "Marinara Sauce",
    "Orange Segments",
    "Pineapple",
    "Red Grapes",
    "Sauteed Mushrooms",
    "Sauteed Onions",
    "Sauteed Red & Green Peppers",
    "Sliced Beets",
    "Sliced Carrots",
    "Sliced Mushrooms",
    "Sliced Scallions",
    "Southern Collard Greens",
    "Tangy Kale Slaw",
    "Tofu",
    "Tomato Wedges",
    "Whole Grain Penne",
    "Chedder Cheese Cubes",
    
]

export async function get_location_menu(
    id_location: string,
    date_string: string | number,
    period_id: string | number,
): Promise<[Menu | null, Error | null]> {
    const date = new Date(date_string);
    const date_formatted = `${
        date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    const url = `https://clemson.campusdish.com/api/menu/GetMenus?locationId=${id_location}&storeIds=&mode=Daily&date=${date_formatted}&time=&periodId=${period_id}&fulfillmentMethod=`;
    const response = await fetch(url);
    if (!response.ok) {
        return [null, new Error("Menu request failed")];
    }
    const json = (await response.json()) as ResponseMenu;
    return [json.Menu, null];
}

export async function get_day_menu(
    date_string: string | number,
): Promise<[DayMenu | null, Error | null]> {
    let items: FoodItemInstance[] = [];
    for (const period_id of Object.keys(TIMES)) {
        for (const id_location of Object.keys(LOCATIONS)) {
            let [menu, err] = await get_location_menu(id_location, date_string, period_id);
            // 
            if (err != null) {
                return [null, err];
            }
            if (menu == null) {
                return [null, new Error("No error was given but menu was null")];
            }

            const skip_group = (product: Product): boolean => {
                return (
                    product.Product.Categories.findIndex(
                        (cat) => cat.DisplayName == "Condiments",
                    ) != -1
                );
            };

            for (const product of menu.MenuProducts) {
                const name = product.Product.MarketingName.replace(/\(.*?\)/, "");
                
                if (skip_group(product) || BLACKLIST.includes(product.Product.MarketingName)) {
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
    }

    items = items.map((item, index, array) => {
        // remove trailing spaces from items
        item.name = item.name.replace(/ $/g, '');

        // convert fresh-cut french fries to fresh cut french fries
        if (item.name == "Fresh-Cut French Fries") {
            item.name = "Fresh Cut French Fries"
        }
        if (item.name == "Pork, Pulled, Carolina") {
            item.name = "Carolina Pulled Pork"
        }
        return item;
    });

    // filtering
    items = items.filter((item, index, array) => {
        // skip items on the blacklist
        if (BLACKLIST.includes(item.name)) {
            return false;
        } else {
            return true;
        }
    })

    // Group food items by name and create the required output format
    const groupedItems: { [key: string]: any } = {};
    items.forEach((item) => {
        if (groupedItems[item.name]) {
            const isDuplicate = groupedItems[item.name].locations.some((loc: any) => {
                return loc.time === item.time && loc.location === item.location;
            });
        
            if (!isDuplicate) {
                groupedItems[item.name].locations.push({
                    time: item.time,
                    location: item.location,
                });
            }
        }
        else {
            groupedItems[item.name] = {
                name: item.name,
                desc: item.desc,
                locations: [
                    {
                        time: item.time,
                        location: item.location,
                    },
                ],
            };
        }
    });

    const resultItems = Object.values(groupedItems);
    
    return [{ items: resultItems }, null];

}

export async function get_all_food(): Promise<[AllFood | null, Error | null]> {
    let date = new Date();
    const output: FoodItem[] = [];

    for (let i = 0; i < 6; i++) {
        let date_stamp = date.getTime() + i * (1000 * 60 * 60 * 24);

        const [instances, err] = await get_day_menu(date_stamp);
        if (err != null) {
            return [null, err];
        }
        if (instances == null) {
            return [null, new Error("instances is null for some reason")];
        }

        // replacements
        let items = instances.items.map((item, index, array) => {
            // remove trailing spaces from items
            item.name = item.name.replace(/ $/g, '');

            // convert fresh-cut french fries to fresh cut french fries
            if (item.name == "Fresh-Cut French Fries") {
                item.name = "Fresh Cut French Fries"
            }
            return item;
        });

        // filtering
        items = items.filter((item, index, array) => {
            // skip items on the blacklist
            if (BLACKLIST.includes(item.name)) {
                return false;
            } else {
                return true;
            }
        })

        // const filter_out = (name: string): boolean => {
        //     return items.findIndex((item) => item.name == name) != -1;
        // };
        for (const instance of items) {
            // if (filter_out(instance.name)) continue;
            output.push(instance);
        }

    }

    // remove duplicate entries
    let newTmpItems = output.filter((value, index, self) =>
    index === self.findIndex((t: any) => (
        t.name === value.name
    )))
    return [{items: newTmpItems}, null];
}
