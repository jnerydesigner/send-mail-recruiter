import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { MailRequest, Replacement } from './mail.dto';

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

  async sendMail(input: MailRequest) {
    const skills = input.skills
      .trim()
      .replace(/,$/, '')
      .replace(/,(\S)/g, ', $1')
      .trim();

    const replacements: Replacement = [
      ['user', 'Jander Nery'],
      ['company', input.company],
      ['recruiter', input.nameRecruiter],
      ['vacancy', input.vacancy],
      ['habilities', skills],
      ['githubAvatar', input.githubAvatar],
      ['nameFull', input.nameFull],
      ['specialty', input.specialty],
      ['saudation', this.saudation()],
    ];
    console.log(replacements);
    const emailContent = await this.loadTemplate('mail-recruiter');
    console.log(input.skills);

    let updatedContent = emailContent;

    for (const [key, value] of replacements) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      updatedContent = updatedContent.replace(regex, value);
    }

    // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const previewFile = `./src/assets/email_preview.html`;

    try {
      await fs.writeFile(previewFile, updatedContent);
      console.log(`Template salvo em: ${previewFile}`);

      console.log('Por favor, verifique o arquivo antes de continuar');
    } catch (error) {
      console.error('Erro ao salvar o preview:', error);
    }

    try {
      await this.mailSendService.sendMail({
        from: 'Jander Nery <jander.webmaster@gmail.com>',
        to: input.to,
        subject: `Vaga - ${input.vacancy} - Jander da Costa Nery`,
        cc: 'Jander Nery <jander.webmaster@gmail.com>',
        html: updatedContent,
        attachments: [
          {
            filename: 'curriculo.pdf',
            path: path.join('src', 'assets', 'curriculo', 'curriculo.pdf'),
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }
}
