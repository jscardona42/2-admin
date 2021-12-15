import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MenusService } from './menus.service';
import { Menus } from './entities/menus.entity';
import { CreateMenuInput } from './dto/menus.dto';

@Resolver(() => Menus)
export class MenusResolver {
  constructor(private readonly menuService: MenusService) { }

  @Query(() => [Menus])
  async getMenus() {
    return this.menuService.getMenus();
  }

  @Query(() => [Menus])
  async getMenusInactivos() {
    return this.menuService.getMenusInactivos();
  }

  @Query(() => [Menus])
  async getMenuByRoleId(@Args('login_id') login_id: number): Promise<Object[]> {
    return this.menuService.getMenuByRoleId(login_id);
  }

  @Query(() => [Menus])
  async getFilterMenuPalabra(@Args('palabra') palabra: string) {
    return this.menuService.getFilterMenuPalabra(palabra);
  }

  @Mutation((returns) => Menus)
  async createRootMenu(): Promise<Object> {
    return this.menuService.createRootMenu();
  }

  @Mutation(returns => Menus)
  async createMenu(
    @Args('data') data: CreateMenuInput): Promise<Object> {
    return this.menuService.createMenu(data)
  }

  @Mutation(returns => [Menus])
  async updateMenu(
    @Args('data') data: string): Promise<Object[]> {
    return this.menuService.updateMenu(data)
  }

  @Mutation(returns => Menus)
  async modifyMenuEstado(
    @Args('menu_id') menu_id: number,
    @Args('activo') activo: boolean): Promise<Object> {
    return this.menuService.modifyMenuEstado(menu_id, activo)
  }
}
