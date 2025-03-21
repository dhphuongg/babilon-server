import { PrismaService } from '../prisma/prisma.service';
import { OtpRepository } from '../repositories/otp.repository';

export const OTP_REPOSITORY_TOKEN = 'OTP_REPOSITORY_TOKEN';

export const OtpRepositoryProvider = {
  provide: OTP_REPOSITORY_TOKEN,
  useFactory: (prismaProvider: PrismaService) => {
    return new OtpRepository(prismaProvider);
  },
  inject: [PrismaService],
};
