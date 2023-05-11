import { createZodDto } from '@anatine/zod-nestjs';

import { z } from 'zod';
export const createPost = z.object({
  content: z.string().min(5),
});

export class CreatePostDto extends createZodDto(createPost) {}
