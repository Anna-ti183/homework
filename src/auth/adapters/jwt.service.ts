import jwt from "jsonwebtoken";
import { SETTINGS } from "../../settings/config";

export const jwtService = {
  async createToken(userId: string): Promise<string> { //Создание токена 
    return jwt.sign({ userId }, SETTINGS.SECRET_KEY, {
      expiresIn: SETTINGS.AC_TIME,
    });
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> { // Проверка токена
    try {
      return jwt.verify(token, SETTINGS.SECRET_KEY) as { userId: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
};