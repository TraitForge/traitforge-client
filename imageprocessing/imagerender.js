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

const varPath1 = path.join(variablesPath, 'varOptions1');
const varPath2 = path.join(variablesPath, 'varOptions2');
const varPath3 = path.join(variablesPath, 'varOptions3');
const varPath4 = path.join(variablesPath, 'varOptions4');

const varOptions1 = ['var1option1', 'var1option2', 'var1option3', 'var1option4', 'var1option5', 'var1option6', 'var1option7', 'var1option8', 'var1option9', 'var1option10'];
const varOptions2 = ['var2option1', 'var2option2', 'var2option3', 'var2option4', 'var2option5', 'var2option6', 'var2option7', 'var2option8', 'var2option9', 'var2option10'];
const varOptions3 = ['var3option1', 'var3option2', 'var3option3', 'var3option4', 'var3option5', 'var3option6', 'var3option7', 'var3option8', 'var3option9', 'var3option10'];
const varOptions4 = ['var4option1', 'var4option2', 'var4option3', 'var4option4', 'var4option5', 'var4option6', 'var4option7', 'var4option8', 'var4option9', 'var4option10'];

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


  const optionIndex1 = parseInt(entropy[0]) % varOptions1.length;
  const optionIndex2 = parseInt(entropy[1]) % varOptions2.length;
  const optionIndex3 = parseInt(entropy[2]) % varOptions3.length;
  const optionIndex4 = parseInt(entropy[3]) % varOptions4.length;

  const color1 = colorOptions1[parseInt(entropy[entropy.length - 2]) % colorOptions1.length];
  const color2 = colorOptions2[parseInt(entropy[entropy.length - 1]) % colorOptions2.length];

  let varImage1 = await tintImage(path.join(varPath1, `${varOptions1[optionIndex1]}.png`), color1);
  let varImage2 = await tintImage(path.join(varPath2, `${varOptions2[optionIndex2]}.png`), color2);
  let varImage3 = await tintImage(path.join(varPath3, `${varOptions3[optionIndex3]}.png`), color2);
  let varImage4 = await tintImage(path.join(varPath4, `${varOptions4[optionIndex4]}.png`), color1);

  let baseImage = sharp({
  create: {
    width: 500,
    height: 500,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
  }).png();

  baseImage = await baseImage.composite([
    { input: varImage1, top: 0, left: 0 },
    { input: varImage2, top: 0, left: 0 },
    { input: varImage3, top: 0, left: 0 },
    { input: varImage4, top: 0, left: 0 },
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