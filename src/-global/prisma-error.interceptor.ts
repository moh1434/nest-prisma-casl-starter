import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, catchError } from 'rxjs';
import { cConflictException } from './exceptions/conflict.exception';
import { cNotFoundException } from './exceptions/not-found.exception';
import { cInternalServerErrorException } from './exceptions/internal-server-error.exception';

@Injectable()
export class PrismaErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error({
            code: error.code,
            message: this.exceptionShortMessage(error.message),
          });

          if (error.code === 'P2002') {
            // unique failed
            throw new cConflictException('ALREADY_EXISTS');
          }
          if (error.code == 'P2025') {
            const cause =
              (error?.meta?.cause as string) ??
              this.exceptionShortMessage(error.message); // findUniqueOrThrow() error not have error.meta.cause;

            throw new cNotFoundException('NOT_FOUND', undefined, `${cause}`);
          }
          if (error.code == 'P2003') {
            throw new cInternalServerErrorException('FOREIGN_KEY_FAILED');
          }
        }
        throw error;
      }),
    );
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));
    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}
