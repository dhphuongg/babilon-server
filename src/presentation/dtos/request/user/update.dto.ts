import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

import { CreateUserDto } from '.';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'email',
    'password',
    'otpCode',
    'normalizedName',
    'avatar',
  ] as const),
) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  avatar?: Express.Multer.File;
}
