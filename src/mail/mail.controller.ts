import { Body, Controller, Post, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';
import { MailRequest } from './mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendMail(@Res() response: Response, @Body() body: MailRequest) {
    const send = this.mailService.sendMail(body);

    return response.status(200).json({
      message: 'Mail sent successfully',
      data: send,
    });
  }

  @Post('base64')
  async createBase64() {
    return this.mailService.generateDownloadUrl();
  }
}
