import { Request, Response } from "express";
import { authService } from "../../../auth/application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function securityDeviceshandler(
    req: Request,
    res: Response
){
    //получаем userId, который положил middleware
    const userId = req.userId
    if(!userId) 
        return res.status(HttpStatus.Unauthorized).send();


   const result =  await authService.securityDevices(userId);
   return res.status(HttpStatus.Ok).send(result);
}