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
import { JwtAuthGuard } from './auth.guard';

const RoleGuard = (rolesRoutes: string[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin extends JwtAuthGuard {
    constructor(private readonly userService: UserService) {
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
        const rolesExists = user.roles
          .map((role) => role.name)
          .some((role) => rolesRoutes.includes(role));
        if (!rolesExists) {
          throw new HttpException(
            'Roles not authorized',
            HttpStatus.UNAUTHORIZED,
          );
        }
        return rolesExists;
      }
    }
  }
  return mixin(RoleGuardMixin);
};
export default RoleGuard;
//depois trocar findbyid por find do repositorio e usa função "in" pra deixar performatico
