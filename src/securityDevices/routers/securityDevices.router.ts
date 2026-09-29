import { Router } from "express";
import { SECURITYDEVICES_ROUTERS } from "../constsnt/securityDevices.paths";
import { SecurDevicesRefTokenMiddleware } from "../middleware/securityDevices.middleware";
import { container } from "../../composition-root";
import { SecurityDevicesController } from "./handler/handler";

const securityDevicesController = container.get(SecurityDevicesController)
const securDevicesRefTokenMiddleware= container.get(SecurDevicesRefTokenMiddleware)

export const securityDevicesRouter = Router({});

securityDevicesRouter
.get(
    SECURITYDEVICES_ROUTERS.ROOT,
    securDevicesRefTokenMiddleware.securDevicesRefTokenMiddleware.bind(securDevicesRefTokenMiddleware),
    securityDevicesController.getSecurityDevices.bind(securityDevicesController)
)
.delete(
    SECURITYDEVICES_ROUTERS.ROOT,
    securDevicesRefTokenMiddleware.securDevicesRefTokenMiddleware.bind(securDevicesRefTokenMiddleware),
    securityDevicesController.getSecurityDevices.bind(securityDevicesController)
)

.delete(
    SECURITYDEVICES_ROUTERS.DEVICE_ID,
    securDevicesRefTokenMiddleware.securDevicesRefTokenMiddleware.bind(securDevicesRefTokenMiddleware),
    securityDevicesController.deleteDeviceIdSecurityDevices.bind(securityDevicesController)
)