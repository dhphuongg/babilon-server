import { Otp, OtpType } from '@prisma/client';

import { CreateOtpDto } from 'src/presentation/dtos/request/otp/create.dto';

export interface IOtpRepository {
  create(createOtpDto: CreateOtpDto): Promise<Otp>;
  getByEmailAndType(_: { email: string; type: OtpType }): Promise<Otp | null>;
  deleteByEmailAndType(_: { email: string; type: OtpType }): Promise<void>;
}
