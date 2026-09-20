import { Router } from "express";
import { SECURITYDEVICES_ROUTERS } from "../constsnt/securityDevices.paths";
import { securityDeviceshandler } from "./handler/get-securityDevices.handler";
import { securDevicesRefTokenMiddleware } from "../middleware/securityDevices.middleware";
import { deleteSecurityDevices } from "./handler/delete-securityDevice.handler";
import { deleteSecurityDevicesDeviceId } from "./handler/delete-deviseId.securityDevices.handler";


export const securityDevicesRouter = Router({});

securityDevicesRouter
.get(
    SECURITYDEVICES_ROUTERS.ROOT,
    securDevicesRefTokenMiddleware,
    securityDeviceshandler
)
.delete(
    SECURITYDEVICES_ROUTERS.ROOT,
    securDevicesRefTokenMiddleware,
    deleteSecurityDevices
)

.delete(
    SECURITYDEVICES_ROUTERS.DEVICE_ID,
    securDevicesRefTokenMiddleware,
    deleteSecurityDevicesDeviceId,
)