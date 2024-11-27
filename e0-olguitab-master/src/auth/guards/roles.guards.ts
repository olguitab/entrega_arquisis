import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// RolesGuard para verificar los roles
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Obtén los roles permitidos desde los metadatos de la ruta
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Si no se especifican roles, permite el acceso (endpoints públicos)
    }

    // Obtén el usuario del contexto
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Valida si existe el usuario y si su rol está en los roles permitidos
    return user && requiredRoles.includes(user.role);
  }
}