import { Module } from '@nestjs/common';

import { StorageModule } from 'src/storage';

import { LogicService } from './logic.service';
import { ParserService } from './parser.service';
import { ChannelService } from './channel.service';
import { machineOptionsProvider } from './machine';

@Module({
  imports: [StorageModule],
  providers: [
    LogicService,
    ParserService,
    ChannelService,
    machineOptionsProvider,
  ],
  exports: [LogicService, ParserService, ChannelService],
})
export class LogicModule {}
