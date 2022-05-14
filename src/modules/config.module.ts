import { ConfigModule } from '@nestjs/config';

import serverConfig from 'src/config/server';
import redisConfig from 'src/config/redis';
import botConfig from 'src/config/bot';

const ENV = process.env.NODE_ENV;

export const Module = ConfigModule.forRoot({
  // mimic behaviors from nextjs
  envFilePath: [`.env.${ENV}.local`, `.env.${ENV}`, `.env.local`, '.env'],
  load: [serverConfig, redisConfig, botConfig],
});
