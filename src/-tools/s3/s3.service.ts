import { Injectable, NotFoundException } from '@nestjs/common';
import {
  S3,
  GetObjectCommand,
  HeadObjectCommand,
  GetObjectTaggingCommand,
} from '@aws-sdk/client-s3';
import { Response } from 'express';
import { OurConfigService } from '../../-global/config.service';
import { v4 as uuidv4 } from 'uuid';
import { FilePrefix } from '../../-utils/constant';
export type ReplaceFile = {
  newFile: Express.Multer.File;
  oldToDelete: string | null;
};
@Injectable()
export class S3Service {
  s3Client: S3;

  constructor(private configService: OurConfigService) {
    this.s3Client = new S3({
      credentials: {
        accessKeyId: this.configService.getConfig().S3_ACCESS_KEY,
        secretAccessKey: this.configService.getConfig().S3_SECRET_KEY,
      },
      region: this.configService.getConfig().S3_REGION,
    });
  }

  public putObject = async (
    file: Express.Multer.File,
    prefix: FilePrefix = FilePrefix.empty,
    link = uuidv4(),
  ) => {
    const prefixedLink = prefix + link;
    try {
      const s3Response = await this.s3Client.putObject({
        Bucket: this.configService.getConfig().S3_BUCKET,
        Key: prefixedLink,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      return { s3Response, prefixedLink };
    } catch (error) {
      throw error;
    }
  };

  public putBuffer = async (
    BufferFile: Buffer,
    prefix: FilePrefix = FilePrefix.empty,
    link = uuidv4(),
    mimeType = 'image/webp',
  ) => {
    try {
      const prefixedLink = prefix + link;
      const s3Response = await this.s3Client.putObject({
        Bucket: this.configService.getConfig().S3_BUCKET,
        Key: prefixedLink,
        Body: BufferFile,
        ContentType: mimeType,
      });
      return { s3Response, prefixedLink };
    } catch (error) {
      throw error;
    }
  };

  public deleteObject = async (prefixedLink: string) => {
    try {
      return await this.s3Client.deleteObject({
        Bucket: this.configService.getConfig().S3_BUCKET,
        Key: prefixedLink,
      });
    } catch (error) {
      throw error;
    }
  };
  public replaceObject = async (
    upload: ReplaceFile,
    prefix: FilePrefix = FilePrefix.empty,
  ) => {
    const { prefixedLink } = await this.putObject(upload.newFile, prefix);

    if (upload.oldToDelete) {
      await this.deleteObject(prefix + upload.oldToDelete);
    }

    return prefixedLink;
  };

  public getObject = async (prefixedLink: string) => {
    try {
      return await this.s3Client.getObject({
        Bucket: this.configService.getConfig().S3_BUCKET,
        Key: prefixedLink,
      });
    } catch (error) {
      throw error;
    }
  };

  public streamGetObject = async (
    res: Response,
    prefixedLink: string,
    cacheExpiration?: number,
    streamTags?: boolean,
  ) => {
    try {
      const params = {
        Bucket: this.configService.getConfig().S3_BUCKET,
        Key: prefixedLink,
      };

      // Head the object to get classic the bare minimum http-headers information
      const headResponse = await this.s3Client.send(
        new HeadObjectCommand(params),
      );
      res.set({
        'Content-Length': headResponse.ContentLength,
        'Content-Type': headResponse.ContentType,
        ETag: headResponse.ETag,
      });

      // Get the object taggings (optional)
      if (streamTags === true) {
        const taggingResponse = await this.s3Client.send(
          new GetObjectTaggingCommand(params),
        );
        taggingResponse.TagSet?.forEach((tag) => {
          res.set('X-TAG-' + tag.Key, tag.Value);
        });
      }

      // Prepare cache headers
      if (typeof cacheExpiration === 'number') {
        res.setHeader(
          'Cache-Control',
          'public, max-age=' + cacheExpiration / 1000,
        );
        res.setHeader(
          'Expires',
          new Date(Date.now() + cacheExpiration).toUTCString(),
        );
      } else {
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Expires', 0);
      }

      // Now get the object data and stream it
      const response = await this.s3Client.send(new GetObjectCommand(params));
      const stream = response.Body as any;
      stream?.on('data', (chunk: any) => res.write(chunk));
      stream?.once('end', () => {
        res.end();
      });
      stream?.once('error', () => {
        res.end();
      });
    } catch (err: any) {
      if (err.name === 'NotFound') throw new NotFoundException();

      throw err;
    }
  };
}
