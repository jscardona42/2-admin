import { Controller, Post, Body } from '@nestjs/common';
import { ProveedoresServiciosService } from '../ProveedoresServicios/proveedoresservicios.service';

@Controller('admin')
export class ProveedoresServiciosController {
    constructor(
        private readonly proveedoresServiciosService: ProveedoresServiciosService
    ) { }

    @Post()
    async saveProviders(@Body('myProviders') myProviders: any, @Body('microservicio') microservicio: string, @Body('modelData') modelData: any) {
        return this.proveedoresServiciosService.saveProveedoresServicios(myProviders, microservicio, modelData);
    }

}