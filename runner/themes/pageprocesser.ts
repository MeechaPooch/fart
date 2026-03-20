import fs from 'fs'
import path from 'path'
import { DirNode } from "../dirnode";
import { homename, webprefix, websitename } from '../consts';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { templates } from '../loadtemplates';
let pageHtml = fs.readFileSync(__dirname + path.sep + 'page.html').toString() // soon change this location to a theme directory
let locationbuttonHtml = fs.readFileSync(__dirname + '/components/locationbutton.html').toString() // soon change this location to a theme directory
let filetypehtml = fs.readFileSync(__dirname + '/components/filetype.html').toString() // soon change this location to a theme directory
let quicklinkHtml = fs.readFileSync(__dirname + '/components/quicklink.html').toString() // soon change this location to a theme directory

export function processpage(html: string, dirnode: DirNode): string {

    let parsed = dirnode.getNote() ?? ''
    parsed = parsed.replace(/\n(?=\n)/g, "\n<br>\n");
    parsed = marked.parse(parsed,{async:false,breaks:true,gfm:true})

    return pageHtml
        .replaceAll('$pagehtml', html)
        .replaceAll('$websitename',websitename)
        .replaceAll('$homeurl', webprefix + '/' + homename)
        .replaceAll('$pagetitle', dirnode.getName())
        .replaceAll('$nextlink',dirnode.getSiblings()[dirnode.getSiblingIndex()-1]?.getWebUrl())
        .replaceAll('$prevlink',dirnode.getSiblings()[dirnode.getSiblingIndex()+1]?.getWebUrl())
        .replaceAll('$currentlocation', dirnode.getPath().map(createLocationButton).join(' → '))
        .replaceAll('$quicklinks', dirnode.getRoot().getNormalChildren().map(e => createQuickLink(e, dirnode)).join(' | '))
        .replaceAll('$itemname', dirnode.getName())
        .replaceAll('$parentname', iconify(dirnode.getParent() ?? dirnode))
        .replaceAll('$shouldbackbuttonhideFriends', (dirnode.getIsRoot() || dirnode.getSiblings().length<2) ? 'hidden' : 'dummy')
        .replaceAll('$shouldbackbuttonhideAlone', (dirnode.getIsRoot() || dirnode.getSiblings().length>=2) ? 'hidden' : 'dummy')
        .replaceAll('$debuginfo', `
            Mimetype: ${dirnode.getMimetype()}<br>
            Mediatype: ${dirnode.getMediatype()}<br>
            Template: ${dirnode.getTemplate()}<br>
            `)
        // .replaceAll('$shouldihide',dirnode.getIsRoot()?'hidden':'dummy')
        // .replaceAll('$note','this is a note') // need to purify
        .replaceAll('$note',parsed) // need to purify
}

function createQuickLink(dirnode: DirNode, location: DirNode) {
    return quicklinkHtml
        .replaceAll('$url', dirnode.getWebUrl())
        .replaceAll('$name', iconifyboldif(dirnode, location))
}

function createLocationButton(dirnode: DirNode, index: number, array: any[]): string {
    return quicklinkHtml
        .replaceAll('$url', dirnode.getWebUrl())
        .replaceAll('$name', iconify(dirnode))
}


// bold it if you are within the path
export function iconifyboldif(button: DirNode, currentlocation: DirNode): string {
    if (button.hasChild(currentlocation)) {
        return `
        <strong>
            ${iconify(button)}
        </strong>
        `
    } else {
        return iconify(button)
    }
}
// button of image instead of 

export function neutername(name:string) {
    let neuteredname = name;
    if (neuteredname.includes('.')) {
        neuteredname = neuteredname.split('.').slice(0, -1).join('.')
    }
    return neuteredname
}

export function iconify(dirnode: DirNode): string {
    let neuteredname = dirnode.getName();
    if (neuteredname.includes('.')) {
        neuteredname = neuteredname.split('.').slice(0, -1).join('.')
    }
    let icon = dirnode.getIconHtml();

    let ret = icon ? filetypehtml
        .replaceAll('$icon', icon)
        .replaceAll('$neuteredname', neuteredname) : dirnode.getName();
    return ret;
}