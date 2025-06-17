import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'https://local-center-system.vercel.app',
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
