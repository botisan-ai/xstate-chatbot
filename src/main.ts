import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { BotModule } from './bot';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(BotModule);
  app.enableCors();
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);

  const configService: ConfigService = app.get(ConfigService);

  const port = configService.get('server.port');
  await app.listen(port, '0.0.0.0');
  logger.log(`server started listening at 0.0.0.0:${port}`);
}

bootstrap();
