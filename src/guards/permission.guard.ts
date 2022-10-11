import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import RequestWithUser from 'src/common/constants/request-user.interfaxe';
import { UserService } from 'src/modules/user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';

const PermissionGuard = (permissionRoutes: string[]): Type<CanActivate> => {
  @Injectable()
  class PermissionGuardMixin extends JwtAuthGuard {
    constructor(private userService: UserService) {
      super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      if (request?.user) {
        const { id } = request.user;
        const user = await this.userService.findOneById(id);
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const permissionExists = user.permissions.some((permission) =>
          permissionRoutes.includes(permission.name),
        );
        if (!permissionExists) {
          throw new HttpException(
            'Permissions not authorized',
            HttpStatus.UNAUTHORIZED,
          );
        }
        return permissionExists;
      }
    }
  }
  return mixin(PermissionGuardMixin);
};
export default PermissionGuard;
