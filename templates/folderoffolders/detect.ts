import { DirNode } from "../../runner/dirnode";

export default function detect(dirnode: DirNode): number {
    let children = dirnode.getNormalChildren();

    // if all of children are unknown-directory mediatype

    let numchildren = children.length;
    // let numchildrenDirectories = children.filter(d=>d.getMediatype() == 'unknown-directory').length
    let numchildrenDirectories = children.filter(d=>(d.getTemplate().startsWith('folder'))).length

    // let numFiles = children.filter(child => child.isfile).length
    // let numFolders = children.length - numFiles;

    return !dirnode.isfile && numchildren==numchildrenDirectories ? 3 : 0;
}