
import { Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './prisma/generated/prisma/client';
import Database from 'better-sqlite3';


@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const db = new Database(process.env.DATABASE_URL || 'file:./dev.db');
        const adapter = new PrismaBetterSqlite3(db);
        super({ adapter });
    }
}
