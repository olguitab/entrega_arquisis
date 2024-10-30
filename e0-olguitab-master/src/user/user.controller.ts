import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'; // Asegúrate de importar Req
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './user.service';
import { User } from './user.schema';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './login-user.dto';
import { AuthService } from 'auth/auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')    
    async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.authService.validateUser(loginUserDto.email, loginUserDto.password);
    }

  @Get()
  @UseGuards(AuthGuard('jwt')) // Asumiendo que tienes una estrategia JWT configurada
  getUserProfile(@Req() req) { // Usa @Req() para inyectar el objeto de solicitud
    // Aquí puedes acceder a req.user, que debería estar poblado por Passport
    // después de verificar el token de acceso JWT.
    return req.user;
  }

  @Get('all')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  // Aquí puedes agregar más rutas según sea necesario
}