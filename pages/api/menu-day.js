// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { get_day_menu } from "@/util/scraper";
const fs = require('fs/promises');
const fssync = require('fs');
const path = require('path');

// define the paths for the json folder as well as the todays_menu path
const jsonFolderPath = path.join(process.cwd(), 'json');
const filePath = path.join(jsonFolderPath, 'todays_menu.json');
fssync.mkdirSync(jsonFolderPath,  { recursive: true }); // create the json folder if it doesn't already exist

function checkFileExistsSync(filepath){
    let flag = true;
    try{
      fssync.accessSync(filepath, fssync.constants.F_OK);
    }catch(e){
      flag = false;
      console.log(e);
    }
    return flag;
}

async function getFromSource(date_string) {
    // get all food from scraper
    let [menu, err] = await get_day_menu(date_string);
    // assign the date property consisting of the day of the week
    // this allows us to refresh the menu if the day of the week of the logged data is different
    menu.date = new Date().getDay();
    await fs.writeFile(filePath, JSON.stringify(menu)).catch((err) => {throw err;}); // create the file
    return menu; // return the menu
}

export default async function handler(req, res) {
    let { date } = req.query;
    const date_string = date || '';

    // check if file exists
    let fileExists = checkFileExistsSync(filePath);

    // if the file doesn't exist, create it and get data from campus dish
    if (!fileExists) {
        console.log('[API] json/todays_menu.json does not exist, loading data from CampusDish and generating...')
        let menu = await getFromSource(date_string);
        console.log('[API] json/todays_menu.json generated.');

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