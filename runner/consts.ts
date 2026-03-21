//post chdir
// export let homedir = './home'
export const websitename = "Powch Art"
export let outputDir = '/usr/share/nginx/html/micahpowch'
export let webprefix = '/micahpowch'

// pre chdir
export let assetsroot = './REALSITE/assetsroot'
export let enginedir = './REALSITE/engineassets'
export let assetsname = '.assets'
export let thumbnailsfoldername = '.thumbnails'
export let thumbnailsfullfilepath = outputDir + '/' + thumbnailsfoldername
export let thumbnailswebpath = webprefix + '/' + thumbnailsfoldername
export let enginename = '.engineassets'
export let enginewebpath = '/micahpowch/'+enginename
export let homename = ''

export let enginepath = webprefix + '/' + enginename

export let randomstring = 'sd89sdKK9832Kj'
// export let randomstring = Math.random().toString(36).slice(2)

// pre chdir
export let templatesdirpath = './templates'
export let mediatypesdirpath = './mediatypes'

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