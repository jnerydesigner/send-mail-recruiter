import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME');
    this.s3 = new S3Client({
      endpoint: this.configService.get('MINIO_URL_API_HTTP'),
      credentials: {
        accessKeyId: this.configService.get('MINIO_ACCESS_KEY'),
        secretAccessKey: this.configService.get('MINIO_SECRET_KEY'),
      },
      region: 'us-east-1',
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filePath = file.path;

    console.log(`Arquivo de origem: ${filePath}`);

    // Verificar se o arquivo existe antes de renomear
    if (!fs.existsSync(filePath)) {
      console.error('Arquivo não encontrado:', filePath);
      throw new Error('Arquivo não encontrado');
    }

    const pathToCurriculo = path.join('src', 'assets', 'curriculos');
    const newFileName = 'curriculo.pdf';
    const newFilePath = path.join(pathToCurriculo, newFileName);

    console.log(`Caminho de destino: ${newFilePath}`);

    // Verificar se o diretório de destino existe
    if (!fs.existsSync(pathToCurriculo)) {
      console.log('Diretório de destino não existe, criando...');
      fs.mkdirSync(pathToCurriculo, { recursive: true }); // Cria o diretório, se não existir
    }

    const fileName = 'curriculo';

    console.log(newFilePath);

    try {
      fs.renameSync(filePath, newFilePath);
    } catch (error) {
      console.error('Erro ao renomear o arquivo', error);
      throw new Error('Erro ao renomear o arquivo');
    }

    const fileContent = fs.readFileSync(newFilePath);
    const params = {
      Bucket: this.bucketName,
      Key: newFileName,
      Body: fileContent,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);

    try {
      await this.s3.send(command);
      fs.unlink(filePath, (file) =>
        console.log(`arquivo ${file} deletado com sucesso`),
      );
      return `Arquivo ${fileName} enviado para o bucket ${this.bucketName}`;
    } catch (err) {
      console.error('Erro ao fazer upload para o MinIO', err);
      throw new Error('Erro ao fazer upload');
    }
  }

  async generatePresignedUrl(): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: 'curriculo.pdf',
    });

    try {
      const url = await getSignedUrl(this.s3, command, {
        expiresIn: 2 * 60 * 60,
      });
      return url;
    } catch (err) {
      console.error('Erro ao gerar URL assinada', err);
      throw new Error('Erro ao gerar URL assinada');
    }
  }
}
