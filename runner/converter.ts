import fs from "fs";
import fsp from "fs/promises";
import {
  assetsname,
  enginedir,
  enginename,
  homename,
  deployFolder,
  thumbnailsfoldername,
  userdirsPath,
  usersOutputDir,
} from "./consts";
import { DirNode, DirTree } from "./dirnode";
import { loadEverything, mediatypes, templates } from "./loadtemplates";
import path from "path";
import { processpage } from "./themes/pageprocesser";
import { exec } from "child_process";

// excludes dotfiles!
async function syncThatShit(sourceDir: string, outputDir: string) {
  return new Promise((res, rej) => {
    // const destDir = outputDir + path.sep + assetsname + path.sep + homename;
    const destDir = outputDir;

    // The -a flag stands for "archive" mode (preserves permissions, ownership, timestamps, etc.)
    // The -u or --update flag tells rsync to skip any files that are newer in the destination than in the source.
    // The --delete flag ensures files removed from the source are also removed from the destination (optional).
    const rsyncCommand = `rsync -au --delete ${sourceDir} ${destDir}  --exclude=".*"`; // excludes dotfiles

    exec(rsyncCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        rej(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }).on("exit", res);
  });
}

async function compile(username: string) {
  // process.chdir(deployFolder)
  // if(fs.existsSync(outputDir))fs.rmSync(outputDir,{recursive:true}) /// longgg
  let outputDir = usersOutputDir + path.sep + username
  let assetsroot = userdirsPath + path.sep + username
  let thumbnailsfullfilepath = outputDir + path.sep + thumbnailsfoldername
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(thumbnailsfullfilepath, { recursive: true });
  fs.mkdirSync(outputDir + path.sep + assetsname, {
    recursive: true,
  });
  // fs.cpSync(assetsroot,outputDir + path.sep + assetsname + path.sep + homename,{recursive:true,preserveTimestamps:true}) /// longg
  console.log("syncing that shit");
  await syncThatShit(assetsroot + '/', outputDir + path.sep + assetsname);
  console.log("that shit sinked");

  // output engine
  // process.chdir(converterRunnerHome)
  await syncThatShit(enginedir + path.sep, outputDir + path.sep + enginename + '/');
  // process.chdir(projectHome)
  process.chdir(outputDir + path.sep + assetsname);
  let dir = fs.readdirSync(".", { recursive: true, withFileTypes: true });
  // process.chdir('../')

  console.log(dir)

  // process.chdir("..");
  // if(!fs.existsSync(homename)) fs.mkdirSync(homename)
  // process.chdir(outputDir)

  let dirtree = new DirTree(username);

  dir.forEach((ent) => dirtree.placedirent(ent));

  // calculate type from lowest level of tree, up;

  process.chdir(usersOutputDir + '/' + username)

  dirtree.rootnode.calculateMediatype();
  dirtree.rootnode.calculateTemplate();

  for (let child of [
    dirtree.rootnode,
    ...dirtree.rootnode.getAllNormalChildrenRecursive(),
  ]) {
    let replacablechild = child.getReplacableThis();
    let template = replacablechild.getTemplate();
    let outputHtml;
    try {
      process.chdir(usersOutputDir + '/' + username)

      outputHtml = await templates[template].convert(replacablechild);
    } catch (e) {
      console.error(e);
    }
    if (!outputHtml)
      outputHtml = templates["unknown-file"].convert(replacablechild); // if thing fails

    outputHtml = processpage(outputHtml, child);
    // outputHtml+='<br>template:'+template
    // outputHtml+='<br> mediatype:'+child.getMediatype()
    // outputHtml+='<br> mimetype: '+child.getMimetype()
    // outputHtml+='<br>'
    let path2 = child.getFullPathString();
    fs.mkdirSync("." + path.sep + path2, { recursive: true });
    fs.writeFileSync(
      "." + path.sep + path2 + path.sep + "index.html",
      outputHtml,
    );
  }
  // hypothetically should be done!
}


export async function run(username?) {
  await loadEverything();
  console.log("mediatypes and templates", mediatypes, templates);

  if (username) {
    await compile(username)
  } else {

    let users = fs.readdirSync(userdirsPath);
    for (let user of users) {
      await compile(user)
    }
  }

}
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
