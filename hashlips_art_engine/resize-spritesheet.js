const { createCanvas, loadImage } = require("canvas")
const fs = require("fs");
const path = require("path")

async function resizeSpritesheet(imgPath) {
  const spriteHeight = 48
  const spriteWidth = 32
  const startY = 15
  const gapY = 16
  const numSpritesX = 24
  const numSpritesY = 3

  const rowWidth = spriteWidth * numSpritesX  
  const canvas = createCanvas(rowWidth, spriteHeight * numSpritesY)

  const saveImage = (canvas, path) => {
    fs.writeFileSync(
      path,
      canvas.toBuffer("image/png")
    );
  };

  img = await loadImage(imgPath)

  ctx = canvas.getContext("2d")

  for (let i = 0; i < 3; ++i) {
    ctx.drawImage(
      img,
      0, startY + gapY * i + spriteHeight * i,
      rowWidth, spriteHeight,
      0, spriteHeight * i,
      rowWidth, spriteHeight
    )
  } 

  saveImage(canvas, imgPath)
}

async function main() {
  const basePath = "~/Dev/nft/media/final/spritesheets/mint"

  fs.readdir(basePath, async function(err, files) {
    if (err) {
      console.error(err)
      return
    }

    let count = 0

    for (let file of files) {
      const imgPath = path.join(basePath, file)
      await resizeSpritesheet(imgPath)
      count += 1

      if (count % 100 == 0) {
        console.log("Completed", count)
      }
    }
  })
}

main().then(() => console.log("done!"))
