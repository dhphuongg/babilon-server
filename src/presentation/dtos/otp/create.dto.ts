import { OtpType } from '@prisma/client';

export class CreateOtpDto {
  readonly code: string;
  readonly email: string;
  readonly type: OtpType;
  readonly expiresAt: Date;
}
