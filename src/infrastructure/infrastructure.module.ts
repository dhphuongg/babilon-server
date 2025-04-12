import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { WebSocketModule } from './websocket/websocket.module';
import { RepositoryProviders } from './providers';
import { CacheModule } from './cache/cache.module';
import { FcmModule } from './fcm/fcm.module';
import { ImageKitModule } from './image-kit/image-kit.module';

@Module({
  imports: [
    CacheModule,
    AuthModule,
    AppConfigModule,
    PrismaModule,
    MailModule,
    WebSocketModule,
    FcmModule,
    ImageKitModule,
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
    ImageKitModule,
  ],
})
export class InfrastructureModule {}
