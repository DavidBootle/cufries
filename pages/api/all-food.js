import menuUpdater from '@/util/menu';
import path from "path";

// define the paths for the json folder as well as the all_food path
const jsonFolderPath = path.join(process.cwd(), 'json');
const filePath = path.join(jsonFolderPath, 'all_food.json');
fssync.mkdirSync(jsonFolderPath,  { recursive: true }); // create the json folder if it doesn't already exist

export default async function handler(req, res) {
    // check if file exists
    let fileExists = menuUpdater.verifyOrCreate();

    // if the file doesn't exist, create it and get data from campus dish
    if (!fileExists) {

        if (!menuUpdater.updating) {
            console.log('[/api/all-food] Menu files do not exist. Returning 204 while updating.')
            res.status(204).send();
        } else {
            console.log('[/api/all-food] Request made while menu is not yet ready!');
            res.status(204).send();
        }
    }
    
    // if it does exist, read from the file
    let buffer = await fs.readFile(filePath).catch((err) => {throw err;});
    let menu = JSON.parse(buffer);
    res.status(200).json(menu['items']);
}
