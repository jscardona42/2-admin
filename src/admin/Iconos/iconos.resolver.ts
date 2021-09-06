import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateIconoInput, UpdateIconoInput } from './dto/iconos.dto';
import { Iconos } from './entities/iconos.entity';
import { IconosService } from './iconos.service';

@Resolver((of) => Iconos)
export class IconosResolver {
    constructor(
        private readonly iconosService: IconosService,
    ) { }

    @Query((returns) => [Iconos])
    async getIconos(): Promise<Iconos[]> {
        return this.iconosService.getIconos();
    }

    @Query((returns) => Iconos)
    async getIconoById(@Args("icono_id") icono_id: number): Promise<Iconos> {
        return this.iconosService.getIconoById(icono_id);
    }

    @Query(() => [Iconos])
    async getFilterIconos(
        @Args("nombre", { nullable: true }) nombre: string,
        @Args("unicode", { nullable: true }) unicode: string): Promise<Iconos[]> {
        return await this.iconosService.getFilterIconos(nombre, unicode);
    }

    @Mutation((returns) => Iconos)
    async createIcono(@Args("data") data: CreateIconoInput): Promise<Iconos> {
        return this.iconosService.createIcono(data);
    }

    @Mutation((returns) => Iconos)
    async updateIcono(@Args("data") data: UpdateIconoInput): Promise<Iconos> {
        return this.iconosService.updateIcono(data);
    }

    @Mutation((returns) => Iconos)
    async deleteIcono(@Args("icono_id") icono_id: number): Promise<Iconos> {
        return this.iconosService.deleteIcono(icono_id);
    }
}
