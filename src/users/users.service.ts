import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UserMapper } from './mappers/user.mapper';
import { Send } from 'express';
import { MailRequest } from 'src/mail/mail.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({ data });
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            include: {
                skills: {
                    select: {
                        skill: {
                            select: {
                                name: true
                            }
                        }
                    },
                },
            },
        });


        return users.map((user) => UserMapper.toResponse(user));
    }

    async findOne(id: string) {
        const findUser = await this.prisma.user.findUnique({
            where: { id },
            include: {
                skills: {
                    select: {
                        skill: {
                            select: {
                                name: true
                            }
                        }
                    },
                },
            },
        });

        return UserMapper.toResponse(findUser);
    }

    async findOneMail(mail: string) {
        const findUser = await this.prisma.user.findFirst({
            where: { email: mail },
            include: {
                skills: {
                    select: {
                        skill: {
                            select: {
                                name: true
                            }
                        }
                    },
                },
            },
        });

        return UserMapper.toResponse(findUser);
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: { id },
            data,
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        return this.prisma.user.delete({ where: { id } });
    }

    async addSkill(userId: string, skillId: string) {
        return this.prisma.userSkills.create({ data: { userId, skillId } });
    }

    async sendmailUser(data: MailRequest, user: User) {
        const alreadySent = await this.prisma.sendMailUser.findFirst({
            where: {
                to: data.to,
                nameRecruiter: data.nameRecruiter,
                company: data.company,
                vacancy: data.vacancy,
                userId: user.id,
            },
        });

        if (alreadySent) {
            return {
                duplicated: true,
                sendMail: alreadySent,
            };
        }
        const sendMail: Prisma.SendMailUserCreateInput = {
            to: data.to,
            nameRecruiter: data.nameRecruiter,
            company: data.company,
            vacancy: data.vacancy,
            template: data.template,
            user: {
                connect: {
                    id: user.id,
                },
            },
        }
        return this.prisma.sendMailUser.create({ data: sendMail });
    }


    async findAllMail() {
        return this.prisma.sendMailUser.findMany();
    }
}


export type SendMailUserCreateInput = {
    email: string;
    name: string;
    curriculoUrl: string;
    specialty: string;
    githubAvatar: string;
    user?: UserCreateInput;
}

export type UserCreateInput = {
    id?: string;
    email: string;
    name: string;
    curriculoUrl: string;
    specialty: string;
    githubAvatar: string;
}