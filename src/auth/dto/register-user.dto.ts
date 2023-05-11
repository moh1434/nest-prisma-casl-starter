import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const RegisterAuthUser = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  file: z.any().optional(),
});

export class RegisterAuthUserDto extends createZodDto(RegisterAuthUser) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: Express.Multer.File;
}
