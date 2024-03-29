import fs from 'fs/promises';
import path from 'path';

const placeholderPath = path.join(process.cwd(), 'public', 'images', `_Placeholder.webp`);

export default async function handler(req, res) {
    // get name from query
    const { name } = req.query;
    const filePath = path.join(process.cwd(), 'public', 'images', `${name}.webp`);

    res.setHeader('Content-Type', 'image/webp');

    await fs.access(filePath)
    .then(async () => {
        // image exists for food item, send image
        let imageBuffer = await fs.readFile(filePath);
        res.send(imageBuffer);
    })
    .catch(async () => {
        // image does not exist for food item, send placeholder
        let imageBuffer = await fs.readFile(placeholderPath);
        res.send(imageBuffer);
    })
}