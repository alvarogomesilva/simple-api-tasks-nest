import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { REQUEST_TOKEN_PAYLOAD } from "../constants/auth.constants";

export const TokenPayloadParam = createParamDecorator(

    (data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()

        return request[REQUEST_TOKEN_PAYLOAD]
    }
)