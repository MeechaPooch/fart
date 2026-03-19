import { DirNode } from "../../runner/dirnode";
import mime from 'mime-types';

export default function detect(dirnode:DirNode):number {
    return dirnode.getMimetype() == 'text/markdown' ? 22 : 0
}   