import { DirNode } from "../../runner/dirnode";

// is an album if it is just music files and optionally one image file 
// minus the special files. Use a module that tags special files 
// special files: meta.txt (key=value),  
// must be audio
const allowed = ['audios']
// only 1 or more audio files and one image file
export default function detect(dirnode: DirNode): number {
   return dirnode.isfile ? -99 : 0;
}