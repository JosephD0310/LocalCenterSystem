import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async checkHustLogin(@Body() loginDto: LoginDto) {
        const isValid = await this.authService.checkAccount(loginDto);
        return { success: isValid };
    }
}
