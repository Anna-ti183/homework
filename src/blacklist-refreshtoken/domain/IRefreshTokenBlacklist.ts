export type IRefreshTokenBlackList = {
    token: string; //сам refresh token
    userId: string; //кому принадлежит
    expiresAt: Date; //когда токен перестаёт быть актуальным
}