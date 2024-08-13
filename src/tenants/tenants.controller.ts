import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantsService } from './tenants.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('tenants')
@ApiBearerAuth()
@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get('logins')
  @ApiOperation({ summary: 'Get login history for current tenant' })
  async getLoginHistory(@GetUser() user: User) {
    return this.tenantsService.getLoginHistory(user.tenantId);
 }
}