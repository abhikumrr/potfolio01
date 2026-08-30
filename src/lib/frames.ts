import fs from 'fs';
import path from 'path';

export function getFramePaths(): string[] {
  const sequenceDir = path.join(process.cwd(), 'public', 'sequence');
  try {
    const files = fs.readdirSync(sequenceDir);
    const webpFiles = files
      .filter((file) => file.endsWith('.webp'))
      .sort(); // String sort works since they are zero-padded

    return webpFiles.map((file) => `/sequence/${file}`);
  } catch (error) {
    console.warn("Could not read sequence directory:", error);
    return [];
  }
}
