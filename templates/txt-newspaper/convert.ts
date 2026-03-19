import fs from 'fs'
import path from 'path'
import { DirNode } from '../../runner/dirnode'
import { webprefix } from '../../runner/consts'
const template=fs.readFileSync(__dirname + path.sep + 'template.html').toString()

export default function convert(dirnode:DirNode):string {
    let inputfiletext = dirnode.readSync()
    let split = inputfiletext.split('\n')
    let title = split[0]
    let abody = split.slice(1,-1).join('\n')
    let publishdate = new Date(dirnode.statSync().mtime).toLocaleDateString()
    let author = webprefix.replaceAll('/','') //todo replace
    let output = template
        .replaceAll('$title',title)
        .replaceAll('$content',abody)
        .replaceAll('$author',author)
        .replaceAll('$publish_date',publishdate)
    return output;
}