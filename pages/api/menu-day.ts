// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { get_day_menu } from "@/util/scraper";
import { DayMenu } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import internal from "stream";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DayMenu>,
) {
    const { date } = req.query;
    const date_obj = new Date(date as string);
    let [menu, err] = await get_day_menu(date_obj);
    if (err != null || menu == null) {
        res.status(400);
        return;
    }

    res.status(200).json(menu);
}
