import { DirNode } from "../../runner/dirnode";

// is an album if it is just music files and optionally one image file 
// minus the special files. Use a module that tags special files 
// special files: meta.txt (key=value),  
// must be audio
const allowed = ['audios']
// only 1 or more audio files and one image file
export default function detect(dirnode: DirNode): number {
    let children = dirnode.getNormalChildrenMediatypeCount();
    let bool = true
        && children['album']?.length >= 1
        && (children['ALL'].length - children['album'].length) == 0 // only albums
    return bool ? 2 : 0
}