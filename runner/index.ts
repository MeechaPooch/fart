import fs from 'fs'
import fsp from 'fs/promises'
import { assetsname, assetsroot, enginedir, enginename, homename, outputDir } from './consts'
import { DirNode, DirTree } from './dirnode'
import { loadEverything, mediatypes, templates } from './loadtemplates'
import path from 'path'
import { processpage } from './themes/pageprocesser'
import {exec} from 'child_process'

async function syncThatShit() {
    return new Promise((res,rej)=>{

const sourceDir = assetsroot + '/'; // Trailing slash is important for rsync behavior
const destDir = outputDir + path.sep + assetsname + path.sep + homename;

// The -a flag stands for "archive" mode (preserves permissions, ownership, timestamps, etc.)
// The -u or --update flag tells rsync to skip any files that are newer in the destination than in the source.
// The --delete flag ensures files removed from the source are also removed from the destination (optional).
const rsyncCommand = `rsync -au --delete ${sourceDir} ${destDir}`;

exec(rsyncCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        rej(error)
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
}).on('exit',res);
    
})
}

async function compile() {
    // if(fs.existsSync(outputDir))fs.rmSync(outputDir,{recursive:true}) /// longgg
    fs.mkdirSync(outputDir ,{recursive:true})
    fs.mkdirSync(outputDir +path.sep + assetsname + path.sep + homename,{recursive:true})
    // fs.cpSync(assetsroot,outputDir + path.sep + assetsname + path.sep + homename,{recursive:true,preserveTimestamps:true}) /// longg
    console.log('syncing that shit')
    await syncThatShit();
    console.log('that shit sinked')
    
    fs.cpSync(enginedir,outputDir + path.sep + enginename,{recursive:true})
    process.chdir(outputDir + path.sep + assetsname + path.sep + homename)
    let dir = fs.readdirSync('.',{recursive:true,withFileTypes:true})
    // process.chdir('../')
    process.chdir('../..')

    // if(!fs.existsSync(homename)) fs.mkdirSync(homename)
    // process.chdir(homename)


    let dirtree = new DirTree();

    dir.forEach(ent=>dirtree.placedirent(ent))
    
    // calculate type from lowest level of tree, up;

    dirtree.rootnode.calculateMediatype();
    dirtree.rootnode.calculateTemplate();

    for (let child of [dirtree.rootnode,...dirtree.rootnode.getAllNormalChildrenRecursive()]) {
        let replacablechild = child.getReplacableThis();
        let template = replacablechild.getTemplate()
        let outputHtml;
        try {outputHtml = await templates[template].convert(replacablechild)}
        catch(e) {console.error(e)}
        if(!outputHtml) outputHtml = templates['unknown-file'].convert(replacablechild) // if thing fails

        outputHtml = processpage(outputHtml,child)
        // outputHtml+='<br>template:'+template
        // outputHtml+='<br> mediatype:'+child.getMediatype()
        // outputHtml+='<br> mimetype: '+child.getMimetype()
        // outputHtml+='<br>'
        let path2 = child.getFullPathString()
        fs.mkdirSync('.' + path.sep +path2,{recursive:true})
        fs.writeFileSync('.' + path.sep +path2+path.sep+'index.html',outputHtml)
    }
    // hypothetically should be done!

}

async function run() {
    await loadEverything();
    console.log('mediatypes and templates',mediatypes,templates)
    await compile()
}
run()



// function calculateFromGroundUp(rootnode:DirNode) {
//     let all = rootnode.getChildrenRecursive();
//     let depths:any = {}
//     all.forEach(n=>{
//         let depth = n.getPath().length;
//         if(!(depth in depths)) {
//             depths[depth] = []
//         }
//         depths[depth].push(n)
//     })

    
// }

