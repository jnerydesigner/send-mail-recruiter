
import { Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './prisma/generated/prisma/client';
const Database = require('better-sqlite3');


@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
        // Remove 'file:' prefix for better-sqlite3
        const dbPath = dbUrl.replace('file:', '');
        const db = new Database(dbPath);
        const adapter = new PrismaBetterSqlite3(db);
        super({ adapter });
    }
}
