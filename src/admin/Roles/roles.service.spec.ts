import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { RolesService } from './roles.service';


describe('Roles Service', () => {
    let roleService: RolesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
              RolesService,
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

        roleService = module.get<RolesService>(RolesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getRoles method', () => {
        it('should invoke prismaService.roles.findMany', async () => {
            await roleService.getRoles();
            expect(prismaService.roles.findMany).toHaveBeenCalled();
        });
    });
})
