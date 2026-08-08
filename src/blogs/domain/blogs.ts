export type Blog = {
 //id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string; //($date-time) — строка содержит дату и время в формате ISO 8601
    isMembership: boolean; // статус подписки
};