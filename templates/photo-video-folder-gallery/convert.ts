// todo: thumbnail videos
import crypto from 'crypto'
import fs from 'fs'
import path from 'path';
import { DirNode } from '../../runner/dirnode';
import { randomstring, webprefix } from '../../runner/consts';
import sharp from 'sharp';
let template = fs.readFileSync(__dirname + path.sep + './template.html').toString()
let stylesheet = fs.readFileSync(__dirname + path.sep + './style.css').toString()
stylesheet = `<style>\n${stylesheet}\n</style>\n`;
const entrytemplate = fs.readFileSync(__dirname + path.sep + './elements/photo.html').toString();
import ffmpeg from 'fluent-ffmpeg'
// create thumbnail file in assets folder

function createentryhtml(dirnode: DirNode, thumbnailwidth?: number): string {
    let defaultwidth = 200;
    let thumbnailfilename: string = 'none';
    if (dirnode.getMediatype() == 'image') {
        // thumbnail image
        console.log('thumbnailing image', dirnode.getName())
        // todo: come back to thumbnailer
        try {
            thumbnailfilename = dirnode.getName() + "-thumbnail" + randomstring + '.png'
            sharp(dirnode.getFilePath()).resize(thumbnailwidth ?? defaultwidth).toFile(dirnode.getParent()?.getFilePath() + '/' + thumbnailfilename).catch(e => console.log(e))
        } catch (e) {
            console.log(e)
        }
    } else if (dirnode.getMediatype() == 'video') {
        // thumbnail video
        thumbnailfilename = crypto.hash('sha256', dirnode.getName()) + '.png';
        let thumbnailfilepath = dirnode.getParent()?.getFilePath() + '/' + thumbnailfilename;
        ffmpeg(dirnode.getFilePath()).seekInput(0).frames(1).output(dirnode.getParent()?.getFilePath() + '/' +thumbnailfilename + '-temp.jpeg')
        .on('error', console.log).on('end', () => {
            console.log('image finished processing')
            sharp(thumbnailfilepath + '-temp.jpeg').resize(thumbnailwidth).toFile(thumbnailfilepath).then(() => {
                if (fs.existsSync(thumbnailfilepath + '-temp.jpeg')) fs.rmSync(thumbnailfilepath + '-temp.jpeg')
            })
        }).run()

    }
    // with 30 items: 160 (this should be minimum)
    // with 10 items: 400 (this should be minimum)
    return entrytemplate
        .replaceAll('$thumbnailurl', `${dirnode.getParent()?.getAssetWebUrl()}/${thumbnailfilename}`)
        // .replaceAll('$thumbnailurl', `${webprefix}/assets/${dirnode.getFullPathString()}-thumbnail${randomstring}.png`)
        // .replaceAll('$thumbnailurl', `${webprefix}/assets/${dirnode.getFullPathString()}`)
        .replaceAll('$relativepath', dirnode.name)
        .replaceAll('$gallerytypeicon', dirnode.getMediatype() == 'video' ? '▶︎' : '')

}

export default function convert(dirnode: DirNode): string {
    let children = dirnode.getChildren();

    let max = 400;
    let min = 160;
    let thumbnailwidth = Math.max(Math.min(500 - (dirnode.getChildren().length * 20), max), min)

    // TODO filter out all non images
    // inputdirprocessed = inputdir.filter();
    let entries = children.map(dn => createentryhtml(dn, thumbnailwidth))
    let entriesstring = entries.join('\n')
    let output = template
        .replaceAll('$entries', entriesstring)

    output = stylesheet
        .replaceAll('$calculatedwidth',
            thumbnailwidth.toString()
        )
        + output
    return output;
}