import { cBadRequestException } from './errors/bad-request.exception';
/**
 * This file was originally taken directly from:
 *   https://github.com/anatine/zod-plugins/blob/main/packages/zod-nestjs/src/lib/zod-validation-pipe.ts
 */

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

import { ZodDtoStatic } from '@anatine/zod-nestjs';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  public transform(value: unknown, metadata: ArgumentMetadata): unknown {
    const zodSchema = (metadata?.metatype as ZodDtoStatic)?.zodSchema;

    if (zodSchema) {
      const parseResult = zodSchema.safeParse(value);

      if (!parseResult.success) {
        const { error } = parseResult as any;
        const message = error.errors.map(
          (error) => `${error.path.join('.')}: ${error.message}`,
        );

        throw new cBadRequestException('INVALID_INPUT_ZOD', {
          message: message,
        });
      }

      return parseResult.data;
    }

    return value;
  }
}
