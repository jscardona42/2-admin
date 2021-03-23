import { Controller, Get, Post, Param, Body, Put, ParseIntPipe, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Post()
    async getMethods(@Body('clsname') clsname: any, @Body('TMPmethods') methods: any) {
        return this.adminService.getMethods(methods, clsname);
    }

}
