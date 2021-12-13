import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateMenuPalabrasInput, UpdateMenuPalabrasInput } from './dto/menuspalabras.dto';
import { MenusPalabras } from './entities/menuspalabras.entity';
import { MenusPalabrasService } from './menuspalabras.service';

@Resolver(() => MenusPalabras)
export class MenusPalabrasResolver {
    constructor(private readonly menusPalabrasService: MenusPalabrasService) { }

    @Query(() => [MenusPalabras])
    async getMenusPalabras() {
        return this.menusPalabrasService.getMenusPalabras();
    }

    @Query(() => MenusPalabras)
    async getMenuPalabraById(@Args('menu_palabra_id') menu_palabra_id: number) {
        return this.menusPalabrasService.getMenuPalabraById(menu_palabra_id);
    }

    @Mutation(returns => MenusPalabras)
    async createMenuPalabra(
        @Args('data') data: CreateMenuPalabrasInput) {
        return this.menusPalabrasService.createMenuPalabra(data)
    }

    @Mutation(returns => MenusPalabras)
    async updateMenuPalabra(
        @Args('data') data: UpdateMenuPalabrasInput) {
        return this.menusPalabrasService.updateMenuPalabra(data)
    }

    @Mutation(() => MenusPalabras)
    async deleteMenuPalabra(@Args('menu_palabra_id') menu_palabra_id: number) {
        return this.menusPalabrasService.deleteMenuPalabra(menu_palabra_id);
    }

}
