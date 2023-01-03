import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Perfiles } from './entities/perfiles.entity';
import { PerfilesService } from './perfiles.service';
import { CreatePerfilInput, FilterPerfilesInput, UpdatePerfilInput } from './dto/perfiles.dto';

@Resolver(() => Perfiles)
export class PerfilesResolver {

    constructor(
        private readonly perfilesService: PerfilesService
    ) { }

    @Query(() => [Perfiles], { description: "Obtener todos los elementos de la tabla Perfiles" })
    async getPerfiles(): Promise<Perfiles[]> {
        return this.perfilesService.getPerfiles();
    }

    @Query(() => Perfiles, { description: "Obtener un elemento relacionado con el parámetro perfil_id" })
    async getPerfilById(@Args("perfil_id") perfil_id: number): Promise<Perfiles> {
        return this.perfilesService.getPerfilById(perfil_id);
    }

    @Query(() => [Perfiles], { description: "Obtener uno o varios elementos relacionado con los parámetros enviados al dto" })
    async getFilterPerfiles(@Args("data", { nullable: true }) data: FilterPerfilesInput): Promise<Perfiles[]> {
        return this.perfilesService.getFilterPerfiles(data);
    }

    @Mutation(() => Perfiles, { description: "Creación de un nuevo elemento para la tabla Perfiles" })
    async createPerfil(@Args("data") data: CreatePerfilInput): Promise<Perfiles> {
        return this.perfilesService.createPerfil(data);
    }

    @Mutation(() => Perfiles, { description: "Actualización de un elemento de la tabla Perfiles" })
    async updatePerfil(@Args("data") data: UpdatePerfilInput): Promise<Perfiles> {
        return this.perfilesService.updatePerfil(data);
    }
}