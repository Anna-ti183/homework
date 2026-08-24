import request from "supertest";
import { Express } from "express";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { UserAttributes } from "../../../src/users/application/dtos/user-attributes";
import { USERS_PATH } from "../../../src/users/constant/users.paths";
import { UserOutput } from "../../../src/users/routers/output/user.output";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { getUserDto } from "./get-user";

export async function createUser(
    app: Express,
    userDto?: UserAttributes,
): Promise <UserOutput> {

    const testUserData = { ...getUserDto(), ...userDto};

    const createdUserResponse = await request(app)
    .post(USERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testUserData)
    .expect(HttpStatus.Created);

return createdUserResponse.body
}