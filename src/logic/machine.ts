import { Provider, Scope } from '@nestjs/common';
import { MachineConfig, MachineOptions } from 'xstate';

import { ChannelService } from './channel.service';

export type UnknownEvent = { type: 'unknown' };

export type GreetEvent = {
  type: 'greet';
  welcome_code: string;
  scene: string;
  scene_param?: string;
};

export type FileUploadedEvent = { type: 'file_uploaded'; file_url: string };

export type BotEvent = UnknownEvent | GreetEvent | FileUploadedEvent;

export interface BotContext {
  sender_id: string;
}

export const botMachine: MachineConfig<BotContext, any, BotEvent> = {
  id: 'bot',
  initial: 'idle',
  states: {
    idle: {
      on: {
        greet: {
          actions: ['utter_introduction', 'action_listen'],
        },
        file_uploaded: {
          actions: ['utter_uploaded', 'action_listen'],
        },
        '*': {
          actions: ['utter_ask_rephrase', 'action_listen'],
        },
      },
    },
  },
};

export const MACHINE_OPTIONS = Symbol.for('MACHINE_OPTIONS');

export const machineOptionsProvider: Provider<
  Partial<MachineOptions<BotContext, BotEvent>>
> = {
  provide: MACHINE_OPTIONS,
  scope: Scope.REQUEST,
  useFactory: (channel: ChannelService) => {
    return {
      actions: {
        utter_introduction: (context: BotContext, event: GreetEvent) => {
          channel.next({
            text: 'Hello!',
            custom: {
              welcome_code: event.welcome_code,
            },
          });
        },
        utter_uploaded: (context: BotContext, event: FileUploadedEvent) => {
          channel.next({
            text: 'File uploaded!',
          });
        },
        utter_ask_rephrase: (context: BotContext, event: UnknownEvent) => {
          channel.next({
            text: "Sorry, I didn't understand that. Could you say that again?",
          });
        },
        action_listen: (context: BotContext, event: BotEvent) => {
          channel.complete();
        },
      },
    };
  },
  inject: [ChannelService],
};
