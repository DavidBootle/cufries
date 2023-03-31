import { get_all_food, get_day_menu } from "@/util/scraper";
import path from "path";
const fs = require('fs/promises');
const fssync = require('fs');

// define the paths for the json folder as well as the all_food path
const jsonFolderPath = path.join(process.cwd(), 'json');
const filePath = path.join(jsonFolderPath, 'all_food.json');
fssync.mkdirSync(jsonFolderPath,  { recursive: true }); // create the json folder if it doesn't already exist

// checks if the file exists
function checkFileExistsSync(filepath){
    let flag = true;
    try{
      fssync.accessSync(filepath, fssync.constants.F_OK);
    }catch(e){
      flag = false;
    }
    return flag;
}

async function getFromSource() {
    // get all food from scraper
    let [menu, err] = await get_all_food();
    // assign the date property consisting of the day of the week
    // this allows us to refresh the menu if the day of the week of the logged data is different
    menu.date = new Date().getDay();
    // read the file and parse as json

    // skip actually doing menu items on april fools (CUWorms)
    let date = new Date();
    if (date.getMonth() == 3 && date.getDate() == 1) {
        return menu;
    }

    // remove the locations property from all menu items
    for (let i = 0; i < menu.items.length; i++) {
        delete menu.items[i].locations;
    }
    
    // check if the file exists
    let data;
    let fileExists = checkFileExistsSync(filePath);
    if (fileExists) {
        data = JSON.parse(await fs.readFile(filePath).catch(err => { throw err; }));
        data.date = new Date().getDay();
        // add any new food items to the file
        console.log("Checking for menu items...");
        for (let i = 0; i < menu.items.length; i++) {
            let food = menu.items[i];
            // loop through each item in data
            let found = false;
            for (let j = 0; j < data.items.length; j++) {
                let dataFood = data.items[j];
                if (dataFood.name == food.name) {
                    found = true;
                }
            }

            if (!found) {
                console.log(`Adding new menu item ${food.name}`);
                data.items.push(food);
            }
        }
    } else {
        menu.date = new Date().getDay();
        data = menu;
    }

    await fs.writeFile(filePath, JSON.stringify(data)).catch((err) => {throw err;}); // create the file
    return data; // return the menu
}

export default async function handler(req, res) {
    // check if file exists
    let fileExists = checkFileExistsSync(filePath);

    // if the file doesn't exist, create it and get data from campus dish
    if (!fileExists) {
        console.log('[API] json/all_food.json does not exist, loading data from CampusDish and generating...')
        let menu = await getFromSource();
        console.log('[API] json/all_food.json generated.');

        res.status(200).json(menu);
    }
    
    // if it does exist, read from the file
    else {
        let menu = JSON.parse(await fs.readFile(filePath).catch((err) => {throw err;}));
        // if the logged day of the week is different from the current day of the week, then refetch data
        if (menu.date != new Date().getDay()) {
            menu = await getFromSource();
        }
        res.status(200).json(menu);
    }
}
