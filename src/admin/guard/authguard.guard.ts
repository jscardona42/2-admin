import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {

    constructor() {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const ctx = GqlExecutionContext.create(context);
        let query = context.getHandler().name;
        var req;
        req = ctx.getContext().req;

        if (query === "getMethods") {
            req = ctx.getArgs().req;

            if (req.headers.authorization_url === undefined) {
                throw new UnauthorizedException("Unauthorized");
            }

            let referer = CryptoJS.AES.decrypt(req.headers.authorization_url, process.env.KEY_CRYPTO_ADMIN).toString(CryptoJS.enc.Utf8);

            try {
                var url = jwt.verify(referer, process.env.JWT_SECRET_URL);
                if (url === process.env.JWT_URL) {
                    return true;
                }
            } catch (error) {
                console.log(error);
            }
        }

        let authorization = req.headers.authorization;
        let referer = req.headers.authorization_url;

        if ((referer === undefined) || (query !== "signInLogin" && query !== "logOutLogin" && authorization === undefined)) {
            throw new UnauthorizedException("Unauthorized");
        } else if (query === "signInLogin" || query === "logOutLogin") {
            return true;
        }

        authorization = CryptoJS.AES.decrypt(authorization, process.env.KEY_CRYPTO).toString(CryptoJS.enc.Utf8);
        referer = CryptoJS.AES.decrypt(referer, process.env.KEY_CRYPTO).toString(CryptoJS.enc.Utf8);

        try {
            jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET);
            var url = jwt.verify(referer, process.env.JWT_SECRET_URL);
        } catch (error) {
            throw new UnauthorizedException("Unauthorized");
        }

        if (url !== process.env.JWT_URL) {
            throw new UnauthorizedException("Unauthorized");
        } else {
            return true;
        }
    }
}
