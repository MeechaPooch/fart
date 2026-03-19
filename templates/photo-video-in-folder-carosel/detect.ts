import { DirNode } from "../../runner/dirnode";

export default function detect(dirnode: DirNode): number {
    if(dirnode.name=='siberianbeardog_1693244379_3179486763462395005_6638884613.jpg') console.log('chungus',dirnode)
    return (dirnode.getMediatype() == 'image' || dirnode.getMediatype() == 'video') ? 4 : 0 //todo: logic to determine if it is in a folder 
}