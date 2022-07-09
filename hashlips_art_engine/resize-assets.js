const { createCanvas, loadImage } = require("canvas")
const fs = require("fs");
const path = require("path")

async function main() {
  const basePath = "layers-full-size"
  fs.readdir(basePath, async function(err, files) {
    if (err) {
      console.error(err)
      return
    }

    for (let file of files) {
      const dirPath = path.join(basePath, file)

      if (fs.lstatSync(dirPath).isDirectory()) {
        fs.readdir(dirPath, async function(_err, _files) {
          if (_err) {
            console.error(_err)
            return
          }

          for (let _file of _files) {
            if (_file.endsWith(".png") || _file.endsWith(".jpg")) {
              const imgPath = path.join(dirPath, _file)
              await resizeImage(imgPath)
            }
          }
        })
      }
    }
  })
}

const canvas = createCanvas(900, 1411)

async function resizeImage(imgPath) {
  ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const img = await loadImage(imgPath)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const outputPath = path.join("output", imgPath)
  const outputDir = path.dirname(outputPath)

  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(outputPath, canvas.toBuffer("image/png"))
}

main()
