import { Controller, Get, Param, Res } from '@nestjs/common';
import { S3Service } from './s3.service';
import { Response } from 'express';
import { Request, Route } from 'tsoa';

@Route('s3')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get('image/:key')
  async getImage(
    @Request() @Param('key') key: string,
    @Request() @Res() res: Response,
  ) {
    return await this.s3Service.streamGetObject(res, key);
  }
}
