import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GqlAuthGuard } from './Admin/Guard/authguard.guard';
import { AppModule } from './app.module';
var cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new GqlAuthGuard());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
