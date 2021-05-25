import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';

@Resolver(() => Menu)
export class MenuResolver {
  constructor(private readonly menuService: MenuService) { }

  @Query(() => Menu)
  async rootMenu() {
    return this.menuService.rootMenu();
  }

  @Mutation((returns) => Menu)
  async createRootMenu() {
    return this.menuService.createRootMenu();
  }

  @Mutation(returns => Menu)
  async createFolder(
    @Args('parentId') parentId: number,
    @Args('folderName') folderName: string
  ): Promise<Object> {
    return this.menuService.createFolder(parentId, folderName)
  }

  @Mutation(returns => Menu)
  async insertEntityToFolder(
    @Args('parentId') parentId: number,
    @Args('entityName') entityName: string
  ): Promise<Object>  {
    return this.menuService.insertEntityToFolder(parentId, entityName)
  }

  @Query(returns => Menu)
  async filteredMenuForRoleId(
    @Args('roleId') roleId: number
  ): Promise<Object>  {
    return this.menuService.filterMenu(roleId)
  }

}
