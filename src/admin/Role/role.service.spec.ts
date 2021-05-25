import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { RoleService } from './role.service';


describe('Roles Service', () => {
    let roleService: RoleService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
              RoleService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        roles: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    }),
                },
            ],
        }).compile();

        roleService = module.get<RoleService>(RoleService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getRoles method', () => {
        it('should invoke prismaService.roles.findMany', async () => {
            await roleService.getRoles();
            expect(prismaService.roles.findMany).toHaveBeenCalled();
        });
    });
})
