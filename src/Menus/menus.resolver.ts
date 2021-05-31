import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { MenusService } from './menus.service';
import { Menus } from './entities/menus.entity';

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
  async createFolder(
    @Args('parentId') parentId: number,
    @Args('folderName') folderName: string
  ): Promise<Object> {
    return this.menuService.createFolder(parentId, folderName)
  }

  @Mutation(returns => Menus)
  async insertEntityToFolder(
    @Args('parentId') parentId: number,
    @Args('entityName') entityName: string
  ): Promise<Object>  {
    return this.menuService.insertEntityToFolder(parentId, entityName)
  }

  @Query(returns => Menus)
  async filteredMenuForRoleId(
    @Args('roleId') roleId: number
  ): Promise<Object>  {
    return this.menuService.filterMenu(roleId)
  }

}
