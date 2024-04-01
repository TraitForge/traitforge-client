import { composeIMG } from '@/utils/imageProcessing';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { entityEntropy, entityGeneration } = req.query;
    try {
      const imageBuffer = await composeIMG(entityEntropy, entityGeneration);
      if (imageBuffer) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.status(200).send(imageBuffer);
      } else {
        throw new Error('Image Layering Failed');
      }
    } catch (error) {
      console.error('Failed to generate:', error);
      res.status(500).send('Failed to compose image');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
