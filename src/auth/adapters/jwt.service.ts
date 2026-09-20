import jwt from "jsonwebtoken";
import { SETTINGS } from "../../settings/config";

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> { //Создание Access токена 
    return jwt.sign({ userId }, SETTINGS.SECRET_KEY, {
      expiresIn: SETTINGS.AC_TIME, //10 s
    });
  },

  async createRefreshToken(userId: string, deviceId: string): Promise<string> { //Создание Refresh токена 
    return jwt.sign({ userId, deviceId }, SETTINGS.SECRET_KEY, { // попадает внутрь JWT
      expiresIn: SETTINGS.RT_TIME, //20 s
    });
  },

  async verifyToken(token: string): Promise<{ userId: string, deviceId: string, iat: number, exp: number } | null> { // Проверка токена
    try {
      return jwt.verify(token, SETTINGS.SECRET_KEY) as { userId: string, deviceId: string, iat: number, exp: number };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
};