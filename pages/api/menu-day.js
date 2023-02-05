// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { get_day_menu } from "@/util/scraper";
import { DayMenu } from "@/util/types";
import internal from "stream";
const fs = require('fs/promises');
const fssync = require('fs');

function checkFileExistsSync(filepath){
    let flag = true;
    try{
      fssync.accessSync(filepath, fs.constants.F_OK);
    }catch(e){
      flag = false;
      console.log(e);
    }
    return flag;
}

async function getFromSource(date_obj) {
    let [menu, err] = await get_day_menu(date_obj);
    menu.date = new Date().getDay();
    await fs.writeFile(".day_menu.json", JSON.stringify(menu)).catch((err) => console.log(err));
    // set date
    return menu;
}

export default async function handler(req, res) {
    const { date } = "";
    const date_obj = new Date(date);
    let fileExists = checkFileExistsSync(".day_menu.json");
    if (!fileExists) {
        let menu = await getFromSource(date_obj);
        res.status(200).json(menu);
    } else {
        let menu = JSON.parse(await fs.readFile(".day_menu.json"));
        if (menu.date != new Date().getDay()) {
            menu = await getFromSource();
        }
        res.status(200).json(menu);
    }

}