export const emailExamples = {
    registrationEmail(code: string) { //принимает и подставляет его в ссылку: https://somesite.com/confirm-email?code=${code}
        return ` <h1>Thank for your registration</h1> 
               <p>To finish registration please follow the link below:<br>
                  <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a> 
              </p>`
    }
}
//Спасибо за регистрацию
//Чтобы завершить регистрацию, пожалуйста, перейдите по ссылке ниже.
// ссылка