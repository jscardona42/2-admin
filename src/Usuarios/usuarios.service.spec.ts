
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UsuariosService } from './usuarios.service';


describe('Iconos Service', () => {
    let prismaService: PrismaService;
    let usuariosService: UsuariosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        usuarios: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            createMany: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        }
                    }),
                },
            ],
        }).compile();

        usuariosService = module.get<UsuariosService>(UsuariosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getUsuarios method', () => {
        it('should invoke prismaService.usuarios.findMany', async () => {
            await usuariosService.getUsuarios();
            expect(prismaService.usuarios.findMany).toHaveBeenCalled();
        });
    });

    describe('getUsuarioById method', () => {
        it('should invoke prismaService.usuarios.findUnique', async () => {
            const testParams = {
                usuario_id: 1
            };
            await usuariosService.getUsuarioById(
                testParams.usuario_id
            );
            expect(prismaService.usuarios.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterUsuarios method', () => {
        it('should invoke prismaService.usuarios.findMany', async () => {
            const testParams = {
                email: "a",
                nombre: "a"
            };
            await usuariosService.getFilterUsuarios(
                testParams.email, testParams.nombre
            );
            expect(prismaService.usuarios.findMany).toHaveBeenCalled();
        });
    });


    describe('createUsuario method', () => {
        it('should invoke prismaService.usuarios.create', async () => {
            var testParams = {
                data: {
                    nombre: "Nombre",
                    email: "a",
                }
            }
            await usuariosService.createUsuario(testParams.data);
            expect(prismaService.usuarios.create).toHaveBeenCalled();
        });
    });

    describe('updateUsuario method', () => {
        it('should invoke prismaService.usuarios.update', async () => {
            var testParams = {
                data: {
                    nombre: "Nombre",
                    email: "a",
                    usuario_id: 1
                }
            }
            await usuariosService.updateUsuario(testParams.data);
            expect(prismaService.usuarios.update).toHaveBeenCalled();
        });
    });

    describe('deleteUsuario method', () => {
        it('should invoke prismaService.usuarios.delete', async () => {
            const testParams = {
                usuario_id: 1
            };
            await usuariosService.deleteUsuario(testParams.usuario_id);
            expect(prismaService.usuarios.delete).toHaveBeenCalled();
        });
    });

})