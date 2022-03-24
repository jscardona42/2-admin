import { ValidationPipe, NestApplicationOptions, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GqlAuthGuard } from './modules/Admin/Guard/authguard.guard';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { readFileSync } from 'fs';

const options: NestApplicationOptions = {};
async function bootstrap() {
  const logger = new Logger('ADMIN');

  logger.log('USE_SSL:' + process.env.USE_SSL);
  const enabledSSL: boolean = process.env.USE_SSL === 'true';

  const port = process.env.PORT || 3000;
  let http = 'HTTP';

  if (enabledSSL) {
    const secretsDir = join(__dirname, '..', 'secrets');
    logger.log('SSL certificate dir:' + secretsDir);
    try {
      const httpsOptions = {
        key: readFileSync(`${secretsDir}/key.pem`),
        cert: readFileSync(`${secretsDir}/cert.pem`),
      };
      options.httpsOptions = httpsOptions;
      http = 'HTTPS';
    } catch (error) {
      logger.log(
        'No SSL cert found, starting server without SSL. Error:' + error,
      );
    }
  }
  const app = await NestFactory.create(AppModule, options);
  app.useGlobalGuards(new GqlAuthGuard());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors();
  await app
    .listen(port)
    .then(() => logger.log(`${http} Server running on port ${port}`));
}
bootstrap();
