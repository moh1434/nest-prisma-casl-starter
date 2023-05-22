import { ForbiddenError } from '@casl/ability';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { cForbiddenException } from './errors/forbidden.exception';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof ForbiddenError) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      const forbiddenException = new cForbiddenException(
        'PERMISSION_DENIED_CASL',
        {
          message: exception.message.replaceAll('"', "'"),
        },
      );

      response
        .status(forbiddenException.getStatus())
        .send(forbiddenException.getResponse());
    } else {
      super.catch(exception, host);
    }
  }
}
