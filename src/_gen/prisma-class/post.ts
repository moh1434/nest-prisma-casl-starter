import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Post {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: Boolean })
  isPublished: boolean;

  @ApiProperty({ type: String })
  authorId: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;
}
