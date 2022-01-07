import { Injectable, Scope } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable({
  scope: Scope.REQUEST,
})
export class ChannelService extends Subject<any> {}
