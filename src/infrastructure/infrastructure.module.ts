import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { WebSocketModule } from './websocket/websocket.module';
import { RepositoryProviders } from './providers';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    CacheModule,
    AuthModule,
    AppConfigModule,
    PrismaModule,
    MailModule,
    WebSocketModule,
  ],
  providers: [...RepositoryProviders],
  exports: [
    ...RepositoryProviders,
    MailModule,
    AuthModule,
    PrismaModule,
    AppConfigModule,
    WebSocketModule,
  ],
})
export class InfrastructureModule {}
