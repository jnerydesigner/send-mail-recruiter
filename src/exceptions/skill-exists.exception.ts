import { ConflictException } from '@nestjs/common';

export class SkillAlreadyExistsException extends ConflictException {
    constructor() {
        super('Skill already exists');
    }
}
