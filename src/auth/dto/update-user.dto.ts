import { IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**delete .file before use, .file is only for Swagger docs */
export class UpdateUserWithAvatarDto {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: any;
}
