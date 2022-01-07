import { registerAs } from '@nestjs/config';
import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

export default registerAs(
  'redis',
  () =>
    ({
      closeClient: true,
      commonOptions: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD,
      },
      config: [
        {
          namespace: 'tracker',
          db: Number(process.env.REDIS_TRACKER_DB || 0),
        },
      ],
    } as RedisModuleOptions),
);
