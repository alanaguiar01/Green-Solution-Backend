import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private permissionsRoute: string[],
  ) {}

  private async canActivateAsync(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.user) {
      const { id } = request.user;
      const user = await this.userService.findOneById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const permissionsExists = user.permissions
        .map((permission) => permission.name)
        .some((permission) => this.permissionsRoute.includes(permission));
      if (permissionsExists) {
        throw new HttpException(
          'Permission not authorized',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return permissionsExists;
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.canActivateAsync(context);
  }
}
