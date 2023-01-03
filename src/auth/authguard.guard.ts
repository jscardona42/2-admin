import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
type getPermission = { userId: number };

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {

    constructor() {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const ctx = GqlExecutionContext.create(context);
        let query = context.getHandler().name;
        let req = ctx.getContext().req;

        if (req.headers.authorization_url !== undefined) {
            let referer = CryptoJS.AES.decrypt(req.headers.authorization_url, process.env.KEY_CRYPTO_ADMIN).toString(CryptoJS.enc.Utf8);

            try {
                let url = jwt.verify(referer, process.env.JWT_SECRET_URL);
                if (url === process.env.JWT_URL) {
                    return true;
                }
                await this.setUserId("Bearer " + referer, req);
                return true;
            } catch (error) {
                console.log(error);
            }
        }

        let authorization = req.headers.authorization;

        if ((query !== "signInLogin" && query !== "logOutLogin" && query !== "exGetTraducciones" && authorization === undefined && query !== "saveEntidadesPermisosValidaciones" && query !== "exSendCodeVerification" && query !== "exValidationCodeVerification" && query !== "exChangePasswordLogin" && query !== "exSendMail" && query !== "exValidationCodeMail" && query !== "exConfigTotp" && query !== "exSetActivateConfigTotp" && query !== "exValidateTotpCode" && query !== "exValidateRecoveryCode")) {
            throw new UnauthorizedException("Unauthorized");
        } else if (query === "signInLogin" || query === "logOutLogin" || query === "exGetTraducciones" || query === "saveEntidadesPermisosValidaciones" || query === "exSendCodeVerification" || query === "exValidationCodeVerification" || query === "exChangePasswordLogin" || query === "exSendMail" || query === "exValidationCodeMail" || query === "exConfigTotp" || query === "exSetActivateConfigTotp" || query === "exValidateTotpCode" || query === "exValidateRecoveryCode") {
            return true;
        }

        authorization = CryptoJS.AES.decrypt(authorization, process.env.KEY_CRYPTO).toString(CryptoJS.enc.Utf8);

        try {
            jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET);
            await this.setUserId(authorization, req);
            return true;
        } catch (error) {
            throw new UnauthorizedException("Unauthorized");
        }
    }

    async setUserId(authorization, req) {
        let tmp = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET) as getPermission;
        let userId = tmp.userId;
        req.body.userId = userId;
    }
}
