// todo: thumbnail videos
import crypto from 'crypto'
import fs from 'fs'
import path from 'path';
import { DirNode } from '../../runner/dirnode';
import { randomstring, thumbnailsfullfilepath, thumbnailsfoldername, webprefix, thumbnailswebpath } from '../../runner/consts';
import sharp from 'sharp';
let template = fs.readFileSync(__dirname + path.sep + './template.html').toString()
let stylesheet = fs.readFileSync(__dirname + path.sep + './style.css').toString()
stylesheet = `<style>\n${stylesheet}\n</style>\n`;
const entrytemplate = fs.readFileSync(__dirname + path.sep + './elements/photo.html').toString();
import ffmpeg from 'fluent-ffmpeg'
import { getFileHashSync } from '../../runner/utils';
// create thumbnail file in assets folder

function createentryhtml(dirnode: DirNode, thumbnailwidth?: number): string {
    let defaultwidth = 200;
    let thumbnailfilename: string = 'none';
    generatethumbnail: if (dirnode.getMediatype() == 'image') {
        // thumbnail image
        // todo: come back to thumbnailer
        try {
            thumbnailfilename = getFileHashSync(dirnode.getFilePath()) + '.png'
            let thumbnailfilepath = thumbnailsfullfilepath + '/' + thumbnailfilename;
            // let thumbnailfilepath = dirnode.getParent()?.getFilePath() + '/' + thumbnailfilename;

            /// 🚨🚨🚨🚨🚨
            if (fs.existsSync(thumbnailfilepath)) {
                // console.log('skipping thumbnailing', thumbnailfilename)
                break generatethumbnail;
            }

            console.log('thumbnailing image', dirnode.getName())

            sharp(dirnode.getFilePath()).resize(thumbnailwidth ?? defaultwidth).toFile(thumbnailfilepath).catch(e => console.log(e)).finally(() => { console.log('finished thumbnailing', thumbnailfilename) })


        } catch (e) {
            console.log(e)
        }
    } else if (dirnode.getMediatype() == 'video') {
        // thumbnail video
        thumbnailfilename = getFileHashSync(dirnode.getFilePath()) + '.png'

        let thumbnailfilepath = thumbnailsfullfilepath + '/' + thumbnailfilename;

        /// 🚨🚨🚨🚨🚨
        if (fs.existsSync(thumbnailfilepath)) {
            // console.log('skipping thumbnailing', thumbnailfilepath)
            break generatethumbnail;
        }

        console.log('thumbnailing video',dirnode.getFilePath())
        ffmpeg(dirnode.getFilePath()).seekInput(0).frames(1).output(thumbnailfilepath + '-temp.jpeg')
            .on('error', console.log).on('end', () => {
                console.log('image finished processing')
                sharp(thumbnailfilepath + '-temp.jpeg').resize(thumbnailwidth).toFile(thumbnailfilepath).then(() => {
                    if (fs.existsSync(thumbnailfilepath + '-temp.jpeg')) fs.rmSync(thumbnailfilepath + '-temp.jpeg')
                    console.log('finished thumbnailing', thumbnailfilename)
                })
            }).run()

    }


    // with 30 items: 160 (this should be minimum)
    // with 10 items: 400 (this should be minimum)
    return entrytemplate
        .replaceAll('$thumbnailurl', `${thumbnailswebpath}/${thumbnailfilename}`)
        // .replaceAll('$thumbnailurl', `${dirnode.getParent()?.getAssetWebUrl()}/${thumbnailfilename}`) // old pre-thumbnail folder
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