import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { PermisosService } from './permisos.service';

@Controller('admin')
export class PermisosController {
    constructor(private readonly permissionService: PermisosService) { }

    @Post()
    async getMethods(@Body('nameMethods') nameMethods: any) {
        return this.permissionService.getMethods(nameMethods);
    }

}
