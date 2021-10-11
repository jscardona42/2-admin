import { Controller, Post, Body } from '@nestjs/common';
import { ProveedoresServiciosService } from '../ProveedoresServicios/proveedoresservicios.service';

@Controller('admin')
export class ProveedoresServiciosController {
    constructor(
        private readonly proveedoresServiciosService: ProveedoresServiciosService
    ) { }

    @Post()
    async saveProviders(@Body('myProviders') myProviders: any, @Body('microservicio_id') microservicio_id: number, @Body('secondaryEntities') secondaryEntities: any) {
        return await this.proveedoresServiciosService.saveProveedoresServicios(myProviders, microservicio_id, secondaryEntities);
    }

}