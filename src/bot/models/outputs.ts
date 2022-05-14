export interface OutgoingMessage {
  text: string;
  buttons?: Array<{
    title: string;
    payload: string;
  }>;
  image?: string;
  custom?: any;
}

export class ResponsePayload implements OutgoingMessage {
  recipient_id: string;

  text: string;
  buttons?: Array<{
    title: string;
    payload: string;
  }>;
  image?: string;
  custom?: any;
}
