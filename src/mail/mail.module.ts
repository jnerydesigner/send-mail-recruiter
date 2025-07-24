import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/upload/upload.service';

@Module({
  providers: [MailService, ConfigService, UploadService],
  controllers: [MailController],
})
export class MailModule {}
