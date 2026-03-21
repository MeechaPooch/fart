import fs from 'fs'
import path from 'path';
import { DirNode } from '../../runner/dirnode';
import { webprefix } from '../../runner/consts';
let template = fs.readFileSync(__dirname + path.sep + './template.html').toString()
const stylesheet = fs.readFileSync(__dirname + path.sep + './style.css').toString()
const script = fs.readFileSync(__dirname + path.sep + './script.js').toString()
template = template += `<style>\n${stylesheet}\n</style>`
template = template += `<script>\n${script}\n</script>`

export default function convert(dirnode: DirNode): string {
    let siblings = dirnode.getSiblings()
    let myindex = siblings.indexOf(dirnode)
    // naturally sort by whatever the applied sort criteria is
    let nextSibling = myindex < siblings.length - 1 ? siblings[myindex + 1] : null
    let prevSibling = myindex > 0 ? siblings[myindex - 1] : null


    let output = template
        .replaceAll('$filename', dirnode.name)
        .replaceAll('$webprefix', webprefix)
        .replaceAll('$nexturl', nextSibling ? '../' + nextSibling.name : '')
        .replaceAll('$prevurl', prevSibling ? '../' + prevSibling.name : '')
        .replaceAll('$mediaelement', generateMediaElement(dirnode))
        .replaceAll('$asseturl', dirnode.getAssetWebUrl())
        .replaceAll('$nextimageasseturl',dirnode.nextSibling()?.getAssetWebUrl())
        .replaceAll('$previmageasseturl',dirnode.prevSibling()?.getAssetWebUrl())
    return output;
}

function generateMediaElement(dirnode: DirNode) {
    if (dirnode.getMediatype() == 'image') {

        return `
        <image src='${dirnode.getAssetWebUrl()}'/>
`
        // <a href='${dirnode.getAssetWebUrl()}'>
        // </a>`

    } else if (dirnode.getMediatype() == 'video') {

        return ` <video controls>
                <source src='${dirnode.getAssetWebUrl()}' type='${dirnode.getMimetype()}'>
                Your browser does not support the video tag.
        </video> `

    } else {
        return ''
    }
}