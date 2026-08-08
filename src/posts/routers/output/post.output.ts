// DTO для ответа клиенту (Output DTO). 

export type PostOutput = {
    id: string;               
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}