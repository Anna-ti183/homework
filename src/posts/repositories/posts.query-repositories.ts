import { ObjectId, WithId } from 'mongodb';
import { PostQueryInput } from '../routers/input/post-query.input';
import { Post } from '../domain/posts';
import { postCollection } from '../../db/collections';
import { PostOutput } from '../routers/output/post.output';
import { mapToPaginatedOutputUniversal } from '../../core/mappers/map-to-paginated-output-universal';
import { PostListPaginatedOutput } from '../routers/output/post-list-paginated.output';
import { NotFoundException } from '../../core/exceptions/not-found.exception';


export const postsQueryRepository = {
    //Список постов с пагинацией и сортировкой
    async findMany(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc',
        } = queryDto;

        // 📐 Сколько записей нужно пропустить для текущей страницы
        const skip = (pageNumber - 1) * pageSize;

        // 🧹 Фильтр для MongoDB (пустой — значит ищем все записи)
        const filter: any = {};


        // 2️⃣ СОРТИРОВКА.  // Создаём объект для MongoDB: { поле:  -1 (desc) }
        const sortOptions: any = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;


        //3️⃣ ЗАПРОС К БД (с пагинацией)
        const items = await postCollection
            .find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize)
            .toArray();

        // 4️⃣ ОБЩЕЕ КОЛИЧЕСТВО (без учёта пагинации)
        // Нужно для правильного вычисления pagesCount
        const totalCount = await postCollection.countDocuments(filter);

        //4️⃣ Возврат. Возвращаем данные + общее количество для клиента
        return {
            items,  // массив блогов на текущей странице
            totalCount  // общее количество блогов (всего в базе)
        };
    },

    //Для эндпоинта GET /api/blogs/{blogId}/posts - Список постов конкретного блога с пагинацией
    async findByBlogId(
        blogId: string,
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc',
        } = queryDto;

        // 📐 Сколько записей нужно пропустить для текущей страницы
        const skip = (pageNumber - 1) * pageSize;

        // 🧹 Фильтр для MongoDB (пустой — значит ищем все записи)
        const filter: any = {
            blogId: blogId
        };


        // 2️⃣ СОРТИРОВКА.  // Создаём объект для MongoDB: { поле:  -1 (desc) }
        const sortOptions: any = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
     


        //3️⃣ ЗАПРОС К БД (с пагинацией)
        const items = await postCollection
            .find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize)
            .toArray();

        // 4️⃣ ОБЩЕЕ КОЛИЧЕСТВО (без учёта пагинации)
        // Нужно для правильного вычисления pagesCount
        const totalCount = await postCollection.countDocuments(filter);

        //4️⃣ Возврат. Возвращаем данные + общее количество для клиента
        return {
            items,  // массив блогов на текущей странице
            totalCount  // общее количество блогов (всего в базе)
        };
    },
    
    //Найти пост по ID
    async findById(id: string): Promise<WithId<Post> | null> { // findById ищет запись по Id
        return postCollection.findOne({ _id: new ObjectId(id) }) // findOne() — поиск одного документа. --- ({_id: new ObjectId(id) }) правильный синтаксис для поиска id в Mongodb
    },

    //Найти блог или выбросить ошибку    
    async findByIdOrFail(id: string): Promise<WithId<Post>> { //Вызывает findById
        const res = await postCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new NotFoundException('Blog not exist');
        }
        return res;
    },
}


// Используется для POST /posts (плоский ответ)
export function mapToPostOutput(post: WithId<Post>): PostOutput {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,  // ← берем из поста
        createdAt: post.createdAt,
    };
}


export function mapToPostListPaginatedOutput(
    posts: WithId<Post>[],  //Принимает сырые данные из БД (массив постов)
    meta: { pageNumber: number; pageSize: number; totalCount: number }, // Принимает метаданные пагинации (страница, размер, всего)
): PostListPaginatedOutput {
    return mapToPaginatedOutputUniversal(posts, meta, mapToPostOutput);
}
