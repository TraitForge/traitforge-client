import { composeIMG } from '~/utils/imageProcessing';
import s3 from '~/aws-config';
import { NextApiRequest, NextApiResponse } from 'next';
import { S3 } from 'aws-sdk';

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

async function uploadToS3(imageBuffer: Buffer, fileName: string) {
  const params: S3.PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: fileName,
    Body: imageBuffer,
    ContentType: 'image/jpeg',
  };
  return s3.upload(params).promise();
}

async function generateUri(
  paddedEntropy: string | number,
  entityGeneration: string | number
) {
  return `entity/${entityGeneration}/${paddedEntropy}.jpeg`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { paddedEntropy, entityGeneration } = req.query;

    try {
      const url = await processImage(
        paddedEntropy as string,
        entityGeneration as string
      );
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).send(url);
    } catch (error) {
      console.error('Failed to generate or upload:', error);
      res.status(500).send('Failed to compose or upload image');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
