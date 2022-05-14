import { registerAs } from '@nestjs/config';
import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

export default registerAs(
  'redis',
  () =>
    ({
      readyLog: true,
      closeClient: true,
      config: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD || 'chatOperator',
        db: Number(process.env.REDIS_DB || 0),
      },
    } as RedisModuleOptions),
);
