import { composeIMG } from '@/utils/imageProcessing';
import s3 from '@/aws-config';

async function uploadToS3(imageBuffer, fileName) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: imageBuffer,
        ContentType: 'image/jpeg'
    };

    return s3.upload(params).promise();
}

async function generateUri(entityEntropy, entityGeneration) {
  const paddedEntropy = entityEntropy.toString().padStart(6, '0');
  return `${paddedEntropy}_${entityGeneration}.jpeg`;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
      const { entityEntropy, entityGeneration } = req.query;

      try {
          const imageBuffer = await composeIMG(entityEntropy, entityGeneration);
          if (imageBuffer) {
              const uri = await generateUri(entityEntropy, entityGeneration);
              const fileName = `${uri}`;
              await uploadToS3(imageBuffer, fileName);

              res.setHeader('Content-Type', 'text/plain');
              res.status(200).send(`https://traitforge.s3.amazonaws.com/${fileName}`);
          } else {
              throw new Error('Image Layering Failed');
          }
      } catch (error) {
          console.error('Failed to generate or upload:', error);
          res.status(500).send('Failed to compose or upload image');
      }
  } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}