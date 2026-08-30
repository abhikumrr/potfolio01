import fs from 'fs';
import path from 'path';

export interface Biodata {
  Name?: string;
  Age?: string;
  Height?: string;
  Location?: string;
  Nationality?: string;
  "Eye Color"?: string;
  "Hair Color"?: string;
  "Shoe Size"?: string;
  Chest?: string;
  Waist?: string;
  Hips?: string;
  Experience?: string;
  Agency?: string;
  Specialties?: string;
  [key: string]: string | undefined;
}

export function getBiodata(): Biodata {
  const filePath = path.join(process.cwd(), 'public', 'biodata', 'text.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const lines = fileContent.split('\n');
  const data: Biodata = {};

  for (const line of lines) {
    if (!line.trim()) continue;
    // Split by tab, or double spaces
    const parts = line.split('\t');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('\t').trim();
      if (key && value) {
        data[key] = value;
      }
    }
  }

  return data;
}
