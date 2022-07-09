
const { createCanvas, loadImage } = require("canvas")
const fs = require("fs")
const path = require("path")

const baseDir = "~/Dev/nft/media/Modern_Interiors/2_Characters/Character_Generator"

const layers = [
  "Body",
  "Clothes",
  "Hair",
  "Eyes",
  "Backpack",
  "Face Gear",
  "Head Gear",
]

const defaults = {
  "Hair": "Hairstyles/32x32/Hairstyle_01_32x32_04.png"
}

const outputWidth = 1854
const outputHeight = 1312

const canvas = createCanvas(outputWidth, outputHeight)
ctx = canvas.getContext("2d")

const attributeMapping = JSON.parse(fs.readFileSync("attributes.json"))

const saveImage = (canvas, path) => {
  fs.writeFileSync(
    path,
    canvas.toBuffer("image/png")
  );
};

const getAttributeByName = (attributes, name) => {
  if (name == "Backpack") {
    name = "Clothes"
  }

  const filtered = attributes.filter(x => x["trait_type"] == name)

  if (filtered.length) {
    return filtered[0].value
  }

  return null
}

async function draw(metadataPath, outputPath) {
  const data = JSON.parse(fs.readFileSync(metadataPath))
  const imgPaths = []

  for (let layer of layers) {
    const attr = getAttributeByName(data["attributes"], layer)
    let layerPath

    if (attr) {
      layerPath = attributeMapping[layer][attr]

      if (!layerPath) {
        console.warn("Missing value for", layer, attr)
      }
    } else {
      layerPath = defaults[layer]
    }

    if (layerPath) {
      imgPaths.push(path.join(baseDir, layerPath))
    }
  }

  await renderAsync(imgPaths, outputPath)
};

async function renderAsync(imagePaths, outputPath) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let path of imagePaths) {
    const img = await loadImage(path)
    ctx.drawImage(img, 0, 0, img.width, img.height)
  }

  saveImage(canvas, outputPath)
}

async function main() {
  const basePath = "~/Dev/nft/media/final/mint"
  const outputDir = "~/Dev/nft/media/final/spritesheets/mint"
  fs.mkdirSync(outputDir, { recursive: true })

  fs.readdir(basePath, async function(err, files) {
    if (err) {
      console.error(err)
      return
    }

    let count = 0

    for (let file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(basePath, file)
        await draw(filePath, path.join(outputDir, file + ".png"))
        count += 1

        if (count % 100 == 0) {
          console.log("Completed", count)
        }
      }
    }
  })
}

main()
