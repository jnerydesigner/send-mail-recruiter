import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const PORT = config.get('PORT');
  const logger = new Logger();
  await app.listen(PORT, () => {
    logger.log(`Server is running on http://localhost:${PORT}`);
  });
}
bootstrap();
