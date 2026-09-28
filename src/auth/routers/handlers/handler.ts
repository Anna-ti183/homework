import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { AuthAttributes, RegistrConfirmDTO, RegistrDTO, RegistrEmailResending } from "../../application/dtos/auth.attributes";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { UsersRepository } from "../../../users/repositories/users.repository";
import { AuthService } from "../../application/auth.service";
import { inject, injectable } from "inversify";

@injectable()
export class AuthController {
    
    constructor(@inject(AuthService) protected authService: AuthService,
                @inject(UsersRepository) protected usersRepository: UsersRepository){}
    async getAuthMe (req:Request,res:Response){
        const userId = req.userId;
        
            if(userId === null){
                return res.sendStatus(HttpStatus.Unauthorized)
            }
            const user = await this.usersRepository.findById(userId) 
        
            if(user === null){
                return res.sendStatus(HttpStatus.Unauthorized)
            }
        
           const userOutput = {
            email: user.email,
            login: user.login,
            userId: userId, //D пользователя, который мы достали из JWT, тип string
        }
        return res.status(HttpStatus.Ok).send(userOutput)
    }

    async login( req: Request<{}, {}, AuthAttributes>, res: Response){
        try {
               const ip = req.ip;  //IP
                const deviceName = req.headers['user-agent'] || 'Unknown device'; //deviceName
               
                // 1. Вызываем сервис для логина
                const tokens = await this.authService.loginUser(req.body, ip!,deviceName);
        
                // 2. Если accessToken есть возвращаем статус 200 и сам токен
                if (tokens) {
                    const accessToken = tokens.accessToken
                    const refreshToken = tokens.refreshToken
        
                    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, })
                    res.status(HttpStatus.Ok).send({ accessToken })
        
                } else {
                    res.status(HttpStatus.Unauthorized).send()
                }
        
            } catch (e: unknown) {
                errorsHandler(e, res);
            }
    }

    async logout(req:Request,res:Response){
        try {
                const oldRefreshToken = req.cookies.refreshToken;
        
                if (!oldRefreshToken) return res.status(HttpStatus.Unauthorized).send()
        
        
                const oldToken = await this.authService.logout(oldRefreshToken)
        
                if (oldToken === true) return res.status(HttpStatus.NoContent).send()
        
                if (oldToken === false) return res.status(HttpStatus.Unauthorized).send()
        
            } catch (e: unknown) {
                errorsHandler(e, res);
            }
    }

    async refreshToken(req:Request,res:Response){
        try{
                const oldRefreshToken = req.cookies.refreshToken //достаем старый токен из cookie
                if(!oldRefreshToken){  //если клиент не прислал корректный refresh token
                 return res.status(HttpStatus.Unauthorized).send()
                }; 
        
                //token = новая пара токенов ИЛИ null 
                const token = await this.authService.refreshTokens(oldRefreshToken);
        
                if(token === null){ //если refresh token недействителен или уже в blacklist.
                    return res.status(HttpStatus.Unauthorized).send()
                };
        
                //достаём из token новые accessToken и  refreshToken
                const accessToken = token.accessToken;
                const refreshToken = token.refreshToken;
        
                //новый refreshToken нужно положить обратно в cookie
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, })
                res.status(HttpStatus.Ok).send({accessToken})
        
               } catch (e: unknown) {
                   errorsHandler(e, res);
               }
    }

    async registrationConfirmation(req: Request<{}, {}, RegistrConfirmDTO>,res: Response){
         try{
                const result = await this.authService.registrConfirmUser(req.body)
        
                if(result){
                    res.status(HttpStatus.NoContent).send()
                }else{
                    res.status(HttpStatus.BadRequest).send()
                }
            }catch (e: unknown){
                errorsHandler(e, res);
            }
    }

    async registrationEmailResending( req: Request<{}, {}, RegistrEmailResending>, res: Response){
        try {
                const result = await this.authService.registrEmailResending(req.body)
        
                if (result) {
                    res.status(HttpStatus.NoContent).send()
                } else {
                    res.status(HttpStatus.BadRequest).send()
                }
            } catch (e: unknown) {
                errorsHandler(e, res);
            }
    }

    async registration( req: Request<{}, {}, RegistrDTO>, res: Response){
        try {
                const result = await this.authService.registrUser(req.body)
        
                if (result) {
                    res.status(HttpStatus.NoContent).send()
                } else {
                    res.status(HttpStatus.BadRequest).send()
                }
        
            } catch (e: unknown) {
                errorsHandler(e, res);
            }
    }
}
