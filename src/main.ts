import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GqlAuthGuard } from './modules/Admin/Guard/authguard.guard';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as fs from 'fs';
let https = require('https');
let http = require('http');
const express = require("express");

async function bootstrap() {
  const options: any = {};
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.useGlobalGuards(new GqlAuthGuard());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  if (process.env.ENABLE_SSL === "true" && fs.existsSync(process.env.CERTIFICATE_SSL) && fs.existsSync(process.env.KEY_SSL)) {
    options.httpsOptions = {
      cert: fs.readFileSync(process.env.CERTIFICATE_SSL),
      key: fs.readFileSync(process.env.KEY_SSL),
      requestCert: false,
      rejectUnauthorized: false,
    }
    await app.init();
    https.createServer(options.httpsOptions, server).listen(process.env.PORT || 3000);
  } else {
    await app.init();
    http.createServer(server).listen(process.env.PORT || 3000);
  }
}
bootstrap();
