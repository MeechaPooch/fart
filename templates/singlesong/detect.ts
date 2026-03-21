import { DirNode } from "../../runner/dirnode";

export default function detect(dirnode:DirNode):number {
    return dirnode.getMediatype() == 'audio' ? 5 : 0
}   