import { Controller, Post, Body} from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('admin')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post()
    async getMethods(@Body('nameMethods') methods: any) {
        return this.permissionService.getMethods(methods);
    }

}
