import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const UpdateUserWithAvatar = z.object({
  file: z.any().optional(),
});

export class UpdateUserWithAvatarDto extends createZodDto(
  UpdateUserWithAvatar,
) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: Express.Multer.File;
}
