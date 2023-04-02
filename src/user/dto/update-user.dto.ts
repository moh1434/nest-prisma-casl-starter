import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { RegisterUserDto } from '../../auth/dto/register-user.dto';
import { IsOptional, IsString } from 'class-validator';

/**delete .file before use, .file is only for Swagger docs */
export class UpdateUserDto extends PartialType(
  OmitType(RegisterUserDto, ['password'] as const),
) {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: any;
}

export class UpdateUserWithAvatarDto extends UpdateUserDto {
  @IsOptional()
  @IsString()
  avatar?: string;
}
