import path from "path";
import { DirNode } from "../../runner/dirnode";
import fs from 'fs';
import { assetsname, webprefix } from "../../runner/consts";
let templateHtml = fs.readFileSync(__dirname + path.sep + 'template.html').toString()

export default function convert(dirnode:DirNode):string {
    return templateHtml
    .replaceAll('$itemname',dirnode.name)
    .replaceAll('$webprefix',webprefix)
    .replaceAll('$itempath',dirnode.getFullPathString())
    .replaceAll('$assetsname',assetsname)
}