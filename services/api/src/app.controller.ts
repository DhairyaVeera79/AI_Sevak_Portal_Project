import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('v1/sevas')
  getSevas(@Headers('x-session-token') sessionToken: string | undefined) {
    this.appService.requireRole(sessionToken, 'C4');
    return this.appService.getSevas();
  }

  @Get('v1/dashboard-metrics')
  getDashboardMetrics(
    @Headers('x-session-token') sessionToken: string | undefined,
  ) {
    this.appService.requireRole(sessionToken, 'C4');
    return this.appService.getDashboardMetrics();
  }

  @Get('v1/impact-stories')
  getImpactStories(
    @Headers('x-session-token') sessionToken: string | undefined,
  ) {
    this.appService.requireRole(sessionToken, 'C4');
    return this.appService.getImpactStories();
  }

  @Get('v1/data-source-mode')
  getDataSourceMode() {
    return { mode: process.env.DATA_SOURCE_MODE ?? 'mock' };
  }

  @Post('v1/auth/login')
  async login(@Body() body: { giId?: string; password?: string }) {
    if (!body.giId || !body.password) {
      throw new BadRequestException('giId and password are required');
    }

    const result = await this.appService.login(body.giId, body.password);
    if (!result.accepted) {
      throw new UnauthorizedException('Invalid credentials for V1 mock login');
    }

    return {
      giId: result.giId,
      role: result.role,
      sessionToken: result.sessionToken,
      expiresInSeconds: result.expiresInSeconds,
      authMode: result.authMode,
    };
  }

  @Get('v1/auth/me')
  getCurrentUser(@Headers('x-session-token') sessionToken: string | undefined) {
    const user = this.appService.requireRole(sessionToken, 'C4');
    return user;
  }

  @Get('v1/admin/rbac-status')
  getRbacStatus(@Headers('x-session-token') sessionToken: string | undefined) {
    const user = this.appService.requireRole(sessionToken, 'ADMIN');
    return {
      status: 'ok',
      message: 'Admin RBAC access granted',
      user,
      dataSourceMode: process.env.DATA_SOURCE_MODE ?? 'mock',
    };
  }
}
