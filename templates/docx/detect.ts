import { DirNode } from "../../runner/dirnode";

export default function detect(dirnode: DirNode): number {
    return dirnode.getMimetype() == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        dirnode.getMimetype() == 'application/vnd.oasis.opendocument.text'
        ? 3 : 0
}