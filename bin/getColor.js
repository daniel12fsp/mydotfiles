const vibrant = require('node-vibrant')
vibrant.from('/home/dfsp/.wallpaper1.jpg').getPalette((err, palette) => console.log(palette))