// Это DTO для query-параметров при получении списка блогов. 
// Описывает, какие параметры клиент может передать в URL при GET /api/blogs.

//Определяет структуру req.query для запроса списка блогов с пагинацией, сортировкой и поиском.



import { BlogSortField } from "./blog-sort-field";
import { PaginationAndSorting } from "../../../core/types/pagination-and-sorting";

export type BlogQueryInput = PaginationAndSorting<BlogSortField> & 
Partial<{ // Она делает все поля объекта опциональными (добавляет ? к каждому полю)
    searchNameTerm: string;
}>;

/*
Разбор структуры:

1️⃣ PaginationAndSorting<BlogSortField>
Базовый тип для пагинации и сортировки
Содержит поля: pageNumber, pageSize, sortBy, sortDirection

BlogSortField — ограничивает, по каким полям можно сортировать

2️⃣ Partial<{ searchBlogNameTerm: string }>
Добавляет опциональное поле для поиска по имени блога

Partial — делает поле опциональным (можно не передавать)
*/