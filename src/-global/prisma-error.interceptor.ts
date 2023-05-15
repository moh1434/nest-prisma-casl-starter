import {
  NotFoundException,
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, catchError } from 'rxjs';

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
            throw new ConflictException();
          }
          if (error.code == 'P2025') {
            const cause =
              (error?.meta?.cause as string) ??
              this.exceptionShortMessage(error.message); // findUniqueOrThrow() error not have error.meta.cause;

            throw new NotFoundException(`${cause}`);
          }
          if (error.code == 'P2003') {
            throw new ConflictException('foreign key failed');
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
