import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateMenuTraduccionInput, UpdateMenuTraduccionInput } from './dto/menustraducciones.dto';
import { MenusTraducciones } from './entities/menustraducciones.entity';
import { MenusTraduccionesService } from './menustraducciones.service';


@Resolver(() => MenusTraducciones)
export class MenusTraduccionessResolver {
    constructor(private readonly menusTraduccionesService: MenusTraduccionesService) { }

    @Query(() => [MenusTraducciones])
    async getMenusTraducciones() {
        return this.menusTraduccionesService.getMenusTraducciones();
    }

    @Query(() => MenusTraducciones)
    async getMenuTraduccionById(@Args('menu_traduccion_id') menu_traduccion_id: number) {
        return this.menusTraduccionesService.getMenuTraduccionById(menu_traduccion_id);
    }

    @Mutation(returns => MenusTraducciones)
    async createMenuTraduccion(
        @Args('data') data: CreateMenuTraduccionInput) {
        return this.menusTraduccionesService.createMenuTraduccion(data)
    }

    @Mutation(returns => MenusTraducciones)
    async updateMenuTraduccion(
        @Args('data') data: UpdateMenuTraduccionInput) {
        return this.menusTraduccionesService.updateMenuTraduccion(data)
    }

    @Mutation(() => MenusTraducciones)
    async deleteMenuTraduccion(@Args('menu_traduccion_id') menu_traduccion_id: number) {
        return this.menusTraduccionesService.deleteMenuTraduccion(menu_traduccion_id);
    }

}
