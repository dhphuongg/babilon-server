import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DomainModule } from '../domain/domain.module';
import { ApplicationModule } from '../application/application.module';
import { HttpControllers } from './controllers';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [CqrsModule, InfrastructureModule, DomainModule, ApplicationModule],
  controllers: [...HttpControllers],
  providers: [],
})
export class PresentationModule {}
