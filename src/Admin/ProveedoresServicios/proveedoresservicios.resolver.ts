import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProveedoresServicios } from './entities/proveedoresservicios.entity';
import { ProveedoresServiciosService } from './proveedoresservicios.service';

@Resolver((of) => ProveedoresServicios)
export class ProveedoresServiciosResolver {
    constructor(
        private readonly proveedoresServiciosService: ProveedoresServiciosService,
    ) { }

    @Query((returns) => [ProveedoresServicios])
    async getProveedoresServicios(): Promise<ProveedoresServicios[]> {
        return this.proveedoresServiciosService.getProveedoresServicios();
    }

    @Query((returns) => ProveedoresServicios)
    async getProveedorServicioById(@Args("proveedor_servicio_id") proveedor_servicio_id: number): Promise<ProveedoresServicios> {
        return this.proveedoresServiciosService.getProveedorServicioById(proveedor_servicio_id);
    }

    @Mutation((returns) => ProveedoresServicios)
    async deleteProveedorServicio(@Args("proveedor_servicio_id") proveedor_servicio_id: number): Promise<ProveedoresServicios> {
        return this.proveedoresServiciosService.deleteProveedorServicio(proveedor_servicio_id);
    }
}
