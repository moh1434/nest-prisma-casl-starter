import { ForbiddenError } from '@casl/ability';
import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { cForbiddenException } from './errors/forbidden.exception';
import { Response } from 'express';
import { cInternalServerErrorException } from './errors/internal-server-error.exception';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof ForbiddenError) {
      const forbiddenException = new cForbiddenException(
        'PERMISSION_DENIED_CASL',
        {
          message: exception.message.replaceAll('"', "'"),
        },
      );

      return response
        .status(forbiddenException.getStatus())
        .send(forbiddenException.getResponse());
    } else if (!(exception instanceof HttpException)) {
      const Exception = new cInternalServerErrorException('SERVER_ERROR', {
        message: 'unknown error',
      });

      return response
        .status(Exception.getStatus())
        .send(Exception.getResponse());
    }

    return super.catch(exception, host);
  }
}
