import { DirNode } from "../../runner/dirnode";

export default function detect(boy:DirNode):number {
    return (!boy.isfile) ? -99 : 0
}