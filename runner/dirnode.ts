import fs from "fs";
import { Dirent } from "fs";
import path from 'path';
import { mediatypes, templates } from './loadtemplates';
import detect from '../templates/photo-video-folder-gallery/detect';
import mime from 'mime-types'
import { assetsname, homename, outputDir, webprefix, specialfiles, indexfiles, enginepath } from "./consts";
import { neutername } from "./themes/pageprocesser";

export class DirTree {

    rootnode = new DirNode(homename, null)

    constructor() {

    }

    placedirent(dirent: Dirent) {
        // if(dirent.parentPath=='.') dirent.parentPath = null
        this.rootnode.placedirent(dirent)
    }

}

export class DirNode {

    children: any = {}; // type string to dirnode
    parent: DirNode | null;
    name: string;
    file = undefined;
    isfile = false;
    mimetype: string | undefined | false;
    mediatype: string | undefined;
    template: string | undefined;
    path: DirNode[]; //includes self
    isspecial: boolean = false;

    constructor(name: string, parent: DirNode | null, isfile?: boolean) {

        this.name = name;
        this.parent = parent;
        this.path = [...parent?.path ?? [], this]
        this.isfile = !!isfile;

        if (specialfiles.includes(name)) {
            this.isspecial = true;
        }
    }
    public getIsSpecial() {
        return specialfiles.includes(this.name)
            || this.getName().startsWith('.')
    }
    public getNormalChildren() {
        return this.getChildren().filter(k => !k.getIsSpecial())
    }
    public getNormalChildrenMediatypeCount() {
        let children = this.getNormalChildren();
        let types: any = { ALL: [] }
        Object.entries(mediatypes).forEach(m => types[m[0]] = [])
        children.forEach(child => {
            let childtype = child.getMediatype()
            if (!(childtype in types)) types[childtype] = [];
            types[childtype].push(child)
            types.ALL.push(child)
        })
        return types;
    }




    calculateMimetype() {
        if (this.isfile) {
            this.mimetype = mime.lookup(this.name)
        } else {
            // this.mimetype = 'folder'
        }
    }

    public getIsRoot() {
        return !this.getParent()
    }

    public getSettingsDirnode() {
        let settings = this.getChildren().filter(e=>e.getName()=='settings.txt')[0]
        return settings;
    }
    public getSettings():any {
        return {}
    }
    public getSetting(settingName:string):string|null|undefined {
        return this.getSettings()[settingName];
    }

    // replace with thumbnailer service
    public getIconHtml() {
        return (templates[this.getTemplate()]?.icon) ?? (mediatypes[this.getMediatype()]?.icon) ?? ''
    }

    public generateIconHtml() {
        let imageUrl = this.getAllNormalChildrenRecursive().filter(child => child.getMediatype() == 'image')[0]?.getAssetWebUrl();
        if (imageUrl) {
            return `<img loading="lazy" src="${imageUrl}"/>`
        } else {
            return `<span class="entryicon">${this.getIconHtml()}</span>`
        }
    }
    // for now just return whatever image there is, but later, create a thumbnailing system
    public getThumbnailImageUrl() {
        return
    }

    //return either an image or an element
    public getThumbnailElement() {

    }


    addchild() {

    }

    hasChild(dirnode: DirNode): boolean {
        return dirnode.getPath().includes(this)
    }

    getNote() {
        return "" + (this.children['note.txt']?.readSync() ?? '') + '\n' + (this.children['note.md']?.readSync() ?? '')
    }

    getAssetWebUrl() {
        return webprefix + '/assets/' + this.getFullPathString()
    }
    getWebUrl() {
        return `${webprefix}/${this.getFullPathString()}`
    }

    // file operations
    getFilePath() {
        return `${outputDir}/${assetsname}/${this.getFullPathString()}`
    }
    public statSync() {
        return fs.statSync(this.getFilePath())
    }
    public readSync() {
        return fs.readFileSync(this.getFilePath()).toString()
    }

    public getChildTemplates() {
        let output: any = {};
        Object.entries(this.children).forEach(e => {
            let template = (e[1] as DirNode).getTemplate() ?? 'null'
            if (!(template in output)) {
                output[template] = []
            }
            output[template].push(e[1])
        })
        return output
    }

    public getChildMimegroupsInclDir() {
        let output: any = {};
        Object.entries(this.children).forEach(e => {
            let mimetype = (e[1] as DirNode).getMimetype()
            if (mimetype) mimetype = mimetype.split('/')[0]
            let isdir = !(e[1] as DirNode).isfile;
            if (!mimetype) mimetype = (e[1] as DirNode).name.split('.').at(-1) ?? 'whoknows'
            let ultimateType = isdir ? 'directory' : mimetype

            if (!(ultimateType in output)) {
                output[ultimateType] = []
            }
            output[ultimateType].push(e[1])
        })
        return output
    }

    getReplacableThis() {
        // look for children that match the index criteria
        // index criteria: are in the indexfiles list

        // todo order by 
        let indexfile = this.getChildren().filter(child => indexfiles.includes(child.getName())).sort((a, b) => {
            return indexfiles.indexOf(b.getName()) - indexfiles.indexOf(a.getName())
        }).at(-1)

        // then return either myself or that file that matches the criteria.
        return indexfile ?? this

    }

    public getChildMimetypesInclDir() {
        let output: any = {};
        Object.entries(this.children).forEach(e => {
            let mimetype = (e[1] as DirNode).getMimetype()
            let isdir = !(e[1] as DirNode).isfile;
            if (!mimetype) mimetype = (e[1] as DirNode).name.split('.').at(-1) ?? 'whoknows'
            let ultimateType = isdir ? 'directory' : mimetype

            if (!(ultimateType in output)) {
                output[ultimateType] = []
            }
            output[ultimateType].push(e[1])
        })
        return output
    }

    public getMimetypeInclDir(): string {
        if (!this.mimetype) this.mimetype = ''
        return this.isfile ? this.mimetype : 'directory'
    }

    public getChildren(): DirNode[] {
        return Object.values(this.children);
    }
    public getAllChildrenRecursive(depth?: number): DirNode[] {
        if (depth === 0) return [];
        return [...this.getChildren(), ...this.getChildren().flatMap(c => c.getAllChildrenRecursive.apply(c, [depth ? depth - 1 : undefined]))];
    }
    getNormalChildrenMediatype(mediatype: string) {
        return this.getNormalChildren().filter(c => c.getMediatype() == mediatype)
    }
    public getSiblings(): DirNode[] {
        return this.parent?.getNormalChildren() ?? [];
    }
    public getSiblingIndex() {
        return this.getSiblings().indexOf(this)
    }
    getParent() {
        return this.parent
    }
    public getRoot(): DirNode {
        // traverse up the tree
        let parent: DirNode = this;
        while (parent.getParent()) parent = parent.getParent() ?? parent
        return parent;
    }


    // each dirnode should know its full path, its file name, its file type, if it is a directory, 


    placedirent(dirent: Dirent) {
        this.placepathlist([...dirent.parentPath.split('/').filter(e => e != '.'), dirent.name], !dirent.isDirectory())
    }
    placepathlist(path: string[], isleaffile: boolean) {

        if (path.length == 0) return; // exit logic

        let firstPath = path[0]
        let restofpath = path.slice(1)


        let placingleaf = !restofpath.length;

        // create new node if does not exist
        if (!(firstPath in this.children)) {
            this.children[firstPath] = new DirNode(firstPath, this, placingleaf && isleaffile);
        }

        let newnode = this.children[firstPath];
        newnode.placepathlist(restofpath, isleaffile)

    }

    public getPath() {
        return this.path;
    }
    public getPathStrings() {
        return this.getPath().map(e => e.getName()).filter(e => e != '')
    }
    public collectFullPath() {
        let path = [];
        let parented: DirNode | null = this;
        while (parented) {
            path.push(parented)
            parented = parented.parent;
        }
        path.reverse();
        // let path = path.map(p => p.name)
        return path;
    }
    public getFullPathString(): string {
        return this.getPath().map(node => node.getName()).join('/')
    }

    public getName() {
        return this.name
    }
    public getDisplayName() {
        let name = this.chopIndexFromName()
        name = neutername(name)
        return name;
    }
    public chopIndexFromName() {
        let sibs = this.getSiblings()
        if(sibs.length == sibs.filter(s=>s.getName().match(/^[0-9]+/)).length) {
            let processedName = this.getName().replace(/^\d+/,'')
            if(processedName!='') return processedName
            else return this.getName()
        } else {return this.getName()}
    }
    public getNameNeutered() {
        return neutername(this.getName())
    }
    public getMimetype() {
        if (!this.mimetype) this.calculateMimetype()
        return this.mimetype;
    }
    public getTemplate() {
        return this.template ?? this.calculateTemplate();
    }
    public renderTemplate() {
        return templates[this.getTemplate()].convert(this)
    }
    calculateTemplate() {
        // @ts-ignore
        let templateresults = Object.entries(templates).map((template: [string, template]) => {
            return {
                templatename: template[0],
                result: template[1].detect(this)
            }
        })
        templateresults = templateresults.filter(t => t.result)
        // sort from lowest to highest
        templateresults.sort((a, b) => a.result - b.result);

        this.template = templateresults.at(-1)?.templatename;
        return this.template ?? 'unknown';
    }

    calculateMediatype() {
        // @ts-ignore
        let mtresults = Object.entries(mediatypes).map((mediatype: [string, template]) => {
            return {
                mtname: mediatype[0],
                result: mediatype[1].detect(this)
            }
        })
        mtresults = mtresults.filter(t => t.result)
        // sort from lowest to highest
        mtresults.sort((a, b) => a.result - b.result);
        this.mediatype = mtresults.at(-1)?.mtname;
        return this.template;
    }
    public getMediatype() {
        if (!this.mediatype) {
            this.calculateMediatype();
        }
        return this.mediatype ?? 'unknown';
    }

    public getAllNormalChildrenRecursive(depth?: number) {
        return this.getAllChildrenRecursive(depth).filter(child => !child.getIsSpecial())
    }
}
