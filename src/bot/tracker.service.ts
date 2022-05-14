import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { State } from 'xstate';

const PREFIX = 'botState';

@Injectable()
export class TrackerService {
  private logger = new Logger(TrackerService.name);
  private client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  public async persist(
    namespace: string,
    sender: string,
    value: State<any, any, any, any, any>,
  ): Promise<void> {
    await this.client.xadd(
      `${PREFIX}:${namespace}:${sender}`,
      'MAXLEN',
      '~',
      100,
      '*',
      'state',
      JSON.stringify(value),
    );
  }

  public async fetch(
    namespace: string,
    sender: string,
    defaultState?: State<any, any, any, any, any>,
  ): Promise<State<any, any, any, any, any> | undefined> {
    const item = await this.client.xrevrange(
      `${PREFIX}:${namespace}:${sender}`,
      '+',
      '-',
      'COUNT',
      1,
    );

    if (item.length === 0) {
      return defaultState;
    }

    const [, state] = item[0][1];
    try {
      const stateJson = JSON.parse(state);
      stateJson.actions = [];
      return state ? State.create(stateJson) : defaultState;
    } catch (err) {
      this.logger.error(`error getting state: ${err.message}`, err);
      return defaultState;
    }
  }
}
