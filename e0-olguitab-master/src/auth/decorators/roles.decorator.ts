import { SetMetadata } from '@nestjs/common';

// Crear el decorador que añade roles requeridos a las rutas
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
