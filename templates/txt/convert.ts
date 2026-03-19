import fs from 'fs'
import path from 'path'
import { DirNode } from '../../runner/dirnode'
import { webprefix } from '../../runner/consts'
const template=fs.readFileSync(__dirname + path.sep + 'template.html').toString()

export default function convert(dirnode:DirNode):string {
    let textfile = dirnode.readSync()
    textfile = textfile.replaceAll('\n','<br>')
    let publishdate = new Date(dirnode.statSync().mtime).toLocaleDateString()
    let author = webprefix.replaceAll('/','') //todo replace
    let output = template
        .replaceAll('$content',textfile)
        .replaceAll('$author',author)
        .replaceAll('$publish_date',publishdate)
    return output;
}