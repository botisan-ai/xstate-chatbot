import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { State } from 'xstate';

const PREFIX = 'state';

@Injectable()
export class StorageService {
  private logger = new Logger(StorageService.name);
  private client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient('tracker');
  }

  public async persist(
    sender: string,
    value: State<any, any, any, any>,
  ): Promise<void> {
    await this.client.xadd(
      `${PREFIX}:${sender}`,
      '*',
      'state',
      JSON.stringify(value),
    );
  }

  public async fetch(
    sender: string,
    defaultState?: State<any, any, any, any>,
  ): Promise<State<any, any, any, any> | undefined> {
    const item = await this.client.xrange(
      `${PREFIX}:${sender}`,
      '-',
      '+',
      'COUNT',
      1,
    );

    if (item.length === 0) {
      return defaultState;
    }

    const [, state] = item[0][1];
    try {
      return state ? State.create(JSON.parse(state)) : defaultState;
    } catch (err) {
      this.logger.error(`error getting state: ${err.message}`);
      console.error(err);
      return defaultState;
    }
  }
}
