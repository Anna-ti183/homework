import { Router } from "express";
import { SECURITYDEVICES_ROUTERS } from "../constsnt/securityDevices.paths";
import { securDevicesRefTokenMiddleware } from "../middleware/securityDevices.middleware";
import { container } from "../../composition-root";
import { SecurityDevicesController } from "./handler/handler";

const securityDevicesController = container.get(SecurityDevicesController)

export const securityDevicesRouter = Router({});

securityDevicesRouter
.get(
    SECURITYDEVICES_ROUTERS.ROOT,
    securDevicesRefTokenMiddleware,
    securityDevicesController.getSecurityDevices.bind(securityDevicesController)
)
.delete(
    SECURITYDEVICES_ROUTERS.ROOT,
    securDevicesRefTokenMiddleware,
    securityDevicesController.getSecurityDevices.bind(securityDevicesController)
)

.delete(
    SECURITYDEVICES_ROUTERS.DEVICE_ID,
    securDevicesRefTokenMiddleware,
    securityDevicesController.deleteDeviceIdSecurityDevices.bind(securityDevicesController)
)