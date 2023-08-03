const { spawn } = require('child_process');
import path from "path";
const fs = require('fs/promises');
const fssync = require('fs');

// setup default paths
const jsonFolderPath = path.join(process.cwd(), 'json');
const allFoodPath = path.join(jsonFolderPath, 'all_food.json');
const todayPath = path.join(jsonFolderPath, 'todays_menu.json');

const EXECUTABLE_PATH = process.env.MENUPARSER_EXECUTABLE_PATH || './rust/target/release/menuparser';

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

        let process = spawn(EXECUTABLE_PATH, ['./json']);

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
        let filesMissing = false;

        try {
            await fs.access(allFoodPath, fssync.constants.F_OK);
            await fs.access(todayPath, fssync.constants.F_OK);
        } catch {
            filesMissing = true;
        }

        // if either file does not exist, update the menu and return false
        if (filesMissing) {
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