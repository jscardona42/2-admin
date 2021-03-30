import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';
import { AdminService } from 'src/admin/admin.service';
import { Permissions } from 'src/admin/permission.entity';


@Resolver(() => Menu)
export class MenuResolver {

    constructor(
        private readonly menuService: MenuService, private adminService: AdminService
    ) { }

    @Query(() => [Menu])
    async findAllMenus() {
        return await this.menuService.findAllMenus();
    }

    @Query(() => [Menu])
    async getMenuRole(@Args('role_id') role_id: number): Promise<Menu[]> {
        return await this.menuService.getMenuRole(role_id);
    }

}