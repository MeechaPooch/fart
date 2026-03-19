import fs from 'fs'
import { templatesdirpath, mediatypesdirpath } from './consts'
import path from 'path'
const templatesrootpath = '../templates'
const mediatypesrootpath = '../mediatypes'
export type template = {
    convert: Function, detect: Function
}

export let templates: any = {}
export let mediatypes: any = {}

export async function loadEverything() {
    await loadtemplates();
    await loadmediatypes();
    return true;
}

export async function loadtemplates() {
    let tsdir = fs.readdirSync(templatesdirpath)

    // let templates:any = {}

    for (let template of tsdir) {
        try {
            let importpath = templatesrootpath + path.sep + template + path.sep + 'convert.ts'
            let detectpath = templatesrootpath + path.sep + template + path.sep + 'detect.ts'
            // todo someday maybe never make it support png files! :) Automatically place asset on webhost and create img element
            let iconpath = __dirname + path.sep + templatesrootpath + path.sep + template + path.sep + 'icon.html'
            let convert = (await import(importpath)).default
            let detect = (await import(detectpath)).default
            let icon = null;
            if (fs.existsSync(iconpath)) icon = fs.readFileSync(iconpath).toString();

            templates[template] = { convert, detect, icon }
        } catch (e) { }
    }
}

export async function loadmediatypes() {
    let tsdir = fs.readdirSync(mediatypesdirpath)

    // let templates:any = {}

    for (let mediatype of tsdir) {
        try {
            let detectpath = mediatypesrootpath + path.sep + mediatype + path.sep + 'detect.ts'
            let iconpath = __dirname + path.sep + mediatypesrootpath + path.sep + mediatype + path.sep + 'icon.html'
            let detect = (await import(detectpath)).default
            let icon = null;
            if (fs.existsSync(iconpath)) icon = fs.readFileSync(iconpath).toString();


            mediatypes[mediatype] = { detect, icon }
        } catch (e) { }
    }
}