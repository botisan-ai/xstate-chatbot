import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { assign } from 'xstate';

import { BotContext, BotEvent } from './bot.interface';
import { OutgoingMessage } from './models';

@Injectable()
export class BotActions {
  utterIntroduction(
    dispatcher: Subject<OutgoingMessage>,
    context: BotContext,
    event: BotEvent,
  ): void {
    return dispatcher.next({
      text: 'Hello!',
    });
  }

  utterAskRephrase(
    dispatcher: Subject<OutgoingMessage>,
    context: BotContext,
    event: BotEvent,
  ): void {
    return dispatcher.next({
      text: "Sorry, I didn't understand that. Could you say that again?",
    });
  }

  async listen(
    dispatcher: Subject<OutgoingMessage>,
    context: BotContext,
    event: BotEvent,
  ): Promise<void> {
    return dispatcher.complete();
  }

  public getActions(dispatcher: Subject<OutgoingMessage>) {
    return {
      utter_introduction: this.utterIntroduction.bind(this, dispatcher),
      utter_ask_rephrase: this.utterAskRephrase.bind(this, dispatcher),
      action_listen: this.listen.bind(this, dispatcher),
      assign_sender: assign((context, event) => ({
        sender: (event as any).sender,
      })),
    };
  }
}
