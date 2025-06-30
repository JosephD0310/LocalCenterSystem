import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const clientUrl = configService.get<string>('CLIENT_DEV');

    app.enableCors({
        origin: clientUrl ?? 'http://localhost:5173',
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
