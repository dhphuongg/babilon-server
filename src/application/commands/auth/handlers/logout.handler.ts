import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LogoutCommand } from '../implements';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  async execute(command: LogoutCommand) {
    const { studentCode } = command;

    // Remove token from cache
    await this.cacheService.del(`ACCESS_TOKEN:${studentCode}`);

    return { message: 'Đăng xuất thành công' };
  }
}
