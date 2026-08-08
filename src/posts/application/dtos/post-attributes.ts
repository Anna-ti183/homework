// Это входной DTO для постов. Клиент присылает эти данные при создании или обновлении поста.

export type PostAttributes = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}