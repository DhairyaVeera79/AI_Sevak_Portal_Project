import { NestFactory } from '@nestjs/core';
import type { Express, NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

type RateBucket = {
  count: number;
  resetAt: number;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOriginEnv = process.env.CORS_ALLOWED_ORIGINS?.trim();
  const corsOrigins = corsOriginEnv
    ? corsOriginEnv.split(',').map((origin) => origin.trim())
    : '*';

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['content-type', 'x-session-token', 'x-public-tunnel-key'],
  });

  const expressApp = app.getHttpAdapter().getInstance() as Express;
  if (typeof expressApp.disable === 'function') {
    expressApp.disable('x-powered-by');
  }

  const tunnelKey = process.env.PUBLIC_TUNNEL_API_KEY?.trim();
  const rateWindowMs = Math.max(
    Number(process.env.PUBLIC_RATE_WINDOW_MS ?? 60_000),
    1_000,
  );
  const rateLimitMax = Math.max(
    Number(process.env.PUBLIC_RATE_LIMIT_MAX ?? 120),
    20,
  );
  const buckets = new Map<string, RateBucket>();

  app.use((req: Request, res: Response, next: NextFunction) => {
    const ip =
      (req.headers['cf-connecting-ip'] as string | undefined) ??
      req.ip ??
      'unknown';
    const now = Date.now();
    const current = buckets.get(ip);

    if (!current || current.resetAt <= now) {
      buckets.set(ip, {
        count: 1,
        resetAt: now + rateWindowMs,
      });
    } else {
      current.count += 1;
      if (current.count > rateLimitMax) {
        res.status(429).json({
          statusCode: 429,
          message: 'Too many requests',
        });
        return;
      }
    }

    next();
  });

  if (tunnelKey) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path === '/' || req.path.startsWith('/health')) {
        next();
        return;
      }

      const incoming = req.headers['x-public-tunnel-key'];
      if (incoming !== tunnelKey) {
        res.status(401).json({
          statusCode: 401,
          message: 'Missing or invalid public tunnel key',
        });
        return;
      }

      next();
    });
  }

  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.API_BIND_HOST?.trim() || '127.0.0.1';
  await app.listen(port, host);
}
void bootstrap();
