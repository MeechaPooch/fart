import { convert } from "./convert";
import fs from 'fs'

let html = convert('./testfile.txt')
fs.writeFileSync('index.html',html)