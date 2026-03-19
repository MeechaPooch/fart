import { DirNode } from "../../runner/dirnode";
import fs from 'fs'
let templateHtml = fs.readFileSync(__dirname + '/template.html').toString();
let squareHtml = fs.readFileSync(__dirname + '/components/square.html').toString();

export default function convert(dirnode: DirNode): string {
    const elemwidth=40;

    return templateHtml
        .replaceAll('$squareselems', dirnode.getNormalChildren().map(createSquare).join('\n'))
        .replaceAll('$squarewidth',elemwidth.toString())
}

export function createSquare(dirnode: DirNode): string {
    // return 'hi'
    return squareHtml
        .replaceAll('$itemicon', dirnode.generateIconHtml())
        // .replaceAll('$imageurl', dirnode.getImageUrl())
        .replaceAll('$nametitle', dirnode.getNameNeutered())
        .replaceAll('$clicklink',dirnode.getWebUrl())
        .replaceAll('$datetext',dirnode.statSync().mtime.toLocaleDateString())
}

// function formatDateString(mtime:Date) {
//     mtime.
// }