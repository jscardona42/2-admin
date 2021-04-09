import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { Login } from 'src/users/login.entity';
import { LoginService } from 'src/users/login.service';

import { toFileStream, toDataUrl } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {
    constructor(
        private readonly loginService: LoginService
    ) { }

    public async generateTwoFactorAuthenticationSecret(user) {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(user.email, "Maia ERP", secret);
        return { secret, otpauthUrl }
    }


    public validateTwoFactorCode(data: any, twofactor) {

        return authenticator.verify({
            token: data.code,
            secret: twofactor.twofactor_secret
        })
    }

    // public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    //     return toFileStream(stream, otpauthUrl);
    // }
}