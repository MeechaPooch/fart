import { DirNode } from "../../runner/dirnode";
import fs from 'fs'
import path from 'path'
import { parseFile } from 'music-metadata'
import CodecParser from 'codec-parser'
import { secstohms } from "../../runner/utils";
import { enginedir, enginepath, websitename } from "../../runner/consts";
let template = fs.readFileSync(__dirname + path.sep + 'template.html').toString()
let tracktemplate = fs.readFileSync(__dirname + path.sep + 'components/track.html').toString()

let default_image_url = enginepath + '/images/blank-cd.png' //todo put image file

// todo- scope this or have it be in a map of dirnode path to allow for asyncronous similtaneous page generation
let totalDuration = 0

export default async function convert(dirnode: DirNode): Promise<string> {
    totalDuration = 0;

    let info = discoverInfo(dirnode);

    return template
        .replaceAll('$title', info.title)
        .replaceAll('$artist', info.artist) // todo fix
        .replaceAll('$year', new Date(dirnode.statSync().mtime).getFullYear().toString())
        .replaceAll('$imageurl', dirnode.getNormalChildren().filter(c => c.getMediatype() == 'image')[0]?.getAssetWebUrl() ?? default_image_url) // integrate special file into template or dirnode
        .replaceAll('$tracks', (await Promise.all(dirnode.getNormalChildrenMediatype('audio').map(createTrack))).join(`
            <div class="divider"></div>
            `))
        .replaceAll('$minutelength', (Math.round(totalDuration / 60)).toString())
        .replaceAll('$trackcount', dirnode.getNormalChildrenMediatype('audio').length.toString())
        .replaceAll('$assetweburl',dirnode.getAssetWebUrl())

}

async function createTrack(dirnode: DirNode) {
    console.log('parsing audio file', dirnode.getName())
    // @ts-ignore
    // let parser = new CodecParser(dirnode.getMimetype(), {
    //     onCodec: () => { },
    //     onCodecUpdate: () => { },
    //     enableLogging: true
    // })
    let duration = (await parseFile(dirnode.getFilePath(), { duration: true })).format.duration
    totalDuration += duration ?? 0
    console.log('parsing complete', dirnode.getDisplayName())
    // let duration=0

    let exp = tracktemplate;
    exp = exp
        .replaceAll('$trackname', dirnode.getDisplayName())
        .replaceAll('$trackduration', secstohms(duration))
        .replaceAll('$trackurl', dirnode.getAssetWebUrl())
        .replaceAll('$trackindex', (dirnode.getParent()?.getNormalChildrenMediatype('audio').indexOf(dirnode) ?? -1).toString())
    return exp;
}
// add settings definitions options
function discoverInfo(dirnode: DirNode) {
    // using the file name, separated by " - "
    let name = dirnode.getDisplayName();
    let split = name.split(' - ');
    let ret: { artist: string, title: string } = {
        artist: websitename,
        title: name,
    }
    if (split.length == 2) {
        ret.artist = split[0]
        ret.title = split[1]
    }

    // @ts-ignore
    if (dirnode.getSetting('artist')) ret.artist = dirnode.getSetting('artist')
    // @ts-ignore
    if (dirnode.getSetting('title')) ret.title = dirnode.getSetting('title')
    return ret;
}