import { Inject, Injectable, Logger } from '@nestjs/common';
import { StateMachine, interpret } from 'xstate';
import { Subject } from 'rxjs';
import fetch from 'node-fetch';

import { OutgoingMessage } from './models';
import { MAIN_MACHINE } from './bot.machine';
import { TrackerService } from './tracker.service';
import { BotActions } from './bot.actions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotRunnerService {
  private logger = new Logger(BotRunnerService.name);

  private machines = new Map<string, StateMachine<any, any, any, any, any>>();

  constructor(
    private readonly configService: ConfigService,
    private readonly botActions: BotActions,
    private readonly tracker: TrackerService,
    @Inject(MAIN_MACHINE)
    private readonly mainMachine: StateMachine<any, any, any, any, any>,
  ) {
    this.machines.set('main', this.mainMachine);
  }

  process(
    namespace: string,
    sender: string,
    event: any,
  ): Subject<OutgoingMessage> {
    const dispatcher = new Subject<OutgoingMessage>();
    const machine = this.machines.get(namespace);

    this.tracker
      .fetch(namespace, sender, machine.initialState)
      .then((state) => {
        const service = interpret(
          machine.withConfig({
            actions: this.botActions.getActions(dispatcher),
          }),
          { execute: false },
        );
        service.start(state);

        // execute only the actions after starting
        service.onTransition((state) => {
          this.tracker.persist(namespace, sender, state);
          service.execute(state);
        });

        service.send({ ...event, sender });
      })
      .catch((err) => {
        this.logger.error(err.message, err.stack);
        dispatcher.complete();
      });

    return dispatcher;
  }

  run(namespace: string, sender: string, event: any): void {
    const callbackUrl = `${this.configService.get<string>(
      'bot.callbackUrl',
    )}-${namespace}`;
    this.process(namespace, sender, event).subscribe((message) => {
      fetch(callbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...message, recipient_id: sender }),
      });
    });
  }
}
