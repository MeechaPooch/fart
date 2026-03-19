import { DirNode } from "../../runner/dirnode";

export default function detect(boi:DirNode):number {
    return boi.isfile ? -99 : 0
}