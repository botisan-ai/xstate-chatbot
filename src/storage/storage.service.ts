import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { State } from 'xstate';

const PREFIX = 'state';

@Injectable()
export class StorageService {
  private client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient('tracker');
  }

  public async persist(
    sender: string,
    value: State<any, any, any, any>,
  ): Promise<void> {
    await this.client.set(`${PREFIX}:${sender}`, JSON.stringify(value));
  }

  public async fetch(
    sender: string,
    defaultState?: State<any, any, any, any>,
  ): Promise<State<any, any, any, any> | undefined> {
    const state = await this.client.get(`${PREFIX}:${sender}`);
    return state ? State.create(JSON.parse(state)) : defaultState;
  }
}
