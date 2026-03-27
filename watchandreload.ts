import chokidar from 'chokidar'
import child from 'child_process'
import { converterProjectFolder, userdirsPath, usersOutputDir } from './runner/consts';

var watcher = chokidar.watch([
  // './templates', 
  // './REALSITE', 
  // './runner', 
  // './mediatypes'
  userdirsPath,
  converterProjectFolder
], { ignored: /^\./, persistent: true });

let prevprocess: child.ChildProcess | null = null
let listeneradded = false;
let starttime = Date.now()
regenerate()

watcher
  //   .on('add', function(path) {console.log('File', path, 'has been added');})
  //   .on('change', function(path) {console.log('File', path, 'has been changed');})
  //   .on('unlink', function(path) {console.log('File', path, 'has been removed');})
  //   .on('error', function(error) {console.error('Error happened', error);})
  .on('all', (e) => {
    if(Date.now()-starttime<1000*10) return;
    // should restart
    console.log(e)
    prevprocess?.kill()
    regenerate();

    // // wait for previous process to end and then restart
    // // add ONE listener only. if listener already added, exit.
    // if (!prevprocess) {
    //   console.log('no prev process')
    //   prevprocess = regenerate()
    // } else if (!listeneradded) {
    //   console.log('no listener added')
    //   prevprocess?.on('exit', async () => {
    //     regenerate()
    //     console.log('STARTING NODE PROCESS')

    //     listeneradded = false;
    //   })
    //   listeneradded = true
    // } else {
    //   console.log('prev process and listener already added')
    // }
  })

function regenerate() {
  console.log('STARTING NODE PROCESS')

  prevprocess = child.exec('tsx runner/index.ts');
  prevprocess.on('exit', () => {
    console.log('complete')
    // listeneradded = false
    prevprocess = null;
  })
  return prevprocess
}