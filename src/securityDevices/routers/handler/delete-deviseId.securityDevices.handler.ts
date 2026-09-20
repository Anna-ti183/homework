import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../../auth/application/auth.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";

export async function deleteSecurityDevicesDeviceId(
    req: Request,
    res: Response
) {
    try {
        const userId = req.userId; //текущий пользователь из refreshToken;
        if (!userId) return res.status(HttpStatus.Unauthorized).send();

        const deviceId = req.params.deviceId.toString(); //устройство, которое хотят удалить из req.params


        await authService.deleteOneSession(userId, deviceId)
        return res.status(HttpStatus.NoContent).send()

    } catch (e: unknown) {
        errorsHandler(e, res);
    }

}