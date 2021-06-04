import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Menus } from 'src/Menus/entities/menus.entity';
import { UpdateMenuPersonalizadoInput } from './dto/menupersonalizado.dto';
import { EmpresasMenusService } from './empresasmenus.service';
import { EmpresasMenuPersonalizado } from './entities/empresasmenupersonalizdo.entity';
import { EmpresasMenus } from './entities/empresasmenus.entity';


@Resolver(() => EmpresasMenus)
export class EmpresasMenusResolver {
    constructor(private readonly menuService: EmpresasMenusService) { }

    @Query(() => [EmpresasMenus])
    async getEmpresasMenus() {
        return this.menuService.getEmpresasMenus();
    }

    @Query(() => EmpresasMenuPersonalizado)
    async getEmpresaMenuByEmpresaId(@Args('login_id') login_id: number) {
        return this.menuService.getEmpresaMenuByEmpresaId(login_id);
    }

    @Query(() => [Menus])
    async getEmpresaMenuByRoleId(@Args('login_id') login_id: number) {
        return this.menuService.getEmpresaMenuByRoleId(login_id);
    }

    @Mutation(returns => EmpresasMenuPersonalizado)
    async updateMenuPersonalizado(@Args('data') data: UpdateMenuPersonalizadoInput): Promise<Object> {
        return this.menuService.updateMenuPersonalizado(data)
    }


}
