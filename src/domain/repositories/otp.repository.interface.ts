import { Otp } from '@prisma/client';

import { CreateOtpDto } from 'src/presentation/dtos/otp/create.dto';

export interface IOtpRepository {
  create(createOtpDto: CreateOtpDto): Promise<Otp>;
}
