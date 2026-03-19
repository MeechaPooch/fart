import { DirNode } from "../../runner/dirnode";

export default function detect(dirnode:DirNode):number {
    return dirnode.getMimetype()?.toString().startsWith('audio') ? 1 : 0;
}