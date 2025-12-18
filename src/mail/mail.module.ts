import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/upload/upload.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [MailService, ConfigService, UploadService, UsersService],
  controllers: [MailController],
})
export class MailModule { }
