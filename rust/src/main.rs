/**
 * MenuParser
 * Download and process the menu from CampusDish and save it as JSON.
 * Should be run as a command line binary.
 * Run the executable to update all menus.
 */

mod types;
mod menu;

use menu::get_location_menu;
use chrono::{Local};
use types::{Location, Period};

#[tokio::main]
async fn main() {
    let today_date = Local::now();

    get_location_menu(Location::Core, today_date, Period::Breakfast).await;
}