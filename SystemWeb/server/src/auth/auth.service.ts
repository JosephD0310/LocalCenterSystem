import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(private readonly httpService: HttpService) {}

    async checkAccount(loginDto: LoginDto): Promise<boolean> {
        const url = 'https://api.toolhub.app/hust/KiemTraMatKhau';
        const { email, password } = loginDto;

        console.log(loginDto)
        
        // if (!email.endsWith('@hust.edu.vn')) {
        //     throw new UnauthorizedException('Email không thuộc hust.edu.vn');
        // }

        const response$ = this.httpService.get(url, {
            params: {
                taikhoan: email,
                matkhau: password,
            },
        });

        const response = await lastValueFrom(response$);
        console.log(response.data == 1)
        return response.data == 1;
    }
}
