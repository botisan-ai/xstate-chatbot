import { Module } from '@nestjs/common';

import { LogicModule } from './logic';
import { BotController } from './bot.controller';

@Module({
  imports: [LogicModule],
  controllers: [BotController],
  providers: [],
})
export class BotModule {}
