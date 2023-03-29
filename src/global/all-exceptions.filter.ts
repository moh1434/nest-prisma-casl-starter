import { ForbiddenError } from '@casl/ability';
import { Catch, ArgumentsHost, ForbiddenException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof ForbiddenError) {
      const ForbiddenExceptionData = new ForbiddenException(exception.message);
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      response.send(ForbiddenExceptionData.getResponse());
    }
    super.catch(exception, host);
  }
}
