import { DirNode } from "../../runner/dirnode";

export default function convert(dirnode:DirNode):string {
    return dirnode.readSync()
}