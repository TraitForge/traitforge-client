const express = require('express');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 8080;

const variablesPath = './assets/variables';

const varPath1 = ( 'varOptions1');
const varPath2 = ( 'varOptions2');
const varPath3 = ( 'varOptions3');
const varPath4 = ( 'varOptions4');

const varOptions1 = ['var1option1', 'var1option2', 'var1option3', 'var1option4', 'var1option5', 'var1option6', 'var1option7', 'var1option8', 'var1option9', 'var1option10'];
const varOptions2 = ['var2option1', 'var2option2', 'var2option3', 'var2option4', 'var2option5', 'var2option6', 'var2option7', 'var2option8', 'var2option9', 'var2option10'];
const varOptions3 = ['var3option1', 'var3option2', 'var3option3', 'var3option4', 'var3option5', 'var3option6', 'var3option7', 'var3option8', 'var3option9', 'var3option10'];
const varOptions4 = ['var4option1', 'var4option2', 'var4option3', 'var4option4', 'var4option5', 'var4option6', 'var4option7', 'var4option8', 'var4option9', 'var4option10'];

const colorOptions1 = [
  '#db00ff', // Neon Violet
  '#003cff', // Neon Blue
  '#00f2ff', // Bright Cyan
  '#4cFF00', // Neon Green
  '#b100ff', // Neon Purple
  '#bb00ff', // Bright Purple
  '#6200ff', // Neon Indigo
  '#00eaff', // Bright Cyan
  '#6e6e6e', // Brighter Gray
  '#9e9ea0', // Light Slate Gray
];

const colorOptions2 = [
  '#00a6a6', // Bright Teal
  '#00dada', // Neon Turquoise
  '#007acc', // Bright Metallic Blue
  '#007f7f', // Bright Slate Gray
  '#6a74ff', // Bright Independence Blue
  '#bcbef0', // Light Cool Gray
  '#ff4066', // Neon Carmine Red
  '#ff2055', // Bright Red
  '#00ffea', // Bright Skobeloff Green
  '#a0ffec', // Light Blue Green
];


const colorOptions3 = [
  '#55555d', // Bright Graphite
  '#7a7abc', // Bright Slate Blue
  '#9191a1', // Light Gunmetal Gray
  '#535353', // Bright Off Black
  '#5578ff', // Neon Stormy Blue
  '#78a0a1', // Bright Steel Gray
  '#768798', // Light Cadet Gray
  '#757575', // Bright Dark Gray
  '#4d4d4d', // Bright Almost Black
  '#5f617a', // Bright Shadow Blue
];


const colorOptions4 = [
  '#00bdbd', // Bright Cyan
  '#14ffec', // Neon Cyan
  '#2a8eff', // Bright Blue
  '#242850', // Bright Night
  '#3f5066', // Bright Storm Gray
  '#e0e1e2', // Bright Silver
  '#7072ff', // Neon Periwinkle
  '#64666a', // Bright Gunmetal
  '#606060', // Bright Charcoal
  '#1f2433', // Deep Space Blue (brightened slightly)
];



async function baseCharacterImg(entityGeneration, overlayBuffer = null, offsetX = 0, offsetY = 0) {
  const generation = entityGeneration.toString();
  const imagePath = path.join(variablesPath, generation, `baseCharacter_${generation}.png`); 
  let baseCharacter = sharp(imagePath);
  if (overlayBuffer) {
    baseCharacter = await baseCharacter.composite([{ input: overlayBuffer, top: offsetY, left: offsetX }]);
  }
  return baseCharacter.toBuffer();
}

async function variablesLayer(entityEntropy, entityGeneration) {
  console.log(`variablesLayer - entityEntropy: ${entityEntropy}, entityGeneration: ${entityGeneration}`);
  const entropy = entityEntropy ? entityEntropy.toString() : '';
  const generation = entityGeneration ? entityGeneration.toString() : '';

  const optionIndex1 = parseInt(entropy[0]) % varOptions1.length;
  const optionIndex2 = parseInt(entropy[1]) % varOptions2.length;
  const optionIndex3 = parseInt(entropy[2]) % varOptions3.length;
  const optionIndex4 = parseInt(entropy[3]) % varOptions4.length;

  console.log(`Entropy: ${entropy}`);
  console.log(`Entropy length: ${entropy.length}`);
  
  const color1 = colorOptions1[parseInt(entropy[entropy.length - 2]) % colorOptions1.length];
  const color2 = colorOptions2[parseInt(entropy[entropy.length - 1]) % colorOptions2.length];
  const color3 = colorOptions3[parseInt(entropy[entropy.length - 2]) % colorOptions3.length];
  const color4 = colorOptions4[parseInt(entropy[entropy.length - 1]) % colorOptions4.length];

  console.log(`color1: ${color1}, color2: ${color2}, color3: ${color3}, color4: %{color4}`); 

  let varImage1 = await tintImage(path.join( variablesPath, generation, varPath1, `${varOptions1[optionIndex1]}.png`), color1);
  let varImage2 = await tintImage(path.join( variablesPath, generation, varPath2, `${varOptions2[optionIndex2]}.png`), color2);
  let varImage3 = await tintImage(path.join( variablesPath, generation, varPath3, `${varOptions3[optionIndex3]}.png`), color3);
  let varImage4 = await tintImage(path.join( variablesPath, generation, varPath4, `${varOptions4[optionIndex4]}.png`), color4);

  let baseImage = sharp({
  create: {
    width: 2100,
    height: 2100,
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
  const originalImage = sharp(imagePath);
  const { data, info } = await originalImage.raw().toBuffer({ resolveWithObject: true });

  const { r: tintR, g: tintG, b: tintB } = hexToRgb(hexColor);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245) {
      data[i] = (data[i] + tintR) / 2;
      data[i + 1] = (data[i + 1] + tintG) / 2;
      data[i + 2] = (data[i + 2] + tintB) / 2;
    }
  }

  const tintedImage = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  }).png().toBuffer();

  return tintedImage;
}


function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}


async function composeIMG(entityEntropy, entityGeneration) {
  try {
    const baseCharacterBuffer = await baseCharacterImg(entityGeneration);
    console.log('Base Character Buffer Length:', baseCharacterBuffer.length);

    const variablesImgBuffer = await variablesLayer(entityEntropy, entityGeneration);
    console.log('Variables Image Buffer Length:', variablesImgBuffer.length);

    if (!baseCharacterBuffer || !variablesImgBuffer) {
      console.error('One of the image buffers is invalid');
      return null;
    }

    const composedImage = await sharp({
      create: {
        width: 2100, 
        height: 2100,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([
      { input: baseCharacterBuffer, blend: 'over' },
      { input: variablesImgBuffer, blend: 'over' },
    ])
    .jpeg()
    .toBuffer();

    return composedImage;
  } catch (error) {
    console.error('Failed to compose:', error);
    return null;
  }
}



app.get('/generate-image', async (req, res) => {
  const { entityEntropy, entityGeneration } = req.query;
  try {
    const imageBuffer = await composeIMG(entityEntropy, entityGeneration);
    if (imageBuffer) {
      res.type('jpeg').send(imageBuffer);  // Set the response type to JPEG
    } else {
      throw new Error('Image Layering Failed');
    }
  } catch (error) {
    console.error("Failed to generate:", error);
    res.status(500).send("Failed to compose image");
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});