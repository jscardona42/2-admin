import { Test } from '@nestjs/testing';
import { PerfilesService } from './perfiles.service';
import { PerfilesResolver } from './perfiles.resolver';

describe('Perfiles Resolver', () => {
    let perfilesResolver: PerfilesResolver;
    let perfilesService: PerfilesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PerfilesResolver,
                {
                    provide: PerfilesService,
                    useFactory: () => ({
                        getPerfiles: jest.fn(),
                        getPerfilById: jest.fn(),
                        getFilterPerfiles: jest.fn(),
                        createPerfil: jest.fn(),
                        updatePerfil: jest.fn(),
                    }),
                },
            ],
        }).compile();

        perfilesResolver = module.get<PerfilesResolver>(PerfilesResolver);
        perfilesService = module.get<PerfilesService>(PerfilesService);
    });

    describe('Query getPerfiles()', () => {
        it('should invoke perfilesService.getPerfiles()', async () => {
            await perfilesResolver.getPerfiles();
            expect(perfilesService.getPerfiles).toHaveBeenCalled();
        });
    });

    describe('Query getPerfilById()', () => {
        it('should invoke perfilesService.getPerfilById', async () => {
            const testParams = {
                perfil_id: 1
            };
            await perfilesResolver.getPerfilById(testParams.perfil_id);
            expect(perfilesService.getPerfilById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterPerfiles()', () => {
        it('should invoke perfilesService.getFilterPerfiles()', async () => {
            const testParams = {
                nombre: "test"
            };
            await perfilesResolver.getFilterPerfiles(testParams);
            expect(perfilesService.getFilterPerfiles).toHaveBeenCalled();
        });
    });

    describe('Mutation createPerfil()', () => {
        it('should invoke perfilesService.createPerfil', async () => {
            const testParams = {
                nombre: "test",
                descripcion: "test",
                personalizado: true
            };

            await perfilesResolver.createPerfil(testParams);
            expect(perfilesService.createPerfil).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updatePerfil()', () => {
        it('should invoke perfilesService.updatePerfil', async () => {
            const testParams = {
                perfil_id: 1,
                nombre: "test",
                descripcion: "test",
                personalizado: true
            };
            await perfilesResolver.updatePerfil(testParams);
            expect(perfilesService.updatePerfil).toHaveBeenCalledWith(testParams);
        });
    });
});