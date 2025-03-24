import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateUserDto } from '.';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'email',
    'password',
    'otpCode',
    'normalizedName',
  ] as const),
) {}
