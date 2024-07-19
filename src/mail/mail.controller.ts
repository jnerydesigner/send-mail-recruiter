import { Body, Controller, Post, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendMail(@Res() response: Response, @Body() body: MailRequest) {
    const replacements: Replacement = [
      ['user', 'Jander Nery'],
      ['company', body.company],
      ['recruiter', body.nameRecruiter],
      ['vacancy', body.vacancy],
      ['habilities', body.vacancy],
      ['saudation', this.saudation()],
    ];

    const send = this.mailService.sendMail(replacements, body);

    return response.status(200).json({
      message: 'Mail sent successfully',
      data: send,
    });
  }

  saudation() {
    const now = new Date();
    const hour = now.getHours();

    let saudation: string;

    if (hour >= 6 && hour < 12) {
      saudation = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      saudation = 'Boa tarde';
    } else {
      saudation = 'Boa noite';
    }

    return saudation;
  }
}

export type Replacement = [
  'user' | 'company' | 'recruiter' | 'vacancy' | 'habilities' | 'saudation',
  string,
][];

export type MailRequest = {
  to: string;
  company: string;
  vacancy: string;
  nameRecruiter: string;
  skills: string;
};
