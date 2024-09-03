import sharp from 'sharp';
import path from 'path';
import varConfig from './variablesConfig';
import { getS3Object } from './s3';
import { createGauge } from './createMercuryGauge';

export const composeIMG = async (
  paddedEntropy: string | number,
  entityGeneration: string | number,
  power: number
) => {
  console.log('starting next image:', paddedEntropy, entityGeneration, power);
  try {
    const baseCharacterBuffer = await baseCharacterImg(
      entityGeneration,
      paddedEntropy
    );

    const variablesImgBuffer = await variablesLayer(
      paddedEntropy,
      entityGeneration
    );

    if (!baseCharacterBuffer || !variablesImgBuffer) {
      console.error('One of the image buffers is invalid');
      return null;
    }

    const backgroundImage = await getS3Object('backgroundfinish.png');
    const backgroundBuffer = await sharp(backgroundImage as any).toBuffer();
    const gaugeBuffer = await createGauge(power);

    const composedImage = await sharp({
      create: {
        width: 3000,
        height: 3000,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    })
      .composite([
        { input: backgroundBuffer, blend: 'over' },
        { input: baseCharacterBuffer, blend: 'over' },
        { input: variablesImgBuffer, blend: 'over' },
        { input: gaugeBuffer, blend: 'over', top: 150, left: 150},
      ])
      .jpeg()
      .toBuffer();

    return composedImage;
  } catch (error) {
    console.error('Failed to compose:', error);
    return null;
  }
};

const variablesLayer = async (
  paddedEntropy: string | number,
  entityGeneration: string | number
) => {
  const entropy = paddedEntropy ? paddedEntropy.toString() : '';
  const generation = entityGeneration ? entityGeneration.toString() : '';

  const optionIndex1 =
    Number(entropy[0]) % varConfig.varOptions.varOptions1.length;
  const optionIndex2 =
    Number(entropy[1]) % varConfig.varOptions.varOptions2.length;
  const optionIndex3 =
    Number(entropy[2]) % varConfig.varOptions.varOptions3.length;
  const optionIndex4 =
    Number(entropy[3]) % varConfig.varOptions.varOptions4.length;
  const color1ArrayIndex = Number(entropy[5]);
  const color2ArrayIndex = Number(entropy[4]);
  const color3ArrayIndex = Number(entropy[3]);
  const color4ArrayIndex = Number(entropy[2]);
  const color1 =
    varConfig.colorOptions[`colorOptions${color1ArrayIndex}`][
      Number(entropy[5]) %
        varConfig.colorOptions[`colorOptions${color1ArrayIndex}`].length
    ];
  const color2 =
    varConfig.colorOptions[`colorOptions${color2ArrayIndex}`][
      Number(entropy[4]) %
        varConfig.colorOptions[`colorOptions${color2ArrayIndex}`].length
    ];
  const color3 =
    varConfig.colorOptions[`colorOptions${color3ArrayIndex}`][
      Number(entropy[3]) %
        varConfig.colorOptions[`colorOptions${color3ArrayIndex}`].length
    ];
  const color4 =
    varConfig.colorOptions[`colorOptions${color4ArrayIndex}`][
      Number(entropy[2]) %
        varConfig.colorOptions[`colorOptions${color4ArrayIndex}`].length
    ];
  const color5 =
    varConfig.colorOptions2[`colorOptions${color3ArrayIndex}`][
      Number(entropy[3]) %
        varConfig.colorOptions2[`colorOptions${color3ArrayIndex}`].length
    ];
  const color6 =
    varConfig.colorOptions2[`colorOptions${color4ArrayIndex}`][
      Number(entropy[2]) %
        varConfig.colorOptions2[`colorOptions${color4ArrayIndex}`].length
    ];

  let varImage1 = await tintVariables(
    path.join(
      generation,
      varConfig.varPaths.varPath1,
      `${varConfig.varOptions.varOptions1[optionIndex1]}.png`
    ),
    color1,
    color5
  );
  let varImage2 = await tintVariables(
    path.join(
      generation,
      varConfig.varPaths.varPath2,
      `${varConfig.varOptions.varOptions2[optionIndex2]}.png`
    ),
    color2,
    color6
  );
  let varImage3 = await tintVariables(
    path.join(
      generation,
      varConfig.varPaths.varPath3,
      `${varConfig.varOptions.varOptions3[optionIndex3]}.png`
    ),
    color3,
    color5
  );
  let varImage4 = await tintVariables(
    path.join(
      generation,
      varConfig.varPaths.varPath4,
      `${varConfig.varOptions.varOptions4[optionIndex4]}.png`
    ),
    color4,
    color6
  );

  let baseImage = sharp({
    create: {
      width: 3000,
      height: 3000,
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
  entityGeneration: string | number,
  paddedEntropy: string | number,
  overlayBuffer: Buffer | null = null,
  offsetX = 0,
  offsetY = 0
) => {
  const generation = entityGeneration.toString();
  const entropy = paddedEntropy.toString();
  const imagePath = path.join(generation, `baseCharacter_${generation}.png`);

  const hexColorWhite =
    varConfig.colorOptions.characterColorOptions1[
      Number(entropy[5]) % varConfig.colorOptions.characterColorOptions1.length
    ];
  const hexColorGrey =
    varConfig.colorOptions.characterColorOptions2[
      Number(entropy[5]) % varConfig.colorOptions.characterColorOptions2.length
    ];
  // let baseCharacter = sharp(imagePath);
  let baseCharacter = await tintCharacter(
    imagePath,
    hexColorWhite || '',
    hexColorGrey || ''
  );

  if (overlayBuffer) {
    baseCharacter = await sharp(baseCharacter)
      .composite([{ input: overlayBuffer, top: offsetY, left: offsetX }])
      .toBuffer();
  }

  return baseCharacter;
};

const tintCharacter = async (
  imagePath: string,
  hexColorWhite: string,
  hexColorGrey: string
) => {
  const rgbWhite = hexToRgb(hexColorWhite);
  const rgbGrey = hexToRgb(hexColorGrey);

  const imageObj = await getS3Object(imagePath);

  const originalImage = sharp(imageObj as any);
  const { data, info } = await originalImage
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const isPureWhite =
      data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255;
    const isPureGrey =
      data[i] === data[i + 1] &&
      data[i + 1] === data[i + 2] &&
      data[i] !== 0 &&
      data[i] !== 255;

    if (isPureWhite) {
      data[i] = rgbWhite.r;
      data[i + 1] = rgbWhite.g;
      data[i + 2] = rgbWhite.b;
    } else if (isPureGrey) {
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

const tintVariables = async (
  imagePath: string,
  firstColor: string,
  secondColor: string
) => {
  const rgbWhite = hexToRgb(firstColor);
  const rgbGrey = hexToRgb(secondColor);

  const imageObj = await getS3Object(imagePath);

  const originalImage = sharp(imageObj as any);
  const { data, info } = await originalImage
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const isPureWhite =
      data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255;
    const isPureGrey =
      data[i] === data[i + 1] &&
      data[i + 1] === data[i + 2] &&
      data[i] !== 0 &&
      data[i] !== 255;

    if (isPureWhite) {
      data[i] = rgbWhite.r;
      data[i + 1] = rgbWhite.g;
      data[i + 2] = rgbWhite.b;
    } else if (isPureGrey) {
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

const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};
