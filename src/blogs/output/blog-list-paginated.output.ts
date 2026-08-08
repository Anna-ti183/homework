//2️⃣ BlogListPaginatedOutput — полный ответ со списком блогов
//Описывает, как сервер возвращает список блогов с пагинацией. 
// Клиент получает не просто массив блогов, а объект с метаданными о пагинации
// СПИСОК БЛОГОВ


import { BlogOutput } from "./blog.output";


export type BlogListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogOutput[];
};