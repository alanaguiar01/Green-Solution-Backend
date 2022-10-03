import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private rolesRoute: string[],
  ) {}
  private async canActivateAsync(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.user) {
      const { id } = request.user;
      const user = await this.userService.findOneById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const rolesExists = user.roles
        .map((role) => role.name)
        .some((role) => this.rolesRoute.includes(role));
      if (!rolesExists) {
        throw new HttpException(
          'Roles not authorized',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return rolesExists;
    }
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.canActivateAsync(context);
  }
}
