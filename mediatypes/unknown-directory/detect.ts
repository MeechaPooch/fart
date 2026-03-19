import { DirNode } from "../../runner/dirnode";

export default function detect(dirnode: DirNode): number {
   return (!dirnode.isfile) ? -99 : 0;
}