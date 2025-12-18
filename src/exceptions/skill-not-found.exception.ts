import { NotFoundException } from '@nestjs/common';

export class SkillNotFoundException extends NotFoundException {
    constructor() {
        super('Skill not found');
    }
}
