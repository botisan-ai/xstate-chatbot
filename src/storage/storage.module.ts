import { Module } from '@nestjs/common';
import { RedisModule } from 'src/modules';

import { StorageService } from './storage.service';

@Module({
  imports: [RedisModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
