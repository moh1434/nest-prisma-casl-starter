import { createZodDto } from '@anatine/zod-nestjs';
// import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const LoginAuthUser = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export class LoginAuthUserDto extends createZodDto(LoginAuthUser) {}
