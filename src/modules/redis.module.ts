import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

import { Module as ConfigModule } from './config.module';

export const Module = RedisModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => configService.get('redis'),
  inject: [ConfigService],
});
