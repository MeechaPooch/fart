import fs from 'fs'
import path from 'path'
import { DirNode } from '../../runner/dirnode'
import { marked } from 'marked'
import { webprefix } from '../../runner/consts'
const template = fs.readFileSync(__dirname + path.sep + 'template.html').toString()

export default function convert(dirnode: DirNode): string {
    let textfile = dirnode.readSync()
    let parsed = textfile
    // parsed = parsed.replace(/\n/g,'\n\n');
    parsed = parsed.replace(/\n(?=\n)/g, "\n<br>\n");
    parsed = marked.parse(parsed,{async:false,breaks:true,gfm:true})
    console.log('soulsinger',parsed)
    let publishdate = new Date(dirnode.statSync().mtime).toLocaleDateString()
    let author = webprefix.replaceAll('/', '') //todo replace
    let output = template
        .replaceAll('$content', parsed)
        .replaceAll('$author', author)
        .replaceAll('$publish_date', publishdate)
    return output;
}