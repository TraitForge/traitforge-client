import { composeIMG } from './imageProcessing';
import { uploadToS3 } from './s3';

export async function processImage(
  paddedEntropy: string | number,
  randomEntropy: string | number,
  entityGeneration: string | number,
  isPossiblyInbred: boolean
) {
  const power = Math.floor(Number(paddedEntropy) / 100000);
  const imageBuffer = await composeIMG(randomEntropy, entityGeneration, power, isPossiblyInbred);
  if (imageBuffer) {
    const uri = await generateUri(paddedEntropy, entityGeneration);
    const fileName = `${uri}`;
    await uploadToS3(imageBuffer, fileName);

    return `https://traitforge.s3.amazonaws.com/${fileName}`;
  } else {
    throw new Error('Image Layering Failed');
  }
}

async function generateUri(
  paddedEntropy: string | number,
  entityGeneration: string | number
) {
  return `entity/${entityGeneration}/${paddedEntropy}.jpeg`;
}
