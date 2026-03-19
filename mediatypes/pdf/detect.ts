import { DirNode } from "../../runner/dirnode";

export default function detect(dirnode:DirNode):number {
    return dirnode.getMimetype()=='application/pdf' ? 2 : 0
}