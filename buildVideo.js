const Jimp = require("jimp");
const configFile = require("./config.json");
const videoshow = require('videoshow')

if (configFile.exit == 1) {
    console.log("Did not continue, exiting...")
    process.exit(1);
}

var imageCount = configFile.images;

async function topnumcheeses() {
    let image = await Jimp.read('background.png');

    let font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    image.print(font, 0, 0, {
        text: `Top ${imageCount} cheeses`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 320, 240)
    await image.writeAsync('./videoimgs/topcheeses.png');
}

topnumcheeses()

for (let i = 1; i < imageCount + 1; i++) {
    console.log("image " + i)

    async function numbernum() {
        let image = await Jimp.read('background.png');

        let font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        image.print(font, 0, 0, {
            text: `Number ${i}`,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, 320, 240)
        await image.writeAsync(`./videoimgs/cheese${i}.png`);
    }
    numbernum()
}

for (let i = 0; i < imageCount; i++) {
    console.log("resizing cheese " + i)

    async function resizeCheese() {
        let image = await Jimp.read(`./imgs/${i}.jpg`);
        image.resize(320,240)
        await image.writeAsync(`./imgs/${i}.jpg`);
    }
    resizeCheese()
}

