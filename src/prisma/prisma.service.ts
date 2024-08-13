import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async createSchema(schema: string) {
    await this.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "${schema}"."TenantLogin" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}