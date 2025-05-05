import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { MailRequest, Replacement } from './mail.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private logger: Logger;
  constructor(
    private readonly mailSendService: MailerService,
    private readonly config: ConfigService,
  ) {
    this.logger = new Logger(MailService.name);
  }
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
      this.logger.error(e);
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
      this.logger.error(e);
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

    let replacements: Replacement;
    if (input.availability) {
      const strAvailability = ` <p style="line-height: 180%">
                                  * Pretensão salárial: ${input.pretention}
                                </p>

                                <p style="line-height: 180%">
                                  * Disponibilidade para inicio imediato
                                </p>`;
      replacements = [
        ['user', 'Jander Nery'],
        ['company', input.company],
        ['recruiter', input.nameRecruiter],
        ['vacancy', input.vacancy],
        ['habilities', skills],
        ['githubAvatar', input.githubAvatar],
        ['nameFull', input.nameFull],
        ['specialty', input.specialty],
        ['saudation', this.saudation()],
        ['availability', strAvailability],
      ];
    } else {
      const strAvailability = '';
      replacements = [
        ['user', 'Jander Nery'],
        ['company', input.company],
        ['recruiter', input.nameRecruiter],
        ['vacancy', input.vacancy],
        ['habilities', skills],
        ['githubAvatar', input.githubAvatar],
        ['nameFull', input.nameFull],
        ['specialty', input.specialty],
        ['saudation', this.saudation()],
        ['availability', strAvailability],
      ];
    }

    this.logger.log(replacements);
    const emailContent = await this.loadTemplate('mail-recruiter');
    this.logger.log(input.skills);

    let updatedContent = emailContent;

    for (const [key, value] of replacements) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      updatedContent = updatedContent.replace(regex, value);
    }

    // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const previewFile = `./src/assets/email_preview.html`;

    try {
      await fs.writeFile(previewFile, updatedContent);
      this.logger.log(`Template salvo em: ${previewFile}`);

      this.logger.log('Por favor, verifique o arquivo antes de continuar');
    } catch (error) {
      this.logger.error('Erro ao salvar o preview:', error);
    }

    try {
      await this.mailSendService.sendMail({
        from: `${this.config.get('SENDER_NAME')} <${this.config.get('SENDER_MAIL')}>`,
        to: input.to,
        subject: `Vaga - ${input.vacancy} - ${input.nameFull}`,
        cc: `${this.config.get('SENDER_NAME')} <${this.config.get('SENDER_MAIL')}>`,
        html: updatedContent,
        attachments: [
          {
            filename: 'curriculo.pdf',
            path: path.join('src', 'assets', 'curriculo', 'curriculo.pdf'),
          },
        ],
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
