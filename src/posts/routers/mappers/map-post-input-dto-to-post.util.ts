
import { WithId } from "mongodb";
import { mapToPaginatedOutputUniversal } from "../../../core/mappers/map-to-paginated-output-universal";
import { Post } from "../../domain/posts";
import { PostListPaginatedOutput } from "../output/post-list-paginated.output";
import { mapToPostData } from "./map-to-post.output";

export function mapToPostListPaginatedOutput(
    posts: WithId<Post>[],  //Принимает сырые данные из БД (массив постов)
    meta: { pageNumber: number; pageSize: number; totalCount: number }, // Принимает метаданные пагинации (страница, размер, всего)
): PostListPaginatedOutput { 
    return mapToPaginatedOutputUniversal(posts, meta, mapToPostData);
}

/*Универсальность — использует общую функцию mapToPaginatedOutputUniversal, которая уже знает, как форматировать пагинированный ответ (с items, totalCount, pagesCount и т.д.)

Разделение ответственности:

mapToPostData — отвечает за преобразование одного поста в нужный формат

mapToPostListPaginatedOutput — отвечает за преобразование списка постов с пагинацией

Переиспользование — не нужно писать логику пагинации каждый раз для каждой сущности

Единообразие — все пагинированные ответы в проекте имеют одинаковую структуру*/