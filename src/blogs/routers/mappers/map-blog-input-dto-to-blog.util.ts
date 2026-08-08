//Это маппер для пагинированного ответа со списком блогов.
//  Преобразует сырые данные из БД в формат BlogListPaginatedOutput с помощью универсальной функции.

import { WithId } from "mongodb";
import { Blog } from "../../domain/blogs";
import { mapToBlogOutput } from "./map-to-blog-output.util";
import { BlogListPaginatedOutput } from "../../output/blog-list-paginated.output";
import { mapToPaginatedOutputUniversal } from "../../../core/mappers/map-to-paginated-output-universal";


export function mapToBlogListPaginatedOutput(
    blogs: WithId<Blog>[],  //Принимает сырые данные из БД (массив блогов)
    meta: { pageNumber: number; pageSize: number; totalCount: number }, // Принимает метаданные пагинации (страница, размер, всего)
): BlogListPaginatedOutput {  //универсальная функция
    return mapToPaginatedOutputUniversal(blogs, meta, mapToBlogOutput);  //Вызывает универсальный маппер
}


