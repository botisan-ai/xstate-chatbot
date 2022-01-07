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
    senderId: string,
    value: State<any, any, any, any>,
  ): Promise<void> {
    await this.client.set(
      `${PREFIX}:${senderId}`,
      JSON.stringify(value.toJSON()),
    );
  }

  public async fetch(
    senderId: string,
  ): Promise<State<any, any, any, any> | undefined> {
    const state = await this.client.get(`${PREFIX}:${senderId}`);
    return state ? State.create(JSON.parse(state)) : undefined;
  }
}
