import { UserAttributes } from "../../../src/users/application/dtos/user-attributes";

export function getUserDto(): UserAttributes {
    return {
        login: 'testuser',
        password: 'test123',
        email: 'test@test.dev'
    };
}