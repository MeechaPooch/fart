import convert from "./convert";
import fs from 'fs'

let html = convert('./example')
fs.writeFileSync('index.html',html)