import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddFuncionalidadesToRolInput, CreateRolInput, UpdateRolInput } from './dto/roles.dto';
import { TbRoles } from './entities/tbroles.entity';
import { TbRolesService } from './roles.service';

@Resolver(() => TbRoles)
export class TbRolesResolver {
  constructor(
    private readonly rolesService: TbRolesService,
  ) { }

  @Query(() => [TbRoles])
  async getRoles(): Promise<TbRoles[]> {
    return this.rolesService.getRoles();
  }

  @Query(() => TbRoles)
  async getRolById(@Args("rol_id") rol_id: number): Promise<TbRoles> {
    return this.rolesService.getRolById(rol_id);
  }

  @Query(() => [TbRoles])
  async getFilterRoles(
    @Args("rol", { nullable: true }) rol: string): Promise<TbRoles[]> {
    return await this.rolesService.getFilterRoles(rol);
  }

  @Mutation(() => TbRoles)
  async createRol(@Args("data") data: CreateRolInput): Promise<TbRoles> {
    return this.rolesService.createRol(data);
  }

  @Mutation(() => TbRoles)
  async updateRol(@Args("data") data: UpdateRolInput): Promise<TbRoles> {
    return this.rolesService.updateRol(data);
  }

  @Mutation(() => TbRoles)
  async deleteRol(@Args("rol_id") rol_id: number): Promise<TbRoles> {
    return this.rolesService.deleteRol(rol_id);
  }

  @Mutation(() => TbRoles)
  async addFuncionalidadesToRol(@Args("data") data: AddFuncionalidadesToRolInput): Promise<TbRoles> {
    return this.rolesService.addFuncionalidadesToRol(data);
  }

  @Query(() => [TbRoles])
  async getEntidadesIdsByRolId(): Promise<any> {
    return this.rolesService.getEntidadesIdsByRolId(1);
  }
}
