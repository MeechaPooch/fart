import fs from 'fs'
const template=fs.readFileSync('./template.html').toString()

export function convert(inputfilepath:string):string {
    let inputfiletext = fs.readFileSync(inputfilepath).toString()
    let split = inputfiletext.split('\n')
    let title = split[0]
    let abody = split.slice(1,-1).join('\n')
    let publishdate = new Date(fs.statSync(inputfilepath).mtime).toLocaleDateString()
    let author = 'Avalon' //todo replace
    let output = template
        .replaceAll('$title',title)
        .replaceAll('$content',abody)
        .replaceAll('$author',author)
        .replaceAll('$publish_date',publishdate)
    return output;
}