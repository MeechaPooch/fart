import fs from 'fs'
import path from 'path'
import { DirNode } from "../dirnode";
import { enginewebpath, homename, webprefix } from '../consts';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { templates } from '../loadtemplates';
let pageHtml = fs.readFileSync(__dirname + path.sep + 'page.html').toString() // soon change this location to a theme directory
let locationbuttonHtml = fs.readFileSync(__dirname + '/components/locationbutton.html').toString() // soon change this location to a theme directory
let filetypehtml = fs.readFileSync(__dirname + '/components/filetype.html').toString() // soon change this location to a theme directory
let quicklinkHtml = fs.readFileSync(__dirname + '/components/quicklink.html').toString() // soon change this location to a theme directory
let audioplayerhtml = fs.readFileSync(__dirname + '/components/audioplayer.html').toString()

export function processpage(html: string, pagedirnode: DirNode): string {
    let parsed = pagedirnode.getNote() ?? ''
    parsed = parsed.replace(/\n(?=\n)/g, "\n<br>\n");
    parsed = marked.parse(parsed, { async: false, breaks: true, gfm: true })

    return pageHtml
        .replaceAll('$pagehtml', html)
        .replaceAll('$websitename', pagedirnode.getMyTree().getWebsiteDisplayName()) // replace with custom name settings possible
        .replaceAll('$webprefix', webprefix)
        .replaceAll('$homeurl', webprefix)
        .replaceAll('$pagetitle', pagedirnode.getName())
        .replaceAll('$downloadpath', pagedirnode.getAssetWebUrl())
        .replaceAll('$nextlink', pagedirnode.getSiblings()[pagedirnode.getSiblingIndex() - 1]?.getWebUrl() ?? ' ')
        .replaceAll('$prevlink', pagedirnode.getSiblings()[pagedirnode.getSiblingIndex() + 1]?.getWebUrl() ?? ' ')
        .replaceAll('$currentlocation', (pagedirnode.getIsRoot()?'':'╱')+pagedirnode.getPath().map(createLocationButton).join('╱'))
        // .replaceAll('$currentlocation', dirnode.getPath().map(createLocationButton).join(' → '))
        .replaceAll('$quicklinks', pagedirnode.getRoot().getNormalChildren().map(e => createQuickLink(e, pagedirnode)).join(' | '))
        .replaceAll('$audioplayerelem', audioplayerhtml)
        .replaceAll('$itemname', pagedirnode.getName())
        .replaceAll('$parentname', iconify(pagedirnode.getParent() ?? pagedirnode))
        .replaceAll('$shouldbackbuttonhideFriends', (pagedirnode.getIsRoot() || pagedirnode.getSiblings().length < 2) ? 'hidden' : 'dummy')
        .replaceAll('$shouldbackbuttonhideAlone', (pagedirnode.getIsRoot() || pagedirnode.getSiblings().length >= 2) ? 'hidden' : 'dummy')
        .replaceAll('$debuginfo', `
            Mimetype: ${pagedirnode.getMimetype()}<br>
            Mediatype: ${pagedirnode.getMediatype()}<br>
            Template: ${pagedirnode.getTemplate()}<br>
            `)
        // .replaceAll('$shouldihide',dirnode.getIsRoot()?'hidden':'dummy')
        // .replaceAll('$note','this is a note') // need to purify
        .replaceAll('$note', parsed) // need to purify
        .replaceAll('$showdownloadbutton', pagedirnode.isfile ? '' : 'hidden')
        .replaceAll('$enginewebpath',enginewebpath)
        .replaceAll('$boldifathome',pagedirnode.getIsRoot() ? 'bold':'')




    function createQuickLink(dirnode: DirNode, location: DirNode) {
        return quicklinkHtml
            .replaceAll('$url', dirnode.getWebUrl())
            .replaceAll('$name', iconifyboldif(dirnode, location))
            .replaceAll('$assetweburl', dirnode.getAssetWebUrl())
    }

    function createLocationButton(dirnode: DirNode, index: number, array: any[]): string {
        return locationbuttonHtml
            .replaceAll('$url', dirnode.getWebUrl())
            .replaceAll('$name', iconify(dirnode))
            .replaceAll('$assetweburl', dirnode.getAssetWebUrl())
    }

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

export function neutername(name: string) {
    let neuteredname = name;
    if (neuteredname.includes('.')) {
        neuteredname = neuteredname.split('.').slice(0, -1).join('.')
    }
    return neuteredname
}

export function iconify(dirnode: DirNode): string {
    let neuteredname = dirnode.getDisplayName();
    if (neuteredname.includes('.')) {
        neuteredname = neuteredname.split('.').slice(0, -1).join('.')
    }
    let icon = dirnode.getIconHtml();
    if (dirnode.getIsRoot()) icon = '🏠'

    let ret = icon ? filetypehtml
        .replaceAll('$icon', icon)
        .replaceAll('$neuteredname', neuteredname) : dirnode.getName();
    return ret;
}