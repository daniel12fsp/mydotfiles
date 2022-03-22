// # 0 8,12,23 * * *  /home/infra/me/mydotfiles/bin/wallpaper.js

const https = require('https');
const fs = require('fs');
const execSync = require('child_process').execSync;
const output = execSync(`amixer -c 0`).toString().trim().split("\n")
function parseAmixer(output) {
   const result = {}
   let lastKey;
   output.forEach(line => {
        if(line[0]!==" ") {
            const startIndex = line.indexOf("'")+1
            const endIndex = line.indexOf(",")-1

            lastKey=line.slice(startIndex,endIndex)
            result[lastKey]={}
        } else {
            const [key, value] = line.split(":")
            result[lastKey][key.trim()]=value.trim()
        }
   })
   return result
}


const mic = parseAmixer(output)
const rawValue = mic['Headset Mic Boost']['Front Left']
const value = (/(\d*)%/).exec(rawValue)[0]
console.log(value)
