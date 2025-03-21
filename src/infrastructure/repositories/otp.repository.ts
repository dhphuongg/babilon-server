import { Otp } from '@prisma/client';

import { IOtpRepository } from 'src/domain/repositories/otp.repository.interface';
import { CreateOtpDto } from 'src/presentation/dtos/otp/create.dto';
import { PrismaService } from '../prisma/prisma.service';

export class OtpRepository implements IOtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createOtpDto: CreateOtpDto): Promise<Otp> {
    return this.prisma.otp.create({ data: createOtpDto });
  }
}
