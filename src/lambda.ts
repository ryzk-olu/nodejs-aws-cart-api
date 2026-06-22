import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer: any;

export const handler = async (event: any, context: any) => {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
    cachedServer = serverlessExpress({ app: app.getHttpAdapter().getInstance() });
  }
  return cachedServer(event, context);
};
