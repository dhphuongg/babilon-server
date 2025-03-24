import { Otp, OtpType } from '@prisma/client';

import { IOtpRepository } from 'src/domain/repositories/otp.repository.interface';
import { CreateOtpDto } from 'src/presentation/dtos/request/otp/create.dto';
import { PrismaService } from '../prisma/prisma.service';

export class OtpRepository implements IOtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createOtpDto: CreateOtpDto): Promise<Otp> {
    return this.prisma.otp.create({ data: createOtpDto });
  }

  getByEmailAndType({
    email,
    type,
  }: {
    email: string;
    type: OtpType;
  }): Promise<Otp | null> {
    return this.prisma.otp.findFirst({
      where: { email, type },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteByEmailAndType({
    email,
    type,
  }: {
    email: string;
    type: OtpType;
  }): Promise<void> {
    await this.prisma.otp.deleteMany({
      where: { email, type },
    });
  }
}
