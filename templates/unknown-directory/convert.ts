import path from "path";
import { DirNode } from "../../runner/dirnode";
import fs from 'fs';
import { iconify } from "../../runner/themes/pageprocesser";
let templateHtml = fs.readFileSync(__dirname + path.sep + 'template.html').toString()
let itemHtml = fs.readFileSync(__dirname + path.sep + 'components' + path.sep + 'directoryitem.html').toString()

export default function convert(dirnode: DirNode): string {

    let populated = dirnode.getNormalChildren().map(createItemHtml).join('\n')

    return templateHtml
        .replaceAll('$itemname', dirnode.getFullPathString())
        .replaceAll('$populated', populated)
}

function createItemHtml(dirnode: DirNode) {
    return itemHtml
        .replaceAll('$itemname', dirnode.name)
        .replaceAll('$itembutton',iconify(dirnode))
}