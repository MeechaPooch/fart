import { DirNode } from "../../runner/dirnode";
import fs from 'fs'

let templateHtml = fs.readFileSync(__dirname + '/template.html').toString()

export default function convert(dirnode:DirNode):string {
    return templateHtml
        .replaceAll('$pdfurl',dirnode.getAssetWebUrl())
}