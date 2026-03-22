//post chdir

import path from "path"

// export let homedir = './home'

export let projectHome = '/home/ubuntu/project/swampish'
export let usersOutputDir = './webroot/users'
export let userdirsPath = './users'

export let webOutputDir = './webroot'
export let webprefix = '/'

// static engine web path VS new web path generated per user <- do it this way for now
// export let engineDirName = 'engine'
// export let engineOutputDir = webOutputDir + path.sep + engineDirName;
// export let engineWebPath = 

// pre chdir
export let enginedir = './ENGINE'
export let assetsname = '.assets'
export let thumbnailsfoldername = '.thumbnails'


export let enginename = '.engineassets'
export let enginewebpath = '/'+enginename
export let homename = ''

export let enginepath = webprefix + enginename

export let randomstring = 'sd89sdKK9832Kj'
// export let randomstring = Math.random().toString(36).slice(2)

// pre chdir
export let templatesdirpath = '../templates'
export let mediatypesdirpath = '../mediatypes'

export let indexfiles = [
    'index.html',
    'index.md',
    'index.txt',
]
export let specialfiles = [
    'note.txt',
    'note.md',
    'meta.txt',
    ...indexfiles
]

// index.* anything goes??? will just display that as if it were the file/folder??? Epic!!!