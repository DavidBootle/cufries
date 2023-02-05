import { get_all_food, get_day_menu } from "@/util/scraper";
import { AllFood, DayMenu } from "@/util/types";
import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs/promises');

async function getFromSource() {
    let [menu, err] = await get_all_food();
    // set date
    menu.date = new Date().getDay();
    await fs.writeFile('.all_food.json', JSON.stringify(menu)).catch((err) => {console.log(err);});
    return menu;
}

export default async function handler(req, res) {
    // get from files
    let fileExists = await fs.exists(".all_food.json");

    if (!fileExists) {
        let menu = await getFromSource();

        res.status(200).json(menu);
    } else {
        let menu = await fs.readFile(".all_food.json");
        if (menu.date != new Date().getDay()) {
            menu = await getFromSource();
        }
        res.status(200).json(JSON.parse(menu));
    }
}
