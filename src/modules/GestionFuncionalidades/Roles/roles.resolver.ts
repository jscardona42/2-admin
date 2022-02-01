import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateIconoInput } from '../../Admin/Iconos/dto/iconos.dto';
import { AddPermisosToRolInput, CreateRolInput, UpdateRolInput } from './dto/roles.dto';
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

  @Query((returns) => Roles)
  async getRolById(@Args("rol_id") rol_id: number): Promise<Roles> {
    return this.rolesService.getRolById(rol_id);
  }

  @Query(() => [Roles])
  async getFilterRoles(
    @Args("rol", { nullable: true }) rol: string): Promise<Roles[]> {
    return await this.rolesService.getFilterRoles(rol);
  }

  @Mutation((returns) => Roles)
  async createRol(@Args("data") data: CreateRolInput): Promise<Roles> {
    return this.rolesService.createRol(data);
  }

  @Mutation((returns) => Roles)
  async updateRol(@Args("data") data: UpdateRolInput): Promise<Roles> {
    return this.rolesService.updateRol(data);
  }

  @Mutation((returns) => Roles)
  async deleteRol(@Args("rol_id") rol_id: number): Promise<Roles> {
    return this.rolesService.deleteRol(rol_id);
  }

  @Mutation((returns) => Roles)
  async addPermisosToRol(@Args("data") data: AddPermisosToRolInput): Promise<Roles> {
    return this.rolesService.addPermisosToRol(data);
  }
}
