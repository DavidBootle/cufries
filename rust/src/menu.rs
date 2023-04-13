use chrono::{DateTime, Datelike, Local};
use crate::types::{Period, Location, MenuItem, FoodCategory, FoodItem, LocationTime};
use crate::types::FoodCategory::*;
use std::time::Instant;
use serde_json::{Value};

static BLACKLIST: [&str; 57] = [
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
];

pub async fn get_location_menu(location: Location, date: DateTime<Local>, period: Period) -> Vec<MenuItem> {
    let timer = Instant::now();

    // get a formatted date string to pass into the request

    // convert enum to numerical id
    let location_id = location.id();

    let period_id = period.id();

    // get url
    let date_formatted = format!("{}/{}/{}", date.month(), date.day(), date.year());
    let url = format!("https://clemson.campusdish.com/api/menu/GetMenus?locationId={}&storeIds=&mode=Daily&date={}&time=&periodId={}&fulfillmentMethod=", location_id, date_formatted, period_id);

    let request = reqwest::get(url).await.expect("Failed to make reqeust to CampusDish.");

    let body = request.text().await.expect("Failed to get body from request.");

    let data: Value = serde_json::from_str(&body).expect("Failed to parse JSON response.");
    
    let products = data["Menu"]["MenuProducts"].as_array().expect("Failed to get necessary object (MenuProducts) from JSON.");

    // create list of menu items
    let mut items:Vec<MenuItem> = Vec::with_capacity(products.len());

    for product in products.iter() {
        let mut item = MenuItem {
            name: String::new(),
            categories: Vec::new(),
        };

        item.name = product["Product"]["MarketingName"].as_str().expect("Failed to get marketing name when parsing through JSON response.").to_string();

        let categories = product["Product"]["Categories"].as_array().unwrap();

        for category in categories {
            item.categories.push(match category["DisplayName"].as_str().unwrap() {
                "Entrées" => FoodCategory::Entrees,
                "Sandwiches" => FoodCategory::Sandwiches,
                "Cereals" => FoodCategory::Cereals,
                "Pizza" => FoodCategory::Pizza,
                "Sides" => FoodCategory::Sides,
                "Soups" => FoodCategory::Soups,
                "Breads" => FoodCategory::Breads,
                "Desserts" => FoodCategory::Desserts,
                "Protein" => FoodCategory::Protein,
                "Grains" => FoodCategory::Grains,
                "Salads" => FoodCategory::Salads,
                "Condiments" => FoodCategory::Condiments,
                "Sauces" => FoodCategory::Sauces,
                _ => FoodCategory::Other,
            })
        }

        items.push(item);
    }

    println!("[get_location_menu] Fetched menu for {} - {} ({}) in {}ms", location, period, date_formatted, timer.elapsed().as_millis());

    items

}

/**
Filter out specific items and rename other items if needed.
Takes in the menu and returns a list of FoodItems.
*/
pub fn filter_menu(menu: Vec<MenuItem>, location: Location, period: Period) -> Vec<FoodItem> {
    let mut items: Vec<FoodItem> = Vec::new();

    // add menu items to list of items
    for mut item in menu {
        // skip adding items that are sauces or condiments
        if item.categories.contains(&Sauces) || item.categories.contains(&Condiments) {
            continue;
        }

        // remove everything in parenthesis from name
        if let Some(index) = item.name.find('(') {
            item.name = item.name[..index].trim().to_string();
        }
        
        // remove padding whitespace
        item.name = item.name.trim().to_string();

        // convert specific food items
        item.name = match item.name.as_str() {
            "Fresh-Cut French Fries" => String::from("Fresh Cut French Fries"),
            "Pork Pulled, Carolina" => String::from("Carolina Pulled Pork"),
            name => String::from(name)
        };

        // skip adding items that are on the blacklist
        if BLACKLIST.contains(&item.name.as_str()) {
            continue;
        }

        // create new FoodItem
        let food_item = FoodItem {
            name: item.name,
            locations: vec![LocationTime {
                location: location,
                time: period,
            }],
        };
        items.push(food_item);
    }

    items
}

pub async fn todays_menu(date: DateTime<Local>) -> Vec<FoodItem> {
    let mut items: Vec<FoodItem> = Vec::new();

    // maybe handle CU worms at some point

    // loop through every time/location combo
    for &period in Period::all() {
        for &location in Location::all() {
            // get the menu for that location
            let menu = get_location_menu(location, date, period).await;

            // filter out non-food items
            let mut filtered_menu = filter_menu(menu, location, period);
            items.append(&mut filtered_menu);
        }
    }

    // condense duplicate items
    let mut condensed_items: Vec<FoodItem> = Vec::new();

    // loop through every item
    for item in items {
        // find out if the item is already in the list
        let mut found = false;
        let mut found_index = 0;
        for (index, condensed_item) in condensed_items.iter().enumerate() {
            if condensed_item.name == item.name {
                found = true;
                found_index = index;
                break;
            }
        }

        // if the item is already in the list, add the location/time to the existing item if the location/time is not already in it
        if found {
            // if the location/time is already in the list, skip this item
            if condensed_items[found_index].locations.iter().any(|x| {
                x.location == item.locations[0].location && x.time == item.locations[0].time
            }) {
                continue;
            }

            // otherwise add current item's locationtime to the existing item
            else {
                condensed_items[found_index].locations.push(item.locations[0]);
            }
        }

        // if not found, add entire item to condensed_items
        else {
            condensed_items.push(item);
        }
    }

    condensed_items
}