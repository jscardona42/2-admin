import { Query, Resolver } from '@nestjs/graphql';
import { Roles } from './entities/roles.entity';
import { RolesService } from './roles.service';

@Resolver((of) => Roles)
export class RolesResolver {
  constructor(
    private readonly rolesService: RolesService,
  ) { }

  @Query((returns) => [Roles])
  async getRoles(): Promise<Roles[]> {
    return this.rolesService.getRoles();
  }
}
