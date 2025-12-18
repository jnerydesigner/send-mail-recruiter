import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get<number>('PORT', 3000);
  const logger = new Logger();
  await app.listen(PORT, () => {
    logger.log(`Server is running on http://localhost:${PORT}`);
  });
}
bootstrap();
