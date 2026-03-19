import { DirNode } from "../../runner/dirnode";

export default function detect(dirnode:DirNode):number {
    return dirnode.getMediatype()=='html' ? 2 : 0
}