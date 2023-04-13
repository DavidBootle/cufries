/**
 * MenuParser
 * Download and process the menu from CampusDish and save it as JSON.
 * Should be run as a command line binary.
 * Run the executable to update all menus.
 */

mod types;
mod menu;

use menu::{todays_menu};
use chrono::{Local, Datelike};
use std::fs::File;
use std::path::Path;
use std::env::args;
use std::io::Write;
use types::OutFile;

#[tokio::main]
async fn main() {
    let today_date = Local::now();

    // create file path object
    let input_file_path = match args().nth(1) {
        Some(path) => path,
        None => {
            eprintln!("No input file path provided.");
            println!("SYNTAX: <executable> <path_to_json_folder>");
            std::process::exit(1);
        }
    };
    let json_folder = Path::new(input_file_path.as_str());
    
    let todays_menu_path = json_folder.join("todays_menu.json");
    let _all_foods_path = json_folder.join("all_foods.json");

    // get today's menu
    let today_menu = todays_menu(today_date).await;
    let today_menu_out = OutFile {
        date: today_date.day() as i32,
        items: today_menu,
    };

    // save today's menu
    let today_menu_json = serde_json::to_string(&today_menu_out).unwrap();

    // open todays_menu_path
    let mut todays_menu_file = match File::create(todays_menu_path) {
        Err(_) => panic!("Failed to create today menu output file!"),
        Ok(file) => file,
    };
    // write today's menu to file
    match todays_menu_file.write_all(today_menu_json.as_bytes()) {
        Err(_) => panic!("Failed to write today's menu to file!"),
        Ok(_) => println!("Wrote today menu to file."),
    }
}