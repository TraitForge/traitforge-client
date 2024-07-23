import { composeIMG } from '~/utils/imageProcessing';
import { uploadToS3 } from '~/utils/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function processImage(
  paddedEntropy: string | number,
  entityGeneration: string | number
) {
  const imageBuffer = await composeIMG(paddedEntropy, entityGeneration);
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

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const { paddedEntropy, entityGeneration } = data;

  try {
    const url = await processImage(
      paddedEntropy as string,
      entityGeneration as string
    );
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('Failed to generate or upload:', error);
    return NextResponse.json(
      { error: 'Failed to compose or upload image' },
      { status: 500 }
    );
  }
};
