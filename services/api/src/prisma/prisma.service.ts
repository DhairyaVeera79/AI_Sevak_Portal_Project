import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      this.logger.warn(
        'DATABASE_URL is not set. Skipping Prisma DB connection (mock-first mode).',
      );
      return;
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    if (!process.env.DATABASE_URL) {
      return;
    }
    await this.$disconnect();
  }
}
