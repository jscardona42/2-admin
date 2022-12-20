import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { GqlAuthGuard } from './auth/authguard.guard';

async function bootstrap() {
  let options: any = {};

  if (process.env.ENABLE_SSL === "true" && fs.existsSync(process.env.CERTIFICATE_SSL) && fs.existsSync(process.env.KEY_SSL)) {
    options.httpsOptions = {
      cert: fs.readFileSync(process.env.CERTIFICATE_SSL),
      key: fs.readFileSync(process.env.KEY_SSL)
    }
  }

  const app = await NestFactory.create(AppModule, options);
  app.useGlobalGuards(new GqlAuthGuard());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3000)
}
bootstrap();