import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileMetaDto } from './dto/fileMeta.dto';
import { SignedUrlDto } from './dto/signedUrl.dto';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { Request } from 'express';
import * as mime from 'mime-types';
const csprng = require('csprng');

@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  async getSignedUrlForUpload(
    @Req() request: Request,
    @Body() file: FileMetaDto,
  ): Promise<SignedUrlDto> {
    const { userId } = request.user;
    const seed = csprng(80, 36);
    const fileExtension = mime.extension(file.contentType);

    if (!fileExtension) {
      throw new Error('Invalid mimetype');
    }

    const fileName = [
      Buffer.from(`${userId}:${seed}`)
        .toString('base64')
        .replace('+', '-')
        .replace('/', '_'),
      '.',
      fileExtension,
    ].join('');
    const url = await this.storageService.getSignedUrl(
      fileName,
      file.contentType,
    );
    const dto: SignedUrlDto = { fileName, url };
    return dto;
  }
}
