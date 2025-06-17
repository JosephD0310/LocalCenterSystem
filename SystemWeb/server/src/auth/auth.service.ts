import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) {}

    async validateUser(email: string, password: string) {
        try {
            const res = await axios.get('https://api.toolhub.app/hust/KiemTraMatKhau', {
                params: {
                    taikhoan: email,
                    matkhau: password,
                },
            });

            if (res.data === 1) {
                return { email };
            } else {
                throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
            }
        } catch (err) {
            throw new UnauthorizedException('Không thể xác thực');
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        console.log(loginDto);

        // if (!email.endsWith('@hust.edu.vn')) {
        //     throw new UnauthorizedException('Email không thuộc hust.edu.vn');
        // }

        const user = await this.validateUser(email, password);
        const authorizationUser = await this.userService.findByEmail(user.email);
        const role = authorizationUser?.role || 'guest';
        const payload = { email: user.email, role };
        console.log(payload);
        return {
            access_token: this.jwtService.sign(payload),
            user: payload,
        };
    }
}
