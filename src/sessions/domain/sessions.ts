// доменная модель для сессий
export type session = {
    user_id: string;
    device_id: string;
    iat: number;
    device_name: string;
    ip: string;
    exp: number;
    lastActiveDate:Date;
}