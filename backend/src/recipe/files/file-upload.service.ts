import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Express } from 'express';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = './uploads';

  constructor() {
    // Ensure the uploads directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir);
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer } = file;
    const filePath = join(this.uploadDir, `${Date.now()}_${originalname}`);
    await this.writeFile(filePath, buffer);
    return filePath;
  }

  private writeFile(filePath: string, buffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);
      writeStream.end(buffer);
    });
  }
}
