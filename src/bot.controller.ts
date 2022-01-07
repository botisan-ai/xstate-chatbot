import { Body, Controller, Post, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { reduce } from 'rxjs/operators';

import { LogicService, ChannelService } from './logic';
import { ParserService } from './logic/parser.service';
import { MessageInput, ResponsePayload } from './models';

@Controller({
  scope: Scope.REQUEST,
})
export class BotController {
  constructor(
    private readonly logicService: LogicService,
    private readonly parser: ParserService,
    private readonly channel: ChannelService,
  ) {}

  @Post('/messages')
  processMessage(
    @Body() { sender, message }: MessageInput,
  ): Observable<ResponsePayload[]> {
    this.logicService.process(sender, this.parser.parseMessage(message));
    return this.channel.pipe(
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
