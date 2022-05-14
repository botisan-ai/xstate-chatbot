import { Module } from '@nestjs/common';

import { ConfigModule, RedisModule } from 'src/modules';

import { BotActions } from './bot.actions';
import { BotController } from './bot.controller';
import { machineProviders } from './bot.machine';
import { ParserService } from './parser.service';
import { BotRunnerService } from './runner.service';
import { TrackerService } from './tracker.service';

@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [BotController],
  providers: [
    ...machineProviders,
    BotActions,
    ParserService,
    TrackerService,
    BotRunnerService,
  ],
  exports: [BotRunnerService],
})
export class BotModule {}
