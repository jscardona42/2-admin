
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
        const req = ctx.getContext().req;
        if (req.headers.authorization === undefined && req.headers.authorization_url === undefined) {
            throw new UnauthorizedException("Unauthorized");
        }
        const authorization = req.headers.authorization;
        const referer = req.headers.authorization_url;

        try {
            var token = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET);
            var url = jwt.verify(referer, process.env.JWT_SECRET_URL);
        } catch (error) {
            throw new UnauthorizedException("Unauthorized");
        }

        let query = context.getHandler().name;

        if ((authorization === undefined && query !== "signInLogin") || url !== process.env.JWT_URL) {
            throw new UnauthorizedException("Unauthorized");
        } else {
            return true;
        }
    }
}

