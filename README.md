<p align="center">
  <img src="https://raw.githubusercontent.com/jnerydesigner/send-mail-recruiter/refs/heads/main/src/assets/images/send-mail-banner-compressed.png" alt="Imagem do banner" />
</p>

## Enviar Email para os Recrutadores

### Veja como é fácil e rapido aplicar para uma vaga quando o recrutador do linkedin posta seu email

1. Faça o clone do projeto

```
git clone https://github.com/jnerydesigner/send-mail-recruiter.git

```

2. Inclua seu curriculo na pasta 
```
src/assets/curriculo

```
3. Renomear o arquivo do seu curriculo para curriculo.pdf

4. Suba seu projeto

5. Pegue a url do arquivo do seu curriculo, já substituido

6. Substitua no template do curriculo a url do github que aponta para seu curriculo:

```
ctrl + f busque a palavra 

Meu Curriculo

e susbtitua onde esta a tag que aponta para sua nova url

 <a
                                    href="https://github.com/.....

```

7. Lembrando que o que tem lá é o meu curriculo

8. Tem que configurar a .env

```
PORT=5544
NODE_ENV=production

MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SSL=true
MAIL_USER=seu email
MAIL_PASS=veja no youtube que tem muito canala que explica como criar essa senha smtp 


GOOGLE_APP=veja no youtube que tem muito canala que explica como criar essa senha smtp 

```

9. Rode o projeto

```
yarn start:dev
```

10. Utilize um gerenciador de chamadas a api, eu utilizo o apidog
```
http://localhost:5544/mail

Body da requisição
{
    "to": "email para quem vc esta enviando",
    "company": "empresa de onde vc vai fazer o processo",
    "vacancy": "a vaga",
    "nameRecruiter": "nome do recrutador",
    "skills": "NodeJs, Java, Spring Boot, ReactJS, NestJS",
    "specialty":"Seu titulo ex: Software Engineer",
    "githubAvatar": "seu avatar do github",
    "nameFull": "Nome completo"
}
```

## Alguns links uteis

- Author - [Jander Nery](https://www.linkedin.com/in/jander-nery/)
- Portfolio em construção - [Meu Portfolio](https://jandernery.seligadev.com.br)
- Cafezinho - [Links Uteis](https://products-digital.seligadev.com.br/)


## De sua contribuição com Pull requests


## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
