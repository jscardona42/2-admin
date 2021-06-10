import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MenusService } from './menus.service';
import { Menus } from './entities/menus.entity';
import { CreateMenuInput, UpdateMenuInput } from './dto/menus.dto';

@Resolver(() => Menus)
export class MenusResolver {
  constructor(private readonly menuService: MenusService) { }

  @Query(() => Menus)
  async rootMenu() {
    return this.menuService.rootMenu();
  }

  @Mutation((returns) => Menus)
  async createRootMenu() {
    return this.menuService.createRootMenu();
  }

  @Mutation(returns => Menus)
  async createFolder(@Args('data') data: CreateMenuInput): Promise<Object> {
    return this.menuService.createFolder(data)
  }

  @Mutation(returns => Menus)
  async insertEntityToFolder(
    @Args('data') data: CreateMenuInput) {
    return this.menuService.insertEntityToFolder(data)
  }

  @Mutation(returns => Menus)
  async updateMenu(
    @Args('data') data: UpdateMenuInput) {
    return this.menuService.updateMenu(data)
  }

  @Query(() => [Menus])
  async getFilterMenuPalabra(@Args('palabra') palabra: string) {
    return this.menuService.getFilterMenuPalabra(palabra);
  }

}
