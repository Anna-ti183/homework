import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { AuthService } from "../../../auth/application/auth.service";
import { inject, injectable } from "inversify";

@injectable()
export class SecurityDevicesController {
    constructor(@inject(AuthService) protected authService: AuthService){}
    async deleteDeviceIdSecurityDevices( req: Request, res: Response){
        try {
                const userId = req.userId; //текущий пользователь из refreshToken;
                if (!userId) return res.status(HttpStatus.Unauthorized).send();
        
                const deviceId = req.params.deviceId.toString(); //устройство, которое хотят удалить из req.params
        
        
                await this.authService.deleteOneSession(userId, deviceId)
                return res.status(HttpStatus.NoContent).send()
        
            } catch (e: unknown) {
                errorsHandler(e, res);
            }
    }

    async deleteSecurityDevices(req: Request, res: Response){
        const userId = req.userId;
            if(!userId) return res.status(HttpStatus.Unauthorized).send();
        
            const deviceId = req.deviceId;
            if(!deviceId) return res.status(HttpStatus.Unauthorized).send();
        
            await this.authService.deleteSecurityDevicesExpectOne(userId,deviceId)
            return res.status(HttpStatus.NoContent).send();
    }

    async getSecurityDevices(req: Request, res: Response){
        //получаем userId, который положил middleware
            const userId = req.userId
            if(!userId) 
                return res.status(HttpStatus.Unauthorized).send();
        
        
           const result =  await this.authService.securityDevices(userId);
           return res.status(HttpStatus.Ok).send(result);
    }
}