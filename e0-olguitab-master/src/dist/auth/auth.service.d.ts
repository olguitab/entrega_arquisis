import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'user/user.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
}
