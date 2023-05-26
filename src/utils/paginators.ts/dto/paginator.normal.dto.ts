import { createZodDto } from '@anatine/zod-nestjs';

import { z } from 'zod';
export const normalPaginator = z.object({
  page: z.string().regex(/^\d+$/).min(1),
  perPage: z.string().regex(/^\d+$/).min(1),
});

export class PaginatorDto extends createZodDto(normalPaginator) {}
