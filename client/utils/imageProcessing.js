import sharp from 'sharp';
import path from 'path';
import varConfig from './variablesConfig';

export const composeIMG = async (paddedEntropy,  entityGeneration) => {
  try {
    const baseCharacterBuffer = await baseCharacterImg(entityGeneration, paddedEntropy);
    console.log('Base Character Buffer Length:', baseCharacterBuffer.length);

    const variablesImgBuffer = await variablesLayer(
      paddedEntropy,
      entityGeneration
    );
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
        background: { r: 173, g: 216, b: 230, alpha: 1 },
      },
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
};

const variablesLayer = async (paddedEntropy, entityGeneration) => {
  console.log(
    `variablesLayer - entityEntropy: ${paddedEntropy}, entityGeneration: ${entityGeneration}`
  );
  const entropy = paddedEntropy ? paddedEntropy.toString() : '';
  const generation = entityGeneration ? entityGeneration.toString() : '';

  const optionIndex1 = parseInt(entropy[0]) % varConfig.varOptions.varOptions1.length;
  const optionIndex2 = parseInt(entropy[1]) % varConfig.varOptions.varOptions2.length;
  const optionIndex3 = parseInt(entropy[2]) % varConfig.varOptions.varOptions3.length;
  const optionIndex4 = parseInt(entropy[3]) % varConfig.varOptions.varOptions4.length;

  console.log(`Entropy: ${entropy}`);
  console.log(`Entropy length: ${entropy.length}`);

  const color1 =
    varConfig.colorOptions.colorOptions1[
      parseInt(entropy[entropy.length - 2]) % varConfig.colorOptions.colorOptions1.length
    ];
  const color2 =
    varConfig.colorOptions.colorOptions2[
      parseInt(entropy[entropy.length - 1]) % varConfig.colorOptions.colorOptions2.length
    ];
  const color3 =
    varConfig.colorOptions.colorOptions3[
      parseInt(entropy[entropy.length - 2]) % varConfig.colorOptions.colorOptions3.length
    ];
  const color4 =
    varConfig.colorOptions.colorOptions4[
      parseInt(entropy[entropy.length - 1]) % varConfig.colorOptions.colorOptions4.length
    ];

  console.log(
    `color1: ${color1}, color2: ${color2}, color3: ${color3}, color4: ${color4}`
  );

  let varImage1 = await tintImage(
    path.join(
      varConfig.variablesPath,
      generation,
      varConfig.varPaths.varPath1,
      `${varConfig.varOptions.varOptions1[optionIndex1]}.png`
    ),
    color1
  );
  let varImage2 = await tintImage(
    path.join(
      varConfig.variablesPath,
      generation,
      varConfig.varPaths.varPath2,
      `${varConfig.varOptions.varOptions2[optionIndex2]}.png`
    ),
    color2
  );
  let varImage3 = await tintImage(
    path.join(
      varConfig.variablesPath,
      generation,
      varConfig.varPaths.varPath3,
      `${varConfig.varOptions.varOptions3[optionIndex3]}.png`
    ),
    color3
  );
  let varImage4 = await tintImage(
    path.join(
      varConfig.variablesPath,
      generation,
      varConfig.varPaths.varPath4,
      `${varConfig.varOptions.varOptions4[optionIndex4]}.png`
    ),
    color4
  );

  let baseImage = sharp({
    create: {
      width: 2100,
      height: 2100,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).png();

  baseImage = await baseImage.composite([
    { input: varImage1, top: 0, left: 0 },
    { input: varImage2, top: 0, left: 0 },
    { input: varImage3, top: 0, left: 0 },
    { input: varImage4, top: 0, left: 0 },
  ]);
  return await baseImage.toBuffer();
};

const baseCharacterImg = async (
  entityGeneration,
  paddedEntropy,
  overlayBuffer = null,
  offsetX = 0,
  offsetY = 0
) => {
  const generation = entityGeneration.toString();
  const imagePath = path.join(
    varConfig.variablesPath,
    generation,
    `baseCharacter_${generation}.png`
  );

  const entropyIndexWhite = paddedEntropy.length - 2;
  const entropyIndexGrey = paddedEntropy.length - 3;
  const hexColorWhite = varConfig.colorOptions.characterColorOptions1[parseInt(paddedEntropy[entropyIndexWhite]) % varConfig.colorOptions.characterColorOptions1.length];
  const hexColorGrey = varConfig.colorOptions.characterColorOptions2[parseInt(paddedEntropy[entropyIndexGrey]) % varConfig.colorOptions.characterColorOptions2.length];

  let baseCharacter = sharp(imagePath);

  baseCharacter = await tintImage(imagePath, hexColorWhite, hexColorGrey);

  if (overlayBuffer) {
    baseCharacter = sharp(await baseCharacter.toBuffer()).composite([
      { input: overlayBuffer, top: offsetY, left: offsetX },
    ]);
  }

  return baseCharacter;
};


const tintImage = async (imagePath, hexColorWhite, hexColorGrey) => {
  const rgbWhite = hexToRgb(hexColorWhite || '#ffffff'); 
  const rgbGrey = hexToRgb(hexColorGrey || '#808080'); 

  const originalImage = sharp(imagePath);
  const { data, info } = await originalImage.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const isWhiteOrNearWhite = data[i] > 230 && data[i + 1] > 230 && data[i + 2] > 230;
    const isGrey = Math.abs(data[i] - data[i + 1]) < 30 && 
          Math.abs(data[i + 1] - data[i + 2]) < 30 && 
          Math.abs(data[i] - data[i + 2]) < 30 &&
          data[i] >= 10 && data[i] <= 230 &&
          data[i + 1] >= 10 && data[i + 1] <= 230 &&
          data[i + 2] >= 10 && data[i + 2] <= 230;

    if (isWhiteOrNearWhite) {
      data[i] = rgbWhite.r;
      data[i + 1] = rgbWhite.g;
      data[i + 2] = rgbWhite.b;
    } else if (isGrey) {
      data[i] = rgbGrey.r;
      data[i + 1] = rgbGrey.g;
      data[i + 2] = rgbGrey.b;
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
  .png()
  .toBuffer();
};

const hexToRgb = hex => {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};
