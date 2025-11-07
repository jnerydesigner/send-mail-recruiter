# Instruções para Agentes AI - Send Mail Recruiter

## Visão Geral da Arquitetura

Este projeto é uma aplicação NestJS que automatiza o envio de e-mails para recrutadores. A arquitetura é organizada em módulos:

- `mail`: Serviço principal para composição e envio de e-mails
- `upload`: Gerenciamento de uploads de arquivos
- `app`: Módulo raiz e configurações globais

### Principais Componentes

- `MailService` (`src/mail/mail.service.ts`): Gerencia templates, substitui variáveis e envia e-mails
- `UploadService` (`src/upload/upload.service.ts`): Lida com upload de arquivos
- Templates HTML: Localizados em `src/assets/template/`

## Fluxo de Dados

1. Requisição recebida em `mail.controller.ts`
2. Dados processados por `MailService`
3. Template HTML carregado e variáveis substituídas
4. E-mail enviado com currículo anexado

## Configuração do Ambiente

Requisitos:
- Node.js
- Yarn
- Arquivo `.env` configurado com:
  ```
  PORT=5544
  MAIL_HOST=smtp.gmail.com
  MAIL_PORT=465
  MAIL_SSL=true
  MAIL_USER=seu_email
  MAIL_PASS=senha_smtp
  GOOGLE_APP=chave_app_google
  ```

## Workflows Principais

### Desenvolvimento
```bash
yarn install
yarn start:dev  # Servidor com hot-reload
```

### Build e Produção
```bash
yarn build
yarn start:prod
```

### Templates de E-mail
- Localizados em `src/assets/template/`
- Suportam variáveis no formato `{{variavel}}`
- Preview gerado em `src/assets/email_preview.html`

## Padrões de Projeto

- **Injeção de Dependência**: Uso extensivo de decoradores NestJS (`@Injectable()`, `@Controller()`)
- **Configuração**: Uso do `ConfigService` para variáveis de ambiente
- **Logs**: Uso do `Logger` do NestJS para rastreamento de operações

## Integrações

- SMTP (Gmail)
- AWS S3 (opcional, para armazenamento de arquivos)
- Express (servidor HTTP)

## Convenções Específicas

1. Currículo:
   - Deve ser nomeado como `curriculo.pdf`
   - Localizado em `src/assets/curriculos/`

2. Corpo da Requisição:
```json
{
    "to": "email_destino",
    "company": "nome_empresa",
    "vacancy": "nome_vaga",
    "nameRecruiter": "nome_recrutador",
    "skills": "habilidades_separadas_por_virgula",
    "specialty": "cargo",
    "githubAvatar": "url_avatar_github",
    "nameFull": "nome_completo"
}
```