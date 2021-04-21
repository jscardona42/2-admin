
import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {

    constructor() {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        if (req.headers.authorization === undefined || req.headers.authorization_url) {
            throw new UnauthorizedException("Unauthorized");
        }
        const authorization = req.headers.authorization;
        const referer = req.headers.authorization_url;

        let query = context.getHandler().name;

        if ((authorization === undefined && query !== "signInLogin") || referer !== "http://localhost:4000/graphql") {
            throw new UnauthorizedException("Unauthorized");
        } else {
            return true;
        }
    }
}
