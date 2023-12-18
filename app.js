/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
const path = require('path')
const jimp = require('jimp')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const ARRAY_IMAGE = [
  'https://storage-aci.secureswiftcontent.com/viuit/merchant/7/products/88b683eb-5a11-4cd6-ad97-3251f4990045_1698822786187.jpg',
  'https://storage-aci.secureswiftcontent.com/viuit/merchant/3888/products/38d9dc8b-af48-4757-8c89-2b65e9666063_1698295521907.png',
] // Example of image online, can also change to image locally

const TEMP_FOLDER_PATH = `temp`

async function implementWatermark(rawImage, watermarkIndex) {
  await new Promise((resolve) => {
    watermarkIndex.resize(rawImage.bitmap.width / 2, jimp.AUTO) // Used to resize watermark logo assets

    const X = (rawImage.bitmap.width - watermarkIndex.bitmap.width) / 2
    const Y = (rawImage.bitmap.height - watermarkIndex.bitmap.height) / 2

    resolve(
      rawImage.composite(watermarkIndex, X, Y, [
        {
          mode: jimp.BLEND_SOURCE_OVER,
        },
      ])
    )
  })
}

async function saveWatermark(url) {
  const rawImage = await jimp.read(url)
  const dataName = `${uuidv4()}_${new Date().getTime()}.webp` // Alter to WEBP only

  if (!fs.existsSync(path.resolve(TEMP_FOLDER_PATH))) {
    fs.mkdirSync(path.resolve(TEMP_FOLDER_PATH), { recursive: true })
  }

  const filePath = path.resolve(`${TEMP_FOLDER_PATH}/${dataName}`)
  const watermarkImage = await jimp.read(`${process.cwd()}/assets/watermarkSample.png`)

  await implementWatermark(rawImage, watermarkImage)

  await rawImage.writeAsync(filePath)
}

async function run() {
  if (ARRAY_IMAGE.length > 0) {
    for await (const url of ARRAY_IMAGE) {
      await saveWatermark(url)
    }
  }
}

run()
