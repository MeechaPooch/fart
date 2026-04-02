import { DirNode } from "../../runner/dirnode";
import { convertDocxToHtml } from "./ai-using-mammoth";
import convert from "../unknown-file/convert";
import fs from 'fs'
import cp from 'child_process'
import { randomstring } from "../../runner/consts";
// import {parse as parsehtml} from 'parse5'
import { parse as parsehtml2} from 'node-html-better-parser';



let js = fs.readFileSync(__dirname + '/script.js')
let style_soffice = fs.readFileSync(__dirname + '/style-soffice.css')


export default async function convertt(dirnode: DirNode): Promise<string | undefined> {
try{
    let outdir = dirnode.getAssetPath() + randomstring;
    // new main
    await new Promise((resolve, error) => {
        cp.exec(`soffice --headless --norestore --nologo --convert-to html --outdir "${outdir}" "${dirnode.getFilePath()}"`).on('message', (m) => {
            console.log('soffice:', m)
        })
        .on('exit', resolve)
        .on('error', error)
    })

    let allfiles = fs.readdirSync(outdir)
    let htmlfilename = allfiles.filter(f => f.endsWith('.html'))[0]
    let htmlstring = fs.readFileSync(outdir + '/' + htmlfilename).toString();
    console.log('allfiles',allfiles)
    allfiles = allfiles.map(fn => encodeURIComponent(fn))
    console.log('allfiles2',allfiles)
    allfiles.forEach(fn => {htmlstring=htmlstring.replaceAll(fn, dirnode.getAssetWebUrl() + randomstring + '/' + fn)})

    let dom = parsehtml2(htmlstring)
    dom.querySelectorAll('[align="center"]').forEach(e=>{
        e.setAttribute('style',e.getAttribute('style') + ';text-align:center;')
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
}catch(e) {
    return undefined;
}
    // fallback
    // return res ?? convert(dirnode) // move this logic in to main generator
}