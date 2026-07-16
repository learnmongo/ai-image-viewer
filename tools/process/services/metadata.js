import { exiftool } from 'exiftool-vendored';
import { join } from 'path';
import { ASSETS_DIR } from '../config.js';

/**
 * Extracts GPS data from image EXIF metadata
 * @param {string} imageName - Name of the image file
 * @returns {Promise<Object|null>} GPS location data or null if not available
 */
export const getGPSData = async (imageName) => {
  const imagePath = join(ASSETS_DIR, imageName);

  try {
    const tags = await exiftool.read(imagePath);
    await exiftool.end();

    if (tags.GPSLatitude && tags.GPSLongitude) {
      return {
        type: 'Point',
        coordinates: [tags.GPSLongitude, tags.GPSLatitude, tags.GPSAltitude || 0],
      };
    }

    return null;
  } catch (error) {
    console.error(`⚠️  Error reading EXIF data from ${imageName}:`, error.message);
    return null;
  }
};
