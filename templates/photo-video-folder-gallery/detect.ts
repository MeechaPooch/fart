import { DirNode } from "../../runner/dirnode";


export default function detect(dirnode: DirNode): number  {
    return dirnode.getMediatype()=='gallery' ? 4 : 0
}

// export default function detect(dirnode: DirNode): number | false {
//     // let types = dirnode.getChildMimegroupsInclDir()
//     // let nodir = !types.directory
//     let allowedtypes = [/image\/.*/, /video\/.*/, /text\/.*/]
//     let containsnonmatch = false;
//     for (let child of dirnode.getChildren()) {
//         let type = (child as DirNode).getMimetypeInclDir()
//         let isnomatch = !allowedtypes.map(t => t.test(type)).includes(true)
//         if (isnomatch) containsnonmatch = true;
//     }
//     let detected = !dirnode.isfile && !containsnonmatch

//     return detected ? 5 : false;

//     // if file is made out of images and pictures
//     // and there are not any files out of the ordinary

// }

