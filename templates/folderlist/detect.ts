import { DirNode } from "../../runner/dirnode";

export default function detect(dirnode: DirNode): number {
    let children = dirnode.getNormalChildren();
    let numFiles = children.filter(child => child.isfile).length
    let numFolders = children.length - numFiles;

    return !dirnode.isfile && numFiles >= numFolders ? 2 : 0
}