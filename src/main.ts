import { NestFactory } from '@nestjs/core';
import { GqlAuthGuard } from './Admin/guard/authguard.guard';
import { AppModule } from './app.module';
var cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new GqlAuthGuard());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
