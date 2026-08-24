import { AuthAttributes } from "../../../src/auth/application/dtos/auth.attributes";

export function getLoginDto(): AuthAttributes {
    return {
        loginOrEmail: 'testuser',
        password: 'test123',
    };
}