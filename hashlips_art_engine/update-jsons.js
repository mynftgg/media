const fs = require("fs");
const path = require("path")

function main() {
  const basePath = "build/json"
  fs.readdir(basePath, function(err, files) {
    if (err) {
      console.error(err)
      return
    }

    for (let file of files) {
      if (file != "_metadata.json" && file.endsWith(".json")) {
        const filePath = path.join(basePath, file)
        updateJson(filePath)
      }
    }
  })
}

function updateJson(filePath) {
  const text = fs.readFileSync(filePath) 
  console.log("Reading", filePath)
  const data = JSON.parse(text)

  data["collection"] = {
    "name": "MYNFT.GG OG",
    "family": "MYNFT.GG"
  }

  data["name"] = `MYNFT.GG #${data.edition}` 
  data["attributes"] = updateAttributes(data["attributes"])
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

function updateAttributes(attrs) {
  const updated = []

  for (let attr of attrs) {
    if (attr["trait_type"] == "Coin"
      || attr["trait_type"] == "Hair"
      || attr["trait_type"] == "Mouth"
      || attr["value"] == "None" 
    ) {
      continue
    } 

    updated.push(attr)
  }

  return updated
}

main()
