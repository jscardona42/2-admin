
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { EntidadesService } from '../Admin/Entidades/entidades.service';
import { PermisosService } from '../GestiónFuncionalidades/Permisos/permisos.service';
import { RolesService } from '../GestiónFuncionalidades/Roles/roles.service';
import { ValidacionesService } from '../Admin/Validaciones/validaciones.service';
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { SignInUserInput, SignUpUserInput } from './dto/usuarios.dto';
import { UsuariosService } from './usuarios.service';


describe('Usuarios Service', () => {
    let prismaService: PrismaService;
    let usuariosService: UsuariosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRESIN
                    }
                }),
            ],
            providers: [
                UsuariosService, RolesService, AuditoriasService, PermisosService, EntidadesService, ValidacionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        usuarios: {
                            findFirst: jest.fn(() => {
                                return { salt: String }
                            }),
                            findUnique:jest.fn(),
                            usernameExists: jest.fn(() => { return { usernameExists: false } }),
                            findMany: jest.fn(() => { return { usernameExists: false } }),
                            create: jest.fn(() => {
                                return {
                                    id: Number,
                                };
                            }),
                            update: jest.fn(() => { return { usernameExists: false } }),
                            delete: jest.fn(() => { return { usernameExists: false } }),
                        },
                        auditorias: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn()
                        },
                        roles: {
                            findUnique: jest.fn(() => { return { rol_id: 1 } })
                        },
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

    describe('signInUser method', () => {
        it('should invoke prismaService.usuarios.findFirst', async () => {
            var testParams: SignInUserInput = {
                password: "12121",
                username: "usuario2"
            }
            await usuariosService.signInLogin(testParams);
            expect(prismaService.usuarios.findFirst).toHaveBeenCalled();
        });
    });

    // describe('signUpLogin method', () => {
    //     it('should invoke prismaService.usuarios.create', async () => {
    //         var testParams: SignUpUserInput = {
    //             email: "usuario@gmail.com",
    //             nombre: "Johan Cardona",
    //             password: "12121",
    //             rol_id: 1,
    //             username: "usuario2"
    //         }
    //         await usuariosService.signUpLogin(testParams);
    //         expect(prismaService.usuarios.create).toHaveBeenCalled();
    //     });
    // });
})