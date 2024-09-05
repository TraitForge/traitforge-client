import sharp from 'sharp';
import path from 'path';
import varConfig from './variablesConfig';
import { getS3Object } from './s3';

export const createGauge = async (power: number) => {
    try {
        let imagePath;
        
        switch (true) {
          case (power >= 0 && power < 3):
            imagePath = await getS3Object('gauge/0bars.png');
            break;
          case (power >= 3 && power < 6):
            imagePath = await getS3Object('gauge/0.5bars.png');
            break;
          case (power >= 6 && power < 9):
            imagePath = await getS3Object('gauge/1bars.png');
            break;
          case (power >= 9 && power < 13):
            imagePath = await getS3Object('gauge/1.5bars.png');
            break;
          case (power >= 13 && power < 16):
            imagePath = await getS3Object('gauge/2bars.png');
            break;
          case (power >= 16 && power < 19):
            imagePath = await getS3Object('gauge/2.5bars.png');
            break;
          case (power >= 19 && power < 23):
            imagePath = await getS3Object('gauge/3bars.png');
            break;
          case (power >= 23 && power < 26):
            imagePath = await getS3Object('gauge/3.5bars.png');
            break;
          case (power >= 26 && power < 29):
            imagePath = await getS3Object('gauge/4bars.png');
            break;
          case (power >= 29 && power < 33):
            imagePath = await getS3Object('gauge/4.5bars.png');
            break;
          case (power >= 33 && power < 36):
            imagePath = await getS3Object('gauge/5bars.png');
            break;
          case (power >= 36 && power < 39):
            imagePath = await getS3Object('gauge/5.5bars.png');
            break;
          case (power >= 39 && power < 43):
            imagePath = await getS3Object('gauge/6bars.png');
            break;
          case (power >= 43 && power < 46):
            imagePath = await getS3Object('gauge/6.5bars.png');
            break;
          case (power >= 46 && power <= 50):
            imagePath = await getS3Object('gauge/7bars.png');
            break;
          default:
            throw new Error('Power value out of range');
        }
    const buffer = await await sharp(imagePath as any).toBuffer();
    return buffer;
  } catch (error) {
    console.error('Failed to create gauge image:', error);
    throw error;
  }
};
