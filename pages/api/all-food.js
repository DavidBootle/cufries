import { get_all_food, get_day_menu } from "@/util/scraper";
import { AllFood, DayMenu } from "@/util/types";
import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs/promises');
const fssync = require('fs');

function checkFileExistsSync(filepath){
    let flag = true;
    try{
      fssync.accessSync(filepath, fs.constants.F_OK);
    }catch(e){
      flag = false;
    }
    return flag;
}

async function getFromSource() {
    let [menu, err] = await get_all_food();
    // set date
    menu.date = new Date().getDay();
    await fs.writeFile('.all_food.json', JSON.stringify(menu)).catch((err) => {console.log(err);});
    
    return menu;
}

export default async function handler(req, res) {
    // get from files
    let fileExists = checkFileExistsSync(".all_food.json");

    if (!fileExists) {
        console.log("File doesn't exist, generating");
        let menu = await getFromSource();

        res.status(200).json(menu);
    } else {
        console.log("File exists, loading from file");
        let menu = JSON.parse(await fs.readFile(".all_food.json").catch((err) => console.log(err)));
        if (menu.date != new Date().getDay()) {
            menu = await getFromSource();
        }
        res.status(200).json(menu);
    }
}
