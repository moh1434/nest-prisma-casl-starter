import { OmitType, PartialType } from '@nestjs/swagger';
import { RegisterUserDto } from '../../auth/dto/create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(RegisterUserDto, ['password'] as const),
) {}
