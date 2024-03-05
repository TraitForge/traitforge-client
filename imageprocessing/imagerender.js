const express = require('express');
const sharp = require('sharp');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs').promises;
const { ethers } = require("ethers");
const path = require('path');

const app = express();
const port = 8080;

let fetch;
import('node-fetch').then(module => {
  fetch = module.default;
}).catch(err => console.error(err));

const provider = new ethers.providers.JsonRpcProvider(""); 
const ContractAddress = ""; 
const ContractABI = [""]; 
const Contract = new ethers.Contract(ContractAddress, ContractABI, provider);

const baseCharacterPath = './assets/';
const variablesPath = './assets/variables';

const outfitPath = path.join(variablesPath, 'outfits');
const hairstylePath = path.join(variablesPath, 'hairstyles');
const tattooPath = path.join(variablesPath, 'tattoos');
const glassesPath = path.join(variablesPath, 'glasses');

const outfitOptions = ['outfit1', 'outfit2', 'outfit3', 'outfit4', 'outfit5', 'outfit6', 'outfit7', 'outfit8', 'outfit9', 'outfit10'];
const hairstyleOptions = ['hairstyle1', 'hairstyle2', 'hairstyle3', 'hairstyle4', 'hairstyle5', 'hairstyle6', 'hairstyle7', 'hairstyle8', 'hairstyle9', 'hairstyle10'];
const tattooOptions = ['tattoo1', 'tattoo2', 'tattoo3', 'tattoo4', 'tattoo5', 'tattoo6', 'tattoo7', 'tattoo8', 'tattoo9', 'tattoo10'];
const glassesOptions = ['glasses1', 'glasses2', 'glasses3', 'glasses4', 'glasses5', 'glasses6', 'glasses7', 'glasses8', 'glasses9', 'glasses10' ];

const colorOptions1 = [
  '#FFD700', // Vibrant Gold
  '#000000', // True Black
  '#002147', // Deep Navy (Dark Blue
  '#0078FF', // Bright Blue
  '#CCCC00', // Darker Yellow
  '#7D00FF', // Deep Purple
  '#008000', // Office Green (darker tone)
  '#00B7EB', // Cyan (vibrant but slightly deeper)
  '#383838', // Dark Gray (replacing OffBlack for contrast)
  '#CF4520'  // Burnt Orange (darker and richer than OrangeRed)
];

const colorOptions2 = [
  '#E63946', // Bright Red
  '#F4A261', // Sandy Brown
  '#2A9D8F', // Teal Green
  '#264653', // Dark Slate Gray
  '#2B2D42', // Independence Blue
  '#8D99AE', // Cool Gray
  '#EF233C', // Vivid Carmine Red
  '#D90429', // Maximum Red
  '#006D77', // Skobeloff Green
  '#83C5BE'  // Middle Blue Green
];

async function fetchMetadata(tokenId) {
  try {
  const tokenURI = await Contract.tokenURI(tokenId);
  const uriResponse = await fetch(tokenURI);
  const metadata = await uriResponse.json();
  const entityEntropy = await Contract.entityEntropy(tokenId);
  const entityGeneration = await Contract.entityGeneration(tokenId);
  const entityAge = await Contract.entityAge(tokenId);
  const combinedData = {
    metadata,
    entityEntropy,
    entityGeneration,
    entityAge
    };
  console.log(combinedData);
  return combinedData;
  } catch (error) {
  console.error("Error fetching metadata and contract data:", error);
}
}

async function baseCharacterImg(offsetX = 0, offsetY = 0, entityGeneration, overlayBuffer) {
  generation = entityGeneration.toString();
  const imagePath = path.join(baseCharacterPath, `${generation}`, 'baseCharacter.png');
  let baseCharacter = sharp(imagePath);
  if (overlayBuffer) {
  baseCharacter = await baseCharacter.composite([{ input: overlayBuffer, top: offsetY, left: offsetX }])
  }
  return baseCharacter;
}

async function variablesLayer(entityEntropy) {
  const entropy = entityEntropy.toString();

  const outfitIndex = parseInt(entropy[0]) % outfitOptions.length;
  const hairstyleIndex = parseInt(entropy[1]) % hairstyleOptions.length;
  const tattooIndex = parseInt(entropy[2]) % tattooOptions.length;
  const glassesIndex = parseInt(entropy[3]) % glassesOptions.length;

  const color1 = colorOptions1[parseInt(entropy[entropy.length - 2]) % colorOptions1.length];
  const color2 = colorOptions2[parseInt(entropy[entropy.length - 1]) % colorOptions2.length];

  let outfitImage = await tintImage(path.join(outfitPath, `${outfitOptions[outfitIndex]}.png`), color1);
  let hairstyleImage = await tintImage(path.join(hairstylePath, `${hairstyleOptions[hairstyleIndex]}.png`), color2);
  let tattooImage = await tintImage(path.join(tattooPath, `${tattooOptions[tattooIndex]}.png`), color2);
  let glassesImage = await tintImage(path.join(glassesPath, `${glassesOptions[glassesIndex]}.png`), color1);

  let baseImage = sharp({
  create: {
    width: 500,
    height: 500,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
  }).png();

  baseImage = await baseImage.composite([
    { input: outfitImage, top: 0, left: 0 },
    { input: hairstyleImage, top: 0, left: 0 },
    { input: tattooImage, top: 0, left: 0 },
    { input: glassesImage, top: 0, left: 0 },
  ]);
  return await baseImage.toBuffer();
}

async function tintImage(imagePath, hexColor) {
  const { r, g, b } = hexToRgb(hexColor);
  const overlay = await sharp({
  create: {
    width: 500,
    height: 500,
    channels: 4,
    background: { r, g, b, alpha: 0.5 } 
  }
  }).png().toBuffer();

  return sharp(imagePath)
  .resize(500, 500)
  .composite([{ input: overlay, blend: 'multiply' }])
  .toBuffer();
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}


function agingLayer(entityEntropy, entityAge) {
  const entropy = parseInt(entityEntropy, 10);
  const age = parseFloat(entityAge); 
  const performanceFactor = entropy % 10;
  let effectiveAge = age * performanceFactor;
  const maxEffectiveAge = 3;
  if (effectiveAge > maxEffectiveAge) {
    effectiveAge = maxEffectiveAge;
  }
  const opacity = effectiveAge / maxEffectiveAge;
  return opacity; 
}

async function adjustOpacityWithCanvas( opacity ) {
  const image = await loadImage('./assets/Aging-layer.png');
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  ctx.globalAlpha = opacity;

  ctx.drawImage(image, 0, 0, image.width, image.height);

  const buffer = canvas.toBuffer('image/png');

  const processedImage = await sharp(buffer)
  .resize(image.width, image.height) 
  .toBuffer();

  await fs.promises.writeFile('processedImage.png', processedImage);
  return processedImage;
}

async function composeIMG(entityEntropy, entityGeneration, entityAge) {
  if (!provider) {
  console.error('Provider is not available.');
  return null;
  }
  try {
  const opacity = agingLayer(entityEntropy, entityAge);
  const agingImageBuffer = await adjustOpacityWithCanvas(opacity);
  const baseCharacterBuffer = await baseCharacterImg(entityGeneration).toBuffer();
  const variablesImgBuffer = await variablesLayer(entityEntropy);
  const composedImage = await sharp(agingImageBuffer)
  .composite([
    { input: baseCharacterBuffer, blend: 'over' },
    { input: variablesImgBuffer, blend: 'over' },
  ])
  .toBuffer();

  return composedImage;
} catch (error) {
  console.error('Failed to compose:', error);
  return null;
  }
}


app.get('/generate-image', async (req, res) => {
  const tokenId = req.query.tokenId; 
  try {
  const { entityEntropy, entityGeneration } = await fetchMetadata(tokenId);
  const imageBuffer = await composeIMG(entityEntropy, entityGeneration);
  if (imageBuffer) {
  res.type('jpeg').send(imageBuffer);
  } else {
  throw new Error('Image Layering Failed', error);
  } 
  } catch (error) {
  console.error("failed to generate:", error);
res.status(500).send("Failed to compose image");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});