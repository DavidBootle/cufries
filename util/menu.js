const { spawn } = require('child_process');
import path from "path";
const fs = require('fs/promises');
const fssync = require('fs');

// setup default paths
const jsonFolderPath = path.join(process.cwd(), 'json');
const allFoodPath = path.join(jsonFolderPath, 'all_food.json');
const todayPath = path.join(jsonFolderPath, 'todays_menu.json');

class MenuUpdater {

    constructor() {
        this.updating = false;
    }

    update() {
        if (this.updating) {
            console.log("[MenuUpdater] Internal call to MenuUpdater.update() while already updating. Ignoring.");
            return;
        }

        this.updating = true;

        // get location of rust executable
        let rustPath = process.env.MENUPARSER_EXECUTABLE_PATH || './rust/target/release/menuparser';

        let process = spawn(rustPath, ['./json']);

        if (!process) {
            console.log(`[ERROR!!!] Failed to spawn menuparser!`);
        }
        
        process.stdout.on('data', data => {
            console.log(`[MENUPARSER] ${data}`);
        });

        process.stderr.on('data', data => {
            console.log(`[MENUPARSER] ${data}`);
        });

        process.on('close', (code) => {
            console.log(`[ API ] menuparser finished with code ${code}.`);
            this.updating = false;
        });
    }

    /**
     * Will verify that the menu exists, and if it doesn't, it will create it.
     * Returns true if the menu already exists and is not out of date.
     * Returns false if the menu does not exist or is out of date.
     * If false is returned, the menu will be updated, so return a 204 to the user.
     */
    async verifyOrCreate() {
        // verify that both files exist
        let allFoodExists = true;
        let todayMenuExists = true;
        fs.access(allFoodPath, fssync.constants.F_OK).catch(() => {
            allFoodExists = false;
        });
        fs.access(todayPath, fssync.constants.F_OK).catch(() => {
            todayMenuExists = false;
        });

        // if either file does not exist, update the menu and return false
        if (!allFoodExists || !todayMenuExists) {
            console.log("[MenuUpdater] Menu does not exist, generating...");
            this.update();
            return false;
        }

        // check all_foods to see if it is out of date
        let buffer = await fs.readFile(allFoodPath).catch((err) => {throw err;});
        let allFood = JSON.parse(buffer);
        let today = new Date().getDate();
        if (allFood.date != today) {
            console.log("[MenuUpdater] Menu is out of date, updating...");
            this.update();
            return false;
        }

        return true;
    }
}

let menuUpdater = new MenuUpdater();
export default menuUpdater;