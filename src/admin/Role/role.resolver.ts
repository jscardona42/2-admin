import { Query, Resolver } from '@nestjs/graphql';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';

@Resolver((of) => Role)
export class RoleResolver {
  constructor(
    private readonly roleService: RoleService,
  ) { }

  @Query((returns) => [Role])
  async getRoles(): Promise<Role[]> {
    return this.roleService.getRoles();
  }
}
