import sharp from 'sharp';
import path from 'path';
import varConfig from './variablesConfig';

export const createGauge = async (power: number) => {
    try {
        let imagePath;
        
        switch (true) {
          case (power >= 0 && power < 3.33):
            imagePath = path.join(varConfig.variablesPath, 'gauge/0bars.png');
            break;
          case (power >= 3.33 && power < 6.66):
            imagePath = path.join(varConfig.variablesPath, 'gauge/0.5bars.png');
            break;
          case (power >= 6.66 && power < 9.99):
            imagePath = path.join(varConfig.variablesPath, 'gauge/1bars.png');
            break;
          case (power >= 9.99 && power < 13.32):
            imagePath = path.join(varConfig.variablesPath, 'gauge/1.5bars.png');
            break;
          case (power >= 13.32 && power < 16.65):
            imagePath = path.join(varConfig.variablesPath, 'gauge/2bars.png');
            break;
          case (power >= 16.65 && power < 19.98):
            imagePath = path.join(varConfig.variablesPath, 'gauge/2.5bars.png');
            break;
          case (power >= 19.98 && power < 23.31):
            imagePath = path.join(varConfig.variablesPath, 'gauge/3bars.png');
            break;
          case (power >= 23.31 && power < 26.64):
            imagePath = path.join(varConfig.variablesPath, 'gauge/3.5bars.png');
            break;
          case (power >= 26.64 && power < 29.97):
            imagePath = path.join(varConfig.variablesPath, 'gauge/4bars.png');
            break;
          case (power >= 29.97 && power < 33.3):
            imagePath = path.join(varConfig.variablesPath, 'gauge/4.5bars.png');
            break;
          case (power >= 33.3 && power < 36.63):
            imagePath = path.join(varConfig.variablesPath, 'gauge/5bars.png');
            break;
          case (power >= 36.63 && power < 39.96):
            imagePath = path.join(varConfig.variablesPath, 'gauge/5.5bars.png');
            break;
          case (power >= 39.96 && power < 43.29):
            imagePath = path.join(varConfig.variablesPath, 'gauge/6bars.png');
            break;
          case (power >= 43.29 && power < 46.62):
            imagePath = path.join(varConfig.variablesPath, 'gauge/6.5bars.png');
            break;
          case (power >= 46.62 && power <= 50):
            imagePath = path.join(varConfig.variablesPath, 'gauge/7bars.png');
            break;
          default:
            throw new Error('Power value out of range');
        }
    const buffer = await sharp(imagePath).png().toBuffer();
    return buffer;
  } catch (error) {
    console.error('Failed to create gauge image:', error);
    throw error;
  }
};
