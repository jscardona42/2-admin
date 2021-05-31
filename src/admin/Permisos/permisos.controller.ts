import { Controller, Post, Body } from '@nestjs/common';
import { PermisosService } from './permisos.service';

@Controller('admin')
export class PermisosController {
    constructor(private readonly permissionService: PermisosService) { }

    @Post()
    async getMethods(@Body('nameMethods') methods: any) {
        return this.permissionService.getMethods(methods);
    }

}
