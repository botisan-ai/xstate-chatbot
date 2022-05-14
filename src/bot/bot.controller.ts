import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { reduce } from 'rxjs/operators';

import { MessageInput, ResponsePayload } from './models';
import { machineConfigMap } from './bot.machine';
import { BotRunnerService } from './runner.service';
import { ParserService } from './parser.service';

@Controller('bot')
export class BotController {
  private logger = new Logger(BotController.name);

  constructor(
    private readonly runner: BotRunnerService,
    private readonly parser: ParserService,
  ) {}

  @Get('/:namespace/config')
  botMachineConfig(@Param('namespace') namespace: string): any {
    return machineConfigMap[namespace];
  }

  @Post('/:namespace/messages')
  processMessage(
    @Param('namespace') namespace: string,
    @Body() { sender, message }: MessageInput,
  ): Observable<ResponsePayload[]> {
    this.logger.debug(JSON.stringify({ sender, message }));

    const dispatcher = this.runner.process(
      namespace,
      sender,
      this.parser.parseMessage(message),
    );

    return dispatcher.pipe(
      reduce(
        (buffer, payload: { text: string }) => [
          ...buffer,
          { ...payload, recipient_id: sender },
        ],
        [] as ResponsePayload[],
      ),
    );
  }
}
