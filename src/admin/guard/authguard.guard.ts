
import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import * as jwt from 'jsonwebtoken'

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
            return true;
        }

        const authorization = req.headers.authorization;
        const referer = req.headers.authorization_url;

        if ((referer === undefined) || (query !== "signInLogin" && query !== "logOutLogin" && authorization === undefined)) {
            throw new UnauthorizedException("Unauthorized");
        } else if (query === "signInLogin" || query === "logOutLogin") {
            return true;
        }

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

