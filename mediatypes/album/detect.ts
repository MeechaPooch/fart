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
        && children['audio']?.length >= 1
        && children['image']?.length <= 3
        && (children['ALL'].length - children['audio'].length - children['image'].length) == 0  
    return bool ? 3 : 0
}