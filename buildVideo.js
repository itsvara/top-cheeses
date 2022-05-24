const Jimp = require("jimp");
const configFile = require("./config.json");
const videoshow = require('videoshow');
const { create } = require("jimp");

if (configFile.exit == 1) {
    console.log("Did not continue, exiting...")
    process.exit(1);
}

var imageCount = configFile.images;

async function createImage(text, fileName) {
    let image = await Jimp.read('background.png');

    let font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    image.print(font, 0, 0, {
        text: `${text}`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 320, 240)
    await image.writeAsync('./videoimgs/' + fileName + '.png');
}

//Create top cheeses screen
createImage(`Top ${imageCount} cheeses`, 'topcheeses')

// Create thanks for watching screen
createImage('thanks for watching', 'thanksforwatching')

//Create number {i} screen for every cheese image
var imageCount1 = imageCount + 1

for (let i = 1; i < imageCount + 1; i++) {
    console.log("image " + i)

    createImage(`Number ${i}`, `cheese${imageCount1-i}`)
}

//Resize cheese images to fit in the video
//Videoshow only allows images of the same size
for (let i = 0; i < imageCount; i++) {
    console.log("resizing cheese " + i)

    async function resizeCheese() {
        let image = await Jimp.read(`./imgs/${i}.png`);
        image.resize(320, 240)
        await image.writeAsync(`./imgs/${i}.png`);
    }
    resizeCheese()
}

var imgspath = './imgs/'

var videoimgspath = '.\\videoimgs\\'

var images = []

images.push('./videoimgs/topcheeses.png')

//Add all cheese images to an array to be added to the video
for (let i = 0; i < imageCount; i++) {
    console.log(`adding number ${i+1}`)
    images.push(`./videoimgs/cheese${i+1}.png`)

    console.log(`adding cheese ${i}`)
    images.push(imgspath + i + '.png')

}

images.push('./videoimgs/thanksforwatching.png')

//console.log(images)

var videoOptions = {
    fps: 20,
    loop: 1, // seconds
    transition: false,
    videoBitrate: 32,
    videoCodec: 'libx264',
    size: '320x240',
    audioBitrate: '32k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
}

videoshow(images, videoOptions)
    .audio('./audio/1.mp3')
    .save('output.mp4')
    .on('start', function (command) {
        console.log('ffmpeg process started:', command)
    })
    .on('error', function (err, stdout, stderr) {
        console.error('Error:', err)
        console.error('ffmpeg stderr:', stderr)
    })
    .on('end', function (output) {
        console.error('Video created in:', output)
    })