import { DirNode } from "../../runner/dirnode";
import fs from 'fs'
let templateHtml = fs.readFileSync(__dirname + '/template.html').toString();
let squareHtml = fs.readFileSync(__dirname + '/components/square.html').toString();

export default function convert(dirnode: DirNode): string {
    const elemwidth=150;

    return templateHtml
        .replaceAll('$squareselems', dirnode.getNormalChildren().map(createSquare).join('\n'))
        .replaceAll('$squarewidth',elemwidth.toString())
}

export function createSquare(dirnode: DirNode): string {
    // return 'hi'
    return squareHtml
        .replaceAll('$itemicon', dirnode.generateIconHtml())
        // .replaceAll('$imageurl', dirnode.getImageUrl())
        .replaceAll('$nametitle', dirnode.getDisplayName())
        .replaceAll('$clicklink',dirnode.getWebUrl())
}