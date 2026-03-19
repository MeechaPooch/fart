import path from "path";
import { DirNode } from "../../runner/dirnode";
import fs from 'fs';
let templateHtml = fs.readFileSync(__dirname + path.sep + 'template.html').toString()

export default function convert(dirnode:DirNode):string {
    return templateHtml.replaceAll('$itemname',dirnode.name)
}