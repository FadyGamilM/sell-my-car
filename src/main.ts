import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe(
      {
        // to ask nestjs to ignore any other property that not defined in my dto, i will set the whitelist -> true
        whitelist: true
      }
    )
  )
  await app.listen(3000);
}
bootstrap();
