//Мы не отправляем письмо реально, а создаём mock (заглушку) для сервиса отправки email, 
// который имитирует успешную отправку письма и просто возвращает true

import { nodemailerService } from "../../src/auth/adapters/nodemailer.service"

export const emailServiceMock: typeof nodemailerService = { //Мой mock должен иметь такую же структуру, как настоящий nodemailerService
  async sendEmail( //здесь мы создаём поддельный sendEmail
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<boolean> {
    return true;
  },
};