import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { NotFoundInterceptor } from './interceptors/not-found-interceptors.service';
import { UnauthorizedInterceptor } from './interceptors/unauthorized-interceptor.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const reflector = app.get(Reflector);
  app.useGlobalFilters(new HttpExceptionFilter(), new QueryFailedFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      validationError: {
        target: false,
      },
    }),
  );
  app.useGlobalInterceptors(
    new UnauthorizedInterceptor(),
    new NotFoundInterceptor(),
    new ClassSerializerInterceptor(reflector),
  );
  await app.listen(3000);
}
bootstrap();
