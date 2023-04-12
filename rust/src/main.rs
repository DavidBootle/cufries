/**
 * MenuParser
 * Download and process the menu from CampusDish and save it as JSON.
 * Should be run as a command line binary.
 * Run `<executable> daymenu` to download and update the daily menu.
 * Run `<executable> fullmenu` to download and update the menu with all items.
 */

mod lib;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 2 {
        println!("Usage: {} [daymenu|fullmenu]", args[0]);
        return;
    }
    let menu_type = &args[1];
    // match menu_type.as_str() {
    //     "daymenu" => menu::get_day_menu(),
    //     "fullmenu" => menu::get_full_menu(),
    //     _ => {
    //         println!("Usage: {} [daymenu|fullmenu]", args[0]);
    //         return;
    //     }
    // };
}