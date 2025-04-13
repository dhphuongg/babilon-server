import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { WebSocketModule } from './websocket/websocket.module';
import { RepositoryProviders } from './providers';
import { CacheModule } from './cache/cache.module';
import { FcmModule } from './fcm/fcm.module';
import { CloudStorageModule } from './cloud-storage/cloud-storage.module';

@Module({
  imports: [
    CacheModule,
    AuthModule,
    AppConfigModule,
    PrismaModule,
    MailModule,
    WebSocketModule,
    FcmModule,
    CloudStorageModule.forRoot({
      type: 'cloudinary',
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    }),
  ],
  providers: [...RepositoryProviders],
  exports: [
    ...RepositoryProviders,
    MailModule,
    AuthModule,
    PrismaModule,
    AppConfigModule,
    WebSocketModule,
    FcmModule,
  ],
})
export class InfrastructureModule {}
