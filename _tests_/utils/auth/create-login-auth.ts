import request from "supertest";
import { Express } from "express";
import { AuthAttributes } from "../../../src/auth/application/dtos/auth.attributes";
import { AUTH_PATH, AUTH_ROUTERS } from "../../../src/auth/constant/auth.paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { getLoginDto } from "./get-login-dto.auth";

export async function loginUserAuth(
    app: Express,
    loginDto?: AuthAttributes,
): Promise<request.Response> {

    const testAuthData = { ...getLoginDto(), ...loginDto};

    const loginAuthResponse = await request(app)
    .post(`${AUTH_PATH}${AUTH_ROUTERS.LOGIN}`)
    .send(testAuthData)

return loginAuthResponse;
}