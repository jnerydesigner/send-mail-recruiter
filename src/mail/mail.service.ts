import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { MailRequest, Replacement } from './mail.dto';
import { ConfigService } from '@nestjs/config';
import * as fsNew from 'fs';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class MailService {
  private logger: Logger;
  private fileNameCurriculo: string;
  private curriculo: string;
  constructor(
    private readonly mailSendService: MailerService,
    private readonly config: ConfigService,
    private readonly uploadService: UploadService,
  ) {
    this.logger = new Logger(MailService.name);
    this.fileNameCurriculo = config.get('FILE_NAME_CURRICULO');
    this.curriculo = config.get('MINIO_URL_CURRICULO');
  }
  async loadCurriculo() {
    const pathToCurriculo = path.join(
      'src',
      'assets',
      'curriculos',
      'curriculo.pdf',
    );
    try {
      const curriculo = await fs.readFile(pathToCurriculo, null);

      return curriculo;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async loadTemplate(templateName: string) {
    await fs.mkdir('src/assets', { recursive: true });
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
      ['availability', input.availability],
      [
        'curriculo',
        process.env.URL_CURRICULO ||
          'https://seliga-dev.s3.us-east-1.amazonaws.com/curriculo-jander-da-costa-nery-2025.pdf',
      ],
    ];

    this.logger.log(replacements);
    const emailContent = await this.loadTemplate('mail-recruiter-v2');
    this.logger.log(input.skills);

    let updatedContent = emailContent;

    for (const [key, value] of replacements) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      updatedContent = updatedContent.replace(regex, value);
    }

    // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const previewFile = `./src/assets/email_preview.html`;

    try {
      await fs.mkdir('src/assets', { recursive: true });
      await fs.writeFile(previewFile, updatedContent);
      this.logger.log(`Template salvo em: ${previewFile}`);

      this.logger.log('Por favor, verifique o arquivo antes de continuar');
    } catch (error) {
      this.logger.error('Erro ao salvar o preview:', error);
    }

    await this.sendEmailMessage(input, updatedContent);
  }

  private async sendEmailMessage(
    input: MailRequest,
    htmlContent: string,
  ): Promise<void> {
    const shouldSendEmail =
      this.config.get('SEND_MAIL') === 'true' ||
      this.config.get('SEND_MAIL') === true;

    if (!shouldSendEmail) {
      this.logger.warn(
        'Envio de email desabilitado. Configure SEND_MAIL=true para enviar emails.',
      );
      this.logger.log('Detalhes do email que seria enviado:');
      this.logger.log(`- Para: ${input.to}`);
      this.logger.log(`- Assunto: Vaga - ${input.vacancy} - ${input.nameFull}`);
      return;
    }

    try {
      this.logger.log(`Enviando email para: ${input.to}`);
      await this.mailSendService.sendMail({
        from: `${this.config.get('SENDER_NAME')} <${this.config.get('SENDER_MAIL')}>`,
        to: input.to,
        subject: `Vaga - ${input.vacancy} - ${input.nameFull}`,
        cc: `${this.config.get('SENDER_NAME')} <${this.config.get('SENDER_MAIL')}>`,
        html: htmlContent,
        attachments: [
          {
            filename: 'curriculo.pdf',
            path: path.join(
              'src',
              'assets',
              'curriculos',
              `${this.fileNameCurriculo}`,
            ),
          },
        ],
      });
      this.logger.log(`Email enviado com sucesso para: ${input.to}`);
    } catch (error) {
      this.logger.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  convertPdfToBase64() {
    const curriculoPath = path.join(
      'src',
      'assets',
      'curriculos',
      `${this.fileNameCurriculo}`,
    );

    const pdfBuffer = fsNew.readFileSync(curriculoPath);
    return pdfBuffer.toString('base64');
  }

  generateDownloadUrl() {
    const base64Pdf = this.convertPdfToBase64();
    return `data:application/pdf;base64,${base64Pdf}`;
  }
}
