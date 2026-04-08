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
  getSevas() {
    return this.appService.getSevas();
  }

  @Get('v1/dashboard-metrics')
  getDashboardMetrics() {
    return this.appService.getDashboardMetrics();
  }

  @Get('v1/impact-stories')
  getImpactStories() {
    return this.appService.getImpactStories();
  }

  @Get('v1/data-source-mode')
  getDataSourceMode() {
    return { mode: process.env.DATA_SOURCE_MODE ?? 'mock' };
  }

  @Post('v1/auth/login')
  login(@Body() body: { giId?: string; password?: string }) {
    if (!body.giId || !body.password) {
      throw new BadRequestException('giId and password are required');
    }

    const result = this.appService.login(body.giId, body.password);
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
    const user = this.appService.getCurrentUserFromToken(sessionToken);
    if (!user) {
      throw new UnauthorizedException('No active session');
    }
    return user;
  }
}
