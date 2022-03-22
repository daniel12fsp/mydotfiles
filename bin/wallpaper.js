// # 0 8,12,23 * * *  /home/infra/me/mydotfiles/bin/wallpaper.js

const https = require('https');
const fs = require('fs');
const execSync = require('child_process').execSync;

const displays = ["eDP-1","eHDMI-1"]

function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
}

function downloadImage(url, ext) {
    return new Promise((resolve, reject) => https.get(url, resolve))
}

function getWallpaperStream() {
    return new Promise((resolve, reject) => https.get("https://www.reddit.com/r/earthporn.json?sort=new", resolve))
}

async function saveFile(stream, fileName) {
    return new Promise((resolve, reject) => {
        stream.pipe(fs.createWriteStream(fileName))
        stream.on('error', reject);
        stream.on('end', resolve);
    })
}

function isValidImage(i) {
    const data = i.data
    const {width, height} = data.preview.images[0].source
    return data.url_overridden_by_dest && width > height
}

async function main() {
    try {
        const wallpapersStream = await getWallpaperStream();
        const wallpapersRestResponse = JSON.parse(await streamToString(wallpapersStream))
        const wallpapers = wallpapersRestResponse.data.children.filter(isValidImage).slice(0,2).map(i => i.data.url_overridden_by_dest)
        const homePath = process.env.HOME

        const wallpaperPaths = wallpapers.map(async (wallpaper, i)=> {
            const wallpaperStream = await downloadImage(wallpaper)
            const extension = wallpaper.split(".").pop()
            const wallpaperFile = `${homePath}/.wallpaper${i}.${extension}`
            await saveFile(wallpaperStream, wallpaperFile)
            return wallpaperFile
        })

        const paths = await Promise.all(wallpaperPaths)
        paths.forEach( (wallpaperPath,i) => execSync(`swaymsg output "${displays[i]}" background ${wallpaperPath} fill`))

    } catch (error) {
        console.log(error)
    }
}

main()