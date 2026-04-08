import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpenseStatus } from '@prisma/client';
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

  @Get('v1/logs')
  async getLogs(
    @Headers('x-session-token') sessionToken: string | undefined,
    @Query('stage') stage?: string,
  ) {
    const user = await this.appService.requireRole(sessionToken, 'C4');

    const normalizedStage = stage?.toLowerCase();
    const allowedStages = new Set(['draft', 'moderation', 'reviewed']);
    if (normalizedStage && !allowedStages.has(normalizedStage)) {
      throw new BadRequestException(
        'stage must be one of draft, moderation, reviewed',
      );
    }

    return this.appService.listLogs(
      user,
      normalizedStage as 'draft' | 'moderation' | 'reviewed' | undefined,
    );
  }

  @Patch('v1/logs/:id/stage')
  async updateLogStage(
    @Headers('x-session-token') sessionToken: string | undefined,
    @Param('id') id: string,
    @Body() body: { stage?: string },
  ) {
    const user = await this.appService.requireRole(sessionToken, 'C2');

    const normalizedStage = body.stage?.toLowerCase();
    const allowedStages = new Set(['draft', 'moderation', 'reviewed']);
    if (!normalizedStage || !allowedStages.has(normalizedStage)) {
      throw new BadRequestException(
        'stage must be one of draft, moderation, reviewed',
      );
    }

    return this.appService.updateLogStage(
      user,
      id,
      normalizedStage as 'draft' | 'moderation' | 'reviewed',
    );
  }

  @Get('v1/expenses')
  async getExpenses(
    @Headers('x-session-token') sessionToken: string | undefined,
  ) {
    const user = await this.appService.requireRole(sessionToken, 'C4');
    return this.appService.listExpenses(user);
  }

  @Post('v1/expenses')
  async createExpense(
    @Headers('x-session-token') sessionToken: string | undefined,
    @Body()
    body: {
      category?: string;
      amount?: number;
      sevaId?: string;
      attachmentUrl?: string;
    },
  ) {
    const user = await this.appService.requireRole(sessionToken, 'C4');

    if (!body.category || typeof body.amount !== 'number' || !body.sevaId) {
      throw new BadRequestException(
        'category, amount, and sevaId are required',
      );
    }

    if (body.amount <= 0) {
      throw new BadRequestException('amount must be greater than zero');
    }

    return this.appService.createExpense(user, {
      category: body.category,
      amount: body.amount,
      sevaId: body.sevaId,
      attachmentUrl: body.attachmentUrl,
    });
  }

  @Patch('v1/expenses/:id/status')
  async updateExpenseStatus(
    @Headers('x-session-token') sessionToken: string | undefined,
    @Param('id') id: string,
    @Body() body: { status?: ExpenseStatus },
  ) {
    const user = await this.appService.requireRole(sessionToken, 'C2');

    const allowed = new Set<ExpenseStatus>([
      ExpenseStatus.REVIEWED,
      ExpenseStatus.APPROVED,
      ExpenseStatus.REJECTED,
    ]);

    if (!body.status || !allowed.has(body.status)) {
      throw new ForbiddenException(
        'status must be one of REVIEWED, APPROVED, REJECTED',
      );
    }

    return this.appService.updateExpenseStatus(user, id, body.status);
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
    const user = await this.appService.requireRole(sessionToken, 'C2');
    return this.appService.listLogs(user, 'moderation');
  }
}
