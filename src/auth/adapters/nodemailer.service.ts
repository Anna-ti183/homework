// сервис отправки

import nodemailer from 'nodemailer';
import { SETTINGS } from '../../settings/config';

export const nodemailerService = {
  async sendEmail(
    email: string, //кому отправить
    code: string,  //код подтверждения
    template: (code: string) => string //шаблон письма, который получит этот код
  ): Promise<boolean> {
    let transporter = nodemailer.createTransport({//nodemailer.createTransport - почтовый курьер
      host: 'smtp.mail.ru', 
      port: 465, 
      secure: true, 
      auth: { 
        user: SETTINGS.EMAIL, 
        pass: SETTINGS.EMAIL_PASS, },

    });

    let info = await transporter.sendMail({ //sendMail() отправляет письмо
      from: `"Annet 👻" <${SETTINGS.EMAIL}>`, //от кого
      to: email,                     //кому
      subject: 'Your code is here',   //тема
      html: template(code), //содержание
    });

    console.log('EMAIL SENT:', info.messageId);

    return !!info; //true / false
  },
};

/*
То есть если передать:

email = "test@mail.com"
code = "ABC123"
template = registrationEmail

то registrationEmail(code) создаст HTML со ссылкой, внутри которой будет ABC123.
*/