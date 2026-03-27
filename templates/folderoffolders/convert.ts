import { DirNode } from "../../runner/dirnode";
import fs from 'fs'
import generateFolderContents from '../foldersquares/convert.ts'
let templateHtml = fs.readFileSync(__dirname + '/template.html').toString();
let guyHtml = fs.readFileSync(__dirname + '/components/aguy.html').toString();

export default async function convert(dirnode: DirNode): Promise<string> {
    const elemwidth = 40;



     return templateHtml
        .replaceAll('$squareselems', (await Promise.all(dirnode.getNormalChildren().sort(
            (a, b) => {
                return b.getName() - a.getName()
            }
        ).map(createGoob))).join('\n'))
    // .replaceAll('$squarewidth',elemwidth.toString())
}

export async function createGoob(dirnode: DirNode): Promise<string> {
    // return 'hi'
    return guyHtml
        .replaceAll('$foldername', dirnode.getDisplayName())
        // .replaceAll('$imageurl', dirnode.getImageUrl())
        .replaceAll('$foldercontent', await dirnode.renderTemplate())
        .replaceAll('$clicklink', dirnode.getWebUrl())
        .replaceAll('$assetweburl', dirnode.getAssetWebUrl())
}

// function formatDateString(mtime:Date) {
//     mtime.
// }