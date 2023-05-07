import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterAuthUserDto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: any;
}
