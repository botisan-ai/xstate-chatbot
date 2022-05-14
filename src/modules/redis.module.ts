import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { ConfigModule } from 'src/modules';

export const Module: DynamicModule = RedisModule.forRootAsync(
  {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => configService.get('redis'),
    inject: [ConfigService],
  },
  false,
);
