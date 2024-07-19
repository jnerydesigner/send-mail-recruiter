import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Replacement } from './mail.controller';

@Injectable()
export class MailService {
  constructor(private readonly mailSendService: MailerService) {}
  async loadCurriculo() {
    const pathToCurriculo = path.join(
      'src',
      'assets',
      'curriculo',
      'curriculo.pdf',
    );
    try {
      const curriculo = await fs.readFile(pathToCurriculo, 'utf8');
      return curriculo;
    } catch (e) {
      console.log(e);
    }
  }

  async loadTemplate(templateName: string) {
    await this.loadCurriculo();
    const pathToTemplate = path.join(
      'src',
      'assets',
      'template',
      `${templateName}.html`,
    );
    try {
      const template = await fs.readFile(pathToTemplate, 'utf8');
      return template;
    } catch (e) {
      console.log(e);
    }
  }

  async sendMail(replacements: Replacement) {
    const emailContent = await this.loadTemplate('mail-recruiter');

    let updatedContent = emailContent;

    for (const [key, value] of replacements) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      updatedContent = updatedContent.replace(regex, value);
    }

    await this.mailSendService.sendMail({
      from: 'Jander Nery <jander.webmaster@gmail.com>',
      to: 'jander.webmaster@gmail.com',
      subject: `How to Send Emails with Nodemailer`,
      html: updatedContent,
      attachments: [
        {
          filename: 'curriculo.pdf',
          path: path.join('src', 'assets', 'curriculo', 'curriculo.pdf'),
        },
      ],
    });
  }
}
