import { readdir, stat } from 'fs/promises';
import { join, basename } from 'path';
import sharp from 'sharp';

const RESOURCES_DIR = join(process.cwd(), 'public', 'resources');
const GRID_WIDTH = 960;
const GRID_QUALITY = 85;
const PLACEHOLDER_WIDTH = 24;
const PLACEHOLDER_QUALITY = 20;

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const files = await readdir(RESOURCES_DIR);
  const jpgs = files.filter((f) => f.endsWith('.jpg'));

  let processed = 0;
  let skipped = 0;
  let gridBytes = 0;
  let phBytes = 0;

  for (const file of jpgs) {
    const id = basename(file, '.jpg');
    const inputPath = join(RESOURCES_DIR, file);
    const gridPath = join(RESOURCES_DIR, `${id}-grid.webp`);
    const phPath = join(RESOURCES_DIR, `${id}-ph.webp`);

    const gridExists = await exists(gridPath);
    const phExists = await exists(phPath);

    if (gridExists && phExists) {
      skipped++;
      continue;
    }

    if (!gridExists) {
      await sharp(inputPath)
        .resize({ width: GRID_WIDTH, withoutEnlargement: true })
        .webp({ quality: GRID_QUALITY })
        .toFile(gridPath);
      gridBytes += (await stat(gridPath)).size;
    }

    if (!phExists) {
      await sharp(inputPath)
        .resize({ width: PLACEHOLDER_WIDTH, withoutEnlargement: true })
        .webp({ quality: PLACEHOLDER_QUALITY })
        .toFile(phPath);
      phBytes += (await stat(phPath)).size;
    }

    processed++;
    console.log(`Generated variants for ${id}`);
  }

  console.log('\nDone.');
  console.log(`Processed: ${processed}`);
  console.log(`Skipped (already exist): ${skipped}`);
  console.log(`New grid bytes: ${(gridBytes / 1024).toFixed(1)} KB`);
  console.log(`New placeholder bytes: ${(phBytes / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
