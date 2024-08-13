import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const tenantId = `tenant_${Date.now()}`;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        tenantId,
      },
    });

    await this.prisma.createSchema(tenantId);

    return user;
  }
}