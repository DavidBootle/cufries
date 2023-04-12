use chrono::{DateTime, Datelike, Local};
use crate::types::{Period, Location, MenuItem, FoodCategory};
use crate::types::Location::*;
use crate::types::Period::*;
use std::time::Instant;
use serde_json::{Value};

pub async fn get_location_menu(location: Location, date: DateTime<Local>, period: Period) -> Vec<MenuItem> {
    // get a formatted date string to pass into the request

    // convert enum to numerical id
    let location_id = match location {
        Core => 9713,
        Schilleter => 1891,
    };

    let period_id = match period {
        Breakfast => 891,
        Lunch => 892,
        Dinner => 893,
        Brunch => 973,
    };

    // get url
    let date_formatted = format!("{}/{}/{}", date.month(), date.day(), date.year());
    let url = format!("https://clemson.campusdish.com/api/menu/GetMenus?locationId={}&storeIds=&mode=Daily&date={}&time=&periodId={}&fulfillmentMethod=", location_id, date_formatted, period_id);

    let request = reqwest::get(url).await.expect("Failed to make reqeust to CampusDish.");

    let body = request.text().await.expect("Failed to get body from request.");

    let timer = Instant::now();
    let data: Value = serde_json::from_str(&body).expect("Failed to parse JSON response.");
    
    let products = data["Menu"]["MenuProducts"].as_array().expect("Failed to get necessary object (MenuProducts) from JSON.");

    // create list of menu items
    let mut items:Vec<MenuItem> = Vec::with_capacity(products.len());

    for (index, product) in products.iter().enumerate() {
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

    items

}