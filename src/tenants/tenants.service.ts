import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async getLoginHistory(tenantId: string) {
    return this.prisma.$queryRawUnsafe(`
      SELECT * FROM "${tenantId}"."TenantLogin"
      ORDER BY login_time DESC
      LIMIT 10
    `);
  }

  async logLogin(tenantId: string, userId: string) {
    await this.prisma.$executeRawUnsafe(`
      INSERT INTO "${tenantId}"."TenantLogin" (user_id)
      VALUES ('${userId}')
    `);
  }
}