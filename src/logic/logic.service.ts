import { Inject, Injectable, Scope } from '@nestjs/common';
import { StorageService } from 'src/storage';
import {
  StateMachine,
  Interpreter,
  MachineOptions,
  createMachine,
  interpret,
} from 'xstate';

import { BotContext, BotEvent, botMachine, MACHINE_OPTIONS } from './machine';

@Injectable({
  scope: Scope.REQUEST,
})
export class LogicService {
  private machine: StateMachine<BotContext, any, BotEvent>;
  private service: Interpreter<BotContext, any, BotEvent>;

  constructor(
    private readonly storage: StorageService,
    @Inject(MACHINE_OPTIONS)
    options: Partial<MachineOptions<BotContext, BotEvent>>,
  ) {
    this.machine = createMachine(botMachine, options);
    this.service = interpret(this.machine, { execute: false });
  }

  async process(sender: string, event: BotEvent): Promise<void> {
    const state = await this.storage.fetch(sender, this.machine.initialState);
    this.service.start(state);
    this.service.send(event);
    this.service.execute(this.service.state);
    return this.storage.persist(sender, this.service.state);
  }
}
