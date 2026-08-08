import { Post } from '../domain/posts'
import { ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../db/collections';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { PostQueryInput } from '../routers/input/post-query.input';
import { PostAttributes } from '../application/dtos/post-attributes';

export const postsRepository = {
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
    ):Promise<{ items: WithId<Post>[]; totalCount: number }> {
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
        console.log('sortOptions', sortOptions)


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

    //Создать новый пост
    async create(newPost: Post): Promise<string> {
        const insertResult = await postCollection.insertOne(newPost); //insertOne() — добавление одного документа.
        return insertResult.insertedId.toString();
    },

    //Обновить пост (все поля, включая blogId)
    async update(
        id: string,
        dto: PostAttributes
    ): Promise<void> {
        const updateResult = await postCollection.updateOne( //postCollection.updateOne() - метод MongoDB для обновления одного документа
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                }
            }
        );
        if (updateResult.matchedCount < 1) { //Количество документов, подходящих под фильтр
            throw new NotFoundException('Post not exist');
        }

        return; //Успешное завершение (ничего не возвращаем
    },

    //Удалить пост
    async delete(id: string): Promise<void> {
        const deleteResult = await postCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new NotFoundException('Post not exist');
        }

        return;
    }
}

