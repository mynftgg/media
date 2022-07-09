const { createCanvas, loadImage } = require("canvas")
const fs = require("fs");
const path = require("path")

async function main() {
  const basePath = "build/images"
  fs.readdir(basePath, async function(err, files) {
    if (err) {
      console.error(err)
      return
    }

    for (let file of files) {
      const filePath = path.join(basePath, file)
      await getSquareImage(filePath)
    }
  })
}

const canvas = createCanvas(900, 900)

async function getSquareImage(imgPath) {
  ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const img = await loadImage(imgPath)

  ctx.drawImage(
    img,
    0, 0,
    canvas.width, canvas.height,
    0, 0,
    canvas.width, canvas.height
  )

  const outputPath = path.join("square", imgPath)
  const outputDir = path.dirname(outputPath)

  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(outputPath, canvas.toBuffer("image/png"))
}

main()
