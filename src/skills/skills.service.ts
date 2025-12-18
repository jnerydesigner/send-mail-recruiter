import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { SkillAlreadyExistsException } from 'src/exceptions/skill-exists.exception';
import { SkillNotFoundException } from 'src/exceptions/skill-not-found.exception';

@Injectable()
export class SkillsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.SkillsCreateInput) {
        const findSkill = await this.prisma.skills.findFirst({
            where: {
                name: data.name
            }
        })

        if (findSkill) {
            throw new SkillAlreadyExistsException();
        }

        return this.prisma.skills.create({ data });
    }

    async findAll() {
        return this.prisma.skills.findMany();
    }

    async findOne(id: string) {
        const existsSkill = await this.prisma.skills.findUnique({ where: { id } });

        if (!existsSkill) {
            throw new SkillNotFoundException();
        }

        return existsSkill;
    }

    async update(id: string, data: Prisma.SkillsUpdateInput) {
        return this.prisma.skills.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.skills.delete({ where: { id } });
    }
}
