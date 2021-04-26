// import { MailerModule } from '@nestjs-modules/mailer';
// import { Test } from '@nestjs/testing';
// import { PrismaService } from '../prisma.service';
// import { TwofactorResolver } from './twofactor.resolver';
// import { TwofactorService } from './twofactor.service';

// describe('Twofactor Service', () => {
//     let twofactorService: TwofactorService;
//     let prismaService: PrismaService;
//     let twofactorResolver: TwofactorResolver;

//     beforeEach(async () => {
//         const module = await Test.createTestingModule({
//             imports: [
//                 MailerModule.forRoot({
//                     transport: {
//                         host: process.env.HOST_MAILER,
//                         port: process.env.PORT_MAILER,
//                         auth: {
//                             user: process.env.USER_MAILER,
//                             pass: process.env.PASSWORD_MAILER
//                         },
//                     }
//                 }),
//             ],
//             providers: [
//                 TwofactorService, MailerModule, TwofactorResolver,
//                 {
//                     provide: PrismaService,
//                     useFactory: () => ({
//                         twofactor: {
//                             findFirst: jest.fn(),
//                             findMany: jest.fn(),
//                             findUnique: jest.fn(),
//                             create: jest.fn(() => {
//                                 return {
//                                     id: Number,
//                                 };
//                             }),
//                             update: jest.fn(),
//                             delete: jest.fn(),
//                         },
//                     }),
//                 },
//             ],
//         }).compile();

//         twofactorService = module.get<TwofactorService>(TwofactorService);
//         prismaService = module.get<PrismaService>(PrismaService);
//         twofactorResolver = module.get<TwofactorResolver>(TwofactorResolver);
//     });

//     describe('getTwoFactorById method', () => {
//         it('should invoke prismaService.twofactor.findUnique', async () => {
//             const testParams = {
//                 twofactor_id: 1
//             };
//             await twofactorService.getTwoFactorById(
//                 testParams.twofactor_id
//             );
//             expect(prismaService.twofactor.findUnique).toHaveBeenCalled();
//         });
//     });

//     // describe('getTwoFactorByLoginId method', () => {
//     //     it('should invoke prismaService.twofactor.findFirst', async () => {
//     //         const testParams = {
//     //             login_id: 1
//     //         };
//     //         await twofactorService.getTwoFactorByLoginId(
//     //             testParams.login_id
//     //         );
//     //         expect(prismaService.twofactor.findFirst).toHaveBeenCalled();
//     //     });
//     // });

//     // describe('generateTwoFactorAuthenticationSecret method', () => {
//     //     it('should invoke generateTwoFactorAuthenticationSecret', async () => {
//     //         const testParams = {
//     //             user: { email: "jscardona42@gmail.com" }
//     //         };
//     //         const data = await twofactorService.generateTwoFactorAuthenticationSecret(testParams.user);
//     //         expect(data).toStrictEqual(expect.objectContaining({
//     //             secret: expect.any(String),
//     //             otpauthUrl: expect.any(String),
//     //         }));
//     //     });
//     // });

//     // describe('createTwoFactor', () => {
//     //     it('should create twofactor', async () => {
//     //         var result: Promise<Twofactor>
//     //         jest.spyOn(twofactorService, 'createTwoFactor').mockImplementation(() => result);

//     //         expect(await twofactorResolver.createTwoFactor).toBe(result);
//     //     });
//     // });

//     // describe('createTwoFactor method', () => {
//     //     it('should invoke prismaService.twofactor.create', async () => {
//     //         const testParams = {
//     //             data: {
//     //                 login_id: 1,
//     //                 validation_method_id: 1
//     //             }
//     //         };
//     //         await twofactorService.createTwoFactor(
//     //             testParams.data
//     //         );
//     //         expect(prismaService.twofactor.create).toHaveBeenCalled();
//     //     });
//     // });

//     // describe('insertEntityToFolder method', () => {
//     //     it('should invoke prismaService.menus.create', async () => {
//     //         const testParams = {
//     //             parentId: 4,
//     //             entityName: 'shipping',
//     //         };
//     //         await menuService.insertEntityToFolder(
//     //             testParams.parentId,
//     //             testParams.entityName,
//     //         );
//     //         expect(prismaService.menus.create).toHaveBeenCalled();
//     //     });
//     // });
// });
