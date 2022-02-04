
import { Test } from '@nestjs/testing';
import { EntidadesService } from '../../Admin/Entidades/entidades.service';
import { PrismaService } from '../../../prisma.service';
import { PermisosService } from '../Permisos/permisos.service';
import { AddPermisosToFuncionalidadInput, CreateFuncionalidadInput, FilterFuncionalidadesInput, UpdateFuncionalidadInput } from './dto/funcionalidades.dto';
import { FuncionalidadesService } from './funcionalidades.service';
import { ValidacionesService } from '../../Admin/Validaciones/validaciones.service';

describe('Entidades Service', () => {
    let prismaService: PrismaService;
    let funcionalidadesService: FuncionalidadesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FuncionalidadesService, PermisosService, EntidadesService, ValidacionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        funcionalidades: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(() => { return { entidad_id: 1 } }),
                            create: jest.fn(),
                            createMany: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        funcionalidadesPermisos: {
                            findUnique: jest.fn(() => { return { funcionalidad_id: 1 } }),
                            findFirst: jest.fn(() => { return null }),
                        },
                        permisos: {
                            findUnique: jest.fn(() => { return { permiso_id: 1 } }),
                            findFirst: jest.fn(),
                        },
                        entidades: {
                            findUnique: jest.fn(() => { return { entidad_id: 1 } }),
                            // findFirst: jest.fn(),
                        },
                    }),
                },
            ],
        }).compile();

        funcionalidadesService = module.get<FuncionalidadesService>(FuncionalidadesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getFuncionalidades method', () => {
        it('should invoke prismaService.funcionalidades.findMany', async () => {
            await funcionalidadesService.getFuncionalidades();
            expect(prismaService.funcionalidades.findMany).toHaveBeenCalled();
        });
    });

    describe('getFuncionalidadById method', () => {
        it('should invoke prismaService.funcionalidades.findUnique', async () => {
            const input = {
                funcionalidad_id: 1
            };
            await funcionalidadesService.getFuncionalidadById(
                input.funcionalidad_id
            );
            expect(prismaService.funcionalidades.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterFuncionalidades method', () => {
        it('should invoke prismaService.funcionalidades.findMany', async () => {
            const input: FilterFuncionalidadesInput = {
                entidad_nombre: "",
                nombre: ""
            };
            await funcionalidadesService.getFilterFuncionalidades(input);
            expect(prismaService.funcionalidades.findMany).toHaveBeenCalled();
        });
    });


    describe('createFuncionalidad method', () => {
        it('should invoke prismaService.funcionalidades.create', async () => {
            var input: CreateFuncionalidadInput = {
                entidad_id: 1,
                nombre: "Func",
                FuncionalidadesPermisos: [
                    { permiso_id: 1 }
                ]
            }
            await funcionalidadesService.createFuncionalidad(input);
            expect(prismaService.funcionalidades.create).toHaveBeenCalled();
        });
    });

    describe('updateFuncionalidad method', () => {
        it('should invoke prismaService.funcionalidades.update', async () => {
            var input: UpdateFuncionalidadInput = {
                nombre: "Func",
                funcionalidad_id: 1,
                FuncionalidadesPermisos: [
                    { permiso_id: 10, funcionalidad_permiso_id: 1 }
                ]
            }
            await funcionalidadesService.updateFuncionalidad(input);
            expect(prismaService.funcionalidades.update).toHaveBeenCalled();
        });
    });

    describe('addPermisosToFuncionalidad method', () => {
        it('should invoke prismaService.funcionalidades.update', async () => {
            var input: AddPermisosToFuncionalidadInput = {
                funcionalidad_id: 1,
                FuncionalidadesPermisos: [
                    { permiso_id: 9, }
                ]
            }
            await funcionalidadesService.addPermisosToFuncionalidad(input);
            expect(prismaService.funcionalidades.update).toHaveBeenCalled();
        });
    });

    describe('deleteFuncionalidad method', () => {
        it('should invoke prismaService.funcionalidades.delete', async () => {
            const input = {
                funcionalidad_id: 1
            };
            await funcionalidadesService.deleteFuncionalidad(input.funcionalidad_id);
            expect(prismaService.funcionalidades.delete).toHaveBeenCalled();
        });
    });

})