import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';
import { randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'products');
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// multer's diskStorage doesn't create its destination directory itself.
mkdirSync(UPLOAD_DIR, { recursive: true });

@Roles(['admin'])
@Controller('admin/uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) => {
          cb(
            null,
            `${randomBytes(16).toString('hex')}${extname(file.originalname)}`,
          );
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
          cb(
            new BadRequestException(
              'Only JPEG, PNG, WEBP or GIF images are allowed',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded (expected form field "file")',
      );
    }
    // Absolute URL so the frontend (a different origin) can use it directly —
    // static files are served outside the /api prefix, see main.ts.
    const url = `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
    return { url };
  }
}
