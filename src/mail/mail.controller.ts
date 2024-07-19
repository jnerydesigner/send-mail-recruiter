import { Body, Controller, Post, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendMail(@Res() response: Response, @Body() body: MailRequest) {
    console.log(body);
    const replacements: Replacement = [
      ['user', 'Jander Nery'],
      ['company', body.company],
      ['recruiter', body.nameRecruiter],
      ['vacancy', body.vacancy],
      ['habilities', body.vacancy],
    ];

    const send = this.mailService.sendMail(replacements);

    return response.status(200).json({
      message: 'Mail sent successfully',
      data: send,
    });
  }
}

export type Replacement = [
  'user' | 'company' | 'recruiter' | 'vacancy' | 'habilities',
  string,
][];

export type MailRequest = {
  to: string;
  company: string;
  vacancy: string;
  nameRecruiter: string;
  skills: string;
};
