import sharp from 'sharp';
import path from 'path';
import varConfig from './variablesConfig';

export const composeIMG = async (entityEntropy, entityGeneration) => {
  try {
    const baseCharacterBuffer = await baseCharacterImg(entityGeneration);
    console.log('Base Character Buffer Length:', baseCharacterBuffer.length);

    const variablesImgBuffer = await variablesLayer(
      entityEntropy,
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
        background: { r: 0, g: 0, b: 0, alpha: 0 },
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

const variablesLayer = async (entityEntropy, entityGeneration) => {
  console.log(
    `variablesLayer - entityEntropy: ${entityEntropy}, entityGeneration: ${entityGeneration}`
  );
  const entropy = entityEntropy ? entityEntropy.toString() : '';
  const generation = entityGeneration ? entityGeneration.toString() : '';

  const optionIndex1 = parseInt(entropy[0]) % varConfig.varOptions1.length;
  const optionIndex2 = parseInt(entropy[1]) % varConfig.varOptions2.length;
  const optionIndex3 = parseInt(entropy[2]) % varConfig.varOptions3.length;
  const optionIndex4 = parseInt(entropy[3]) % varConfig.varOptions4.length;

  console.log(`Entropy: ${entropy}`);
  console.log(`Entropy length: ${entropy.length}`);

  const color1 =
    colorOptions1[
      parseInt(entropy[entropy.length - 2]) % varConfig.colorOptions1.length
    ];
  const color2 =
    colorOptions2[
      parseInt(entropy[entropy.length - 1]) % varConfig.colorOptions2.length
    ];
  const color3 =
    colorOptions3[
      parseInt(entropy[entropy.length - 2]) % varConfig.colorOptions3.length
    ];
  const color4 =
    colorOptions4[
      parseInt(entropy[entropy.length - 1]) % varConfig.colorOptions4.length
    ];

  console.log(
    `color1: ${color1}, color2: ${color2}, color3: ${color3}, color4: %{color4}`
  );

  let varImage1 = await tintImage(
    path.join(
      varConfig.variablesPath,
      generation,
      varConfig.varPath1,
      `${varOptions1[optionIndex1]}.png`
    ),
    color1
  );
  let varImage2 = await tintImage(
    path.join(
      varConfig.variablesPath,
      generation,
      varConfig.varPath2,
      `${varOptions2[optionIndex2]}.png`
    ),
    color2
  );
  let varImage3 = await tintImage(
    path.join(
      varConfig.variablesPath,
      generation,
      varConfig.varPath3,
      `${varOptions3[optionIndex3]}.png`
    ),
    color3
  );
  let varImage4 = await tintImage(
    path.join(
      varConfig.variablesPath,
      generation,
      varConfig.varPath4,
      `${varOptions4[optionIndex4]}.png`
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
  overlayBuffer = null,
  offsetX = 0,
  offsetY = 0
) => {
  const generation = entityGeneration.toString();
  const imagePath = path.join(
    variablesPath,
    generation,
    `baseCharacter_${generation}.png`
  );
  let baseCharacter = sharp(imagePath);
  if (overlayBuffer) {
    baseCharacter = await baseCharacter.composite([
      { input: overlayBuffer, top: offsetY, left: offsetX },
    ]);
  }
  return baseCharacter.toBuffer();
};

const tintImage = async (imagePath, hexColorWhite, hexColorGrey) => {
  const originalImage = sharp(imagePath);
  hexColorWhite = hexColorWhite ? hexColorWhite.toString() : '';
  hexColorGrey = hexColorGrey ? hexColorGrey.toString() : '';
  const rgbWhite = hexToRgb(hexColorWhite);
  const rgbGrey = hexToRgb(hexColorGrey);

  const { data, info } = await originalImage
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { r: tintRWhite, g: tintGWhite, b: tintBWhite } = rgbWhite;
  const { r: tintRGrey, g: tintGGrey, b: tintBGrey } = rgbGrey;

  for (let i = 0; i < data.length; i += 4) {
    const isWhiteOrNearWhite = data[i] > 230 && data[i + 1] > 230 && data[i + 2] > 230;
    const isGrey = Math.abs(data[i] - data[i + 1]) < 30 && Math.abs(data[i + 1] - data[i + 2]) < 30 && Math.abs(data[i] - data[i + 2]) < 30 &&
                   data[i] >= 100 && data[i] <= 230 &&
                   data[i + 1] >= 100 && data[i + 1] <= 230 &&
                   data[i + 2] >= 100 && data[i + 2] <= 230;

    if (isWhiteOrNearWhite) {
      data[i] = tintRWhite;
      data[i + 1] = tintGWhite;
      data[i + 2] = tintBWhite;
    } else if (isGrey) {
      data[i] = tintRGrey;
      data[i + 1] = tintGGrey;
      data[i + 2] = tintBGrey;
    }
  }

  const tintedImage = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toBuffer();

  return tintedImage;
};

const hexToRgb = hex => {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};
