import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: Number(process.env.PORT || 3000),
}));
