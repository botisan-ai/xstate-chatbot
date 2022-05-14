import { registerAs } from '@nestjs/config';

export default registerAs('bot', () => ({
  callbackUrl: process.env.BOT_CALLBACK_URL,
}));
