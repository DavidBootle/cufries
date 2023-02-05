import { get_all_food, get_day_menu } from "@/util/scraper";
import { AllFood, DayMenu } from "@/util/types";
import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs/promises');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AllFood>,
) {
    let [menu, err] = await get_all_food();
    if (err != null || menu == null) {
        res.status(400);
        return;
    }
    await fs.writeFile('/tmp/all_food.json', JSON.stringify(menu)).catch((err:any) => {console.log(err);});

    res.status(200).json(menu);
}
