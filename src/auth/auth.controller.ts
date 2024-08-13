import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { TenantsService } from 'src/tenants/tenants.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private tenantsService: TenantsService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ schema: { properties: { email: { type: 'string' }, password: { type: 'string' } } } })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ schema: { properties: { email: { type: 'string' }, password: { type: 'string' } } } })
  async register(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.create(body.email, body.password);
    await this.tenantsService.logLogin(user.tenantId, user.id);
    return this.authService.login(user);
  }
}