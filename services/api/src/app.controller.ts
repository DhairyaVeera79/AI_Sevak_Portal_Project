import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
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
  async getSevas(@Headers('x-session-token') sessionToken: string | undefined) {
    await this.appService.requireRole(sessionToken, 'C4');
    return this.appService.getSevas();
  }

  @Get('v1/dashboard-metrics')
  async getDashboardMetrics(
    @Headers('x-session-token') sessionToken: string | undefined,
  ) {
    await this.appService.requireRole(sessionToken, 'C4');
    return this.appService.getDashboardMetrics();
  }

  @Get('v1/impact-stories')
  async getImpactStories(
    @Headers('x-session-token') sessionToken: string | undefined,
  ) {
    await this.appService.requireRole(sessionToken, 'C4');
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
  async getCurrentUser(
    @Headers('x-session-token') sessionToken: string | undefined,
  ) {
    const user = await this.appService.requireRole(sessionToken, 'C4');
    return user;
  }

  @Post('v1/auth/logout')
  async logout(@Headers('x-session-token') sessionToken: string | undefined) {
    const result = await this.appService.logout(sessionToken);
    if (!result.loggedOut) {
      throw new UnauthorizedException('No active session to logout');
    }
    return result;
  }

  @Get('v1/admin/rbac-status')
  async getRbacStatus(
    @Headers('x-session-token') sessionToken: string | undefined,
  ) {
    const user = await this.appService.requireRole(sessionToken, 'ADMIN');
    return {
      status: 'ok',
      message: 'Admin RBAC access granted',
      user,
      dataSourceMode: process.env.DATA_SOURCE_MODE ?? 'mock',
    };
  }

  @Get('v1/admin/audit-events')
  async getAuditEvents(
    @Headers('x-session-token') sessionToken: string | undefined,
    @Query('limit') limit?: string,
  ) {
    await this.appService.requireRole(sessionToken, 'ADMIN');
    const parsedLimit = limit ? Number(limit) : 20;
    return this.appService.getRecentAuditEvents(parsedLimit);
  }

  @Get('v1/admin/moderation-queue')
  async getModerationQueue(
    @Headers('x-session-token') sessionToken: string | undefined,
  ) {
    await this.appService.requireRole(sessionToken, 'C2');
    return this.appService.getModerationQueue();
  }
}
