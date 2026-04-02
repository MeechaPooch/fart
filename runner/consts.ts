//post chdir

import path from "path"

// export let homedir = './home'

// absolute
export let deployFolder = '/home/ubuntu/project/swampish'
export let converterProjectFolder = deployFolder + '/converter'

export let enginedir = converterProjectFolder + '/ENGINE'
export let templatesdirpath = converterProjectFolder + '/templates'
export let mediatypesdirpath = converterProjectFolder + '/mediatypes'


export let usersOutputDir = deployFolder + '/webroot/users'
export let userdirsPath = '/pub/users'
export let defaultUsersPath = deployFolder + '/database/users'
// export let userdirsPath = deployFolder + '/database/users'
export let webOutputDir = deployFolder + '/webroot'
export let userSecretsPath = deployFolder + '/database/usersecrets'

// secrets words
export let passwordfilename = 'passwordhash.txt'
export let usernamefilename = 'username.txt'


// FILES AND FOLDERS RELATIVE TO USER FOLDER

export let assetsname = '.assets'
export let cachefoldername = '.cache'
export let enginename = '.engine'

export let randomstring = 'sd89sdKK9832Kj'
// export let randomstring = Math.random().toString(36).slice(2)

// pre chdir


// WEB CONSTANTS
export let webprefix = '/'
export let enginewebpath = '/'+enginename
export let enginepath = webprefix + enginename

export let homename = ''


export let settingsFileName = 'settings.txt'

export let indexfiles = [
    'index.html',
    'index.md',
    'index.txt',
]
export let specialfiles = [
    'note.txt',
    'note.md',
    'meta.txt',
    settingsFileName,
    ...indexfiles
]
// index.* anything goes??? will just display that as if it were the file/folder??? Epic!!!