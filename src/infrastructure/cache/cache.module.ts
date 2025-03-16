import { createKeyv } from '@keyv/redis';
import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentConfig } from '../config/environment.config';

@Module({
  imports: [
    CacheManagerModule.registerAsync({
      isGlobal: true,
      useFactory: async (
        configService: ConfigService<EnvironmentConfig, true>,
      ) => ({
        stores: [
          createKeyv({
            socket: {
              host: configService.get('redis.host', { infer: true }),
              port: configService.get('redis.port', { infer: true }),
            },
            password: configService.get('redis.password', { infer: true }),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CacheModule {}
