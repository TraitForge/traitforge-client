import sharp from 'sharp';
import path from 'path';
import varConfig from './variablesConfig';

export const createGauge = async (power: number) => {
    try {
        let imagePath;
        
        switch (true) {
          case (power >= 0 && power < 3):
            imagePath = path.join(varConfig.variablesPath, 'gauge/0bars.png');
            break;
          case (power >= 3 && power < 6):
            imagePath = path.join(varConfig.variablesPath, 'gauge/0.5bars.png');
            break;
          case (power >= 6 && power < 9):
            imagePath = path.join(varConfig.variablesPath, 'gauge/1bars.png');
            break;
          case (power >= 9 && power < 13):
            imagePath = path.join(varConfig.variablesPath, 'gauge/1.5bars.png');
            break;
          case (power >= 13 && power < 16):
            imagePath = path.join(varConfig.variablesPath, 'gauge/2bars.png');
            break;
          case (power >= 16 && power < 19):
            imagePath = path.join(varConfig.variablesPath, 'gauge/2.5bars.png');
            break;
          case (power >= 19 && power < 23):
            imagePath = path.join(varConfig.variablesPath, 'gauge/3bars.png');
            break;
          case (power >= 23 && power < 26):
            imagePath = path.join(varConfig.variablesPath, 'gauge/3.5bars.png');
            break;
          case (power >= 26 && power < 29):
            imagePath = path.join(varConfig.variablesPath, 'gauge/4bars.png');
            break;
          case (power >= 29 && power < 33):
            imagePath = path.join(varConfig.variablesPath, 'gauge/4.5bars.png');
            break;
          case (power >= 33 && power < 36):
            imagePath = path.join(varConfig.variablesPath, 'gauge/5bars.png');
            break;
          case (power >= 36 && power < 39):
            imagePath = path.join(varConfig.variablesPath, 'gauge/5.5bars.png');
            break;
          case (power >= 39 && power < 43):
            imagePath = path.join(varConfig.variablesPath, 'gauge/6bars.png');
            break;
          case (power >= 43 && power < 46):
            imagePath = path.join(varConfig.variablesPath, 'gauge/6.5bars.png');
            break;
          case (power >= 46 && power <= 50):
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
