import { Injectable, Logger } from '@nestjs/common';

import { BotEvent } from './machine';

@Injectable()
export class ParserService {
  private logger = new Logger(ParserService.name);

  public parseMessage(message: string): BotEvent {
    const matches = message.match(/^\/([^{]+)(\{.+\}$)?/);
    if (!matches) {
      return { type: 'unknown' };
    }
    const [, type, args] = matches;
    const result = { type, ...(args ? JSON.parse(args) : {}) };
    this.logger.debug(JSON.stringify(result));
    return result;
  }
}
