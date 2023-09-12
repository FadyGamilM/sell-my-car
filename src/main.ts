import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require("cookie-session");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // use cookie session 
  app.use(cookieSession({ keys: ["sell-my-fuckin-car"] }))

  // use validation pipe to validate incoming requests
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
