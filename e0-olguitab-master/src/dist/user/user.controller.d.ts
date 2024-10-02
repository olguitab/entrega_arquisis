import { CreateUserDto } from './create-user.dto';
import { UsersService } from './user.service';
import { User } from './user.schema';
import { LoginUserDto } from './login-user.dto';
import { AuthService } from 'auth/auth.service';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    create(createUserDto: CreateUserDto): Promise<User>;
    login(loginUserDto: LoginUserDto): Promise<any>;
    getUserProfile(req: any): any;
    findAll(): Promise<User[]>;
}
