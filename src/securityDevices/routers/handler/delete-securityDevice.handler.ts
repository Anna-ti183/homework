import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../../auth/application/auth.service";

export async function deleteSecurityDevices (
    req: Request,
    res: Response
){
    const userId = req.userId;
    if(!userId) return res.status(HttpStatus.Unauthorized).send();

    const deviceId = req.deviceId;
    if(!deviceId) return res.status(HttpStatus.Unauthorized).send();

    await authService.deleteSecurityDevicesExpectOne(userId,deviceId)
    return res.status(HttpStatus.NoContent).send();

}