import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Prisma } from '@prisma/client';

@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) { }

    @Post()
    create(@Body() data: Prisma.SkillsCreateInput) {
        return this.skillsService.create(data);
    }

    @Get()
    findAll() {
        return this.skillsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.skillsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Prisma.SkillsUpdateInput) {
        return this.skillsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.skillsService.remove(id);
    }
}
