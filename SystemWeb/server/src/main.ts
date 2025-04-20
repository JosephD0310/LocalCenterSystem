import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });

    app.use(
      session({
        secret: 'secret-key', 
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60, // session sống 1 giờ
        },
      }),
    );
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
