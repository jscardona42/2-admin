import { Controller, Post, Body} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    async getMethods(@Body('clsname') clsname: any, @Body('TMPmethods') methods: any) {
        return this.adminService.getMethods(methods, clsname);
    }

}
