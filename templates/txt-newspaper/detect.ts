import { DirNode } from "../../runner/dirnode";
import mime from 'mime-types';

export default function detect(dirnode:DirNode):number {
    console.log('bussin!!!')
    if(dirnode.getMediatype() == 'document') console.log("I FOUND ONE!",dirnode.name)
    return dirnode.getMediatype() == 'document' ? 20 : 0
}