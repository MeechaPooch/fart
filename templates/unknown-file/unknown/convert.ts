import path from "path";
import { DirNode } from "../../runner/dirtree";
import fs from 'fs';
let templateHtml = fs.readFileSync(__dirname + path.sep + 'template.html').toString()

export default function convert(dirnode:DirNode):string {
    return templateHtml.replaceAll('$itemname',dirnode.name)
}