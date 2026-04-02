import { DirNode } from "../../runner/dirnode";
import { convertDocxToHtml } from "./ai-using-mammoth";
import convert from "../unknown-file/convert";
import fs from 'fs'
import fsp from 'fs/promises'
import cp from 'child_process'
import { cachefoldername, randomstring } from "../../runner/consts";
// import {parse as parsehtml} from 'parse5'
import { parse as parsehtml2 } from 'node-html-better-parser';



let js = fs.readFileSync(__dirname + '/script.js')
let style_soffice = fs.readFileSync(__dirname + '/style-soffice.css')


export default async function convertt(dirnode: DirNode): Promise<string | undefined> {
    try {

        console.log('converting', dirnode.getAssetPath())
        let cacheoutdir = dirnode.getMyTree().getCacheFilePath() + '/' + dirnode.getFileHash();
        console.log('cwd', process.cwd())
        // new main

        if (!fs.existsSync(cacheoutdir)) {
            try {
                await new Promise((resolve, error) => {
                    cp.exec(`soffice --headless --norestore --nologo --convert-to html --outdir "${cacheoutdir}" "${dirnode.getAssetPath()}"`).on('message', (m) => {
                        console.log('soffice:', m)
                    })
                        .on('exit', resolve)
                        .on('error', error)
                })
            } catch (e) {
                console.log("CONVERT ERROR",e)
            }
        }

        if(!fs.existsSync(cacheoutdir)) {
            throw 'document convert failed for document ' + dirnode.getAssetPath() 
        }

        // await fsp.cp(cacheoutdir, outdir,{recursive:true})


        // let htmlstring = fs.readFileSync(`${outdir}/${dirnode.getName().replace(/.docx$/,'.html')}`)
        let allfiles = fs.readdirSync(cacheoutdir)
        let htmlfilename = allfiles.filter(f => f.endsWith('.html'))[0]
        let htmlstring = fs.readFileSync(cacheoutdir + '/' + htmlfilename).toString();
        console.log('allfiles', allfiles)
        allfiles = allfiles.map(fn => encodeURIComponent(fn))
        console.log('allfiles2', allfiles)
        allfiles.forEach(fn => { htmlstring = htmlstring.replaceAll(fn, '/' + cachefoldername + '/' + dirnode.getFileHash() + '/' + fn) })

        let dom = parsehtml2(htmlstring)
        dom.querySelectorAll('[align="center"]').forEach(e => {
            e.setAttribute('style', e.getAttribute('style') + ';text-align:center;')
        })
        htmlstring = dom.toString()


        htmlstring = `
    <style>
    ${style_soffice}
    </style>
    <div class="documentpage">
    ${htmlstring}
    </div>
    `

        return htmlstring;
    } catch (e) {
        console.error('document convert error', e)

        if (dirnode.getMimetype() == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            let thing = await convertDocxToHtml(dirnode.getAssetPath())
            if (!thing) return undefined;
            return thing +
                `<script>${js}</script>
    `;
        }
        return undefined;

    }
    // fallback
    // return res ?? convert(dirnode) // move this logic in to main generator
}