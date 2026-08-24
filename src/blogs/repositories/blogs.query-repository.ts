import { ObjectId, WithId } from "mongodb";
import { BlogQueryInput } from "../routers/input/blog-query.input";
import { Blog } from "../domain/blogs";
import { blogCollection } from "../../db/collections";
import { NotFoundException } from "../../core/exceptions/not-found.exception";
import { mapToPaginatedOutputUniversal } from "../../core/mappers/map-to-paginated-output-universal";
import { BlogOutput } from "../output/blog.output";
import { BlogListPaginatedOutput } from "../output/blog-list-paginated.output";


export const blogsQueryRepository = {

    //Получить список блогов с фильтрацией, пагинацией и сортировкой
    async findMany(
        queryDto: BlogQueryInput,
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            searchNameTerm,
        } = queryDto;

        // 📐 Сколько записей нужно пропустить для текущей страницы
        const skip = (pageNumber - 1) * pageSize;

        // 🧹 Фильтр для MongoDB (пустой — значит ищем все записи)
        const filter: any = {};

        // 1️⃣ ФИЛЬТР (ПОИСК ПО ИМЕНИ). Если передан поисковый термин — добавляем условие в фильтр
        if (searchNameTerm) {
            filter.name = {
                $regex: searchNameTerm,  // регулярное выражение для частичного совпадения
                $options: 'i'      // 'i' — поиск без учёта регистра
            }
        };

        // 2️⃣ СОРТИРОВКА.  // Создаём объект для MongoDB: { поле:  -1 (desc) }
        const sortOptions: any = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
        console.log('sortOptions', sortOptions)

        //3️⃣ ЗАПРОС К БД (с пагинацией)
        const items = await blogCollection
            .find(filter)
            .sort(sortOptions)  // ✅ используем готовый объект
            .skip(skip)
            .limit(pageSize)
            .toArray();

        // 4️⃣ ОБЩЕЕ КОЛИЧЕСТВО (без учёта пагинации)
        // Нужно для правильного вычисления pagesCount
        const totalCount = await blogCollection.countDocuments(filter);

        //4️⃣ Возврат. Возвращаем данные + общее количество для клиента
        return {
            items,  // массив блогов на текущей странице
            totalCount  // общее количество блогов (всего в базе)
        };
    },

//Найти блог по ID
    async findById(id: string): Promise<WithId<Blog> | null> { // findById ищет запись по Id
        return blogCollection.findOne({ _id: new ObjectId(id) });  // findOne() — поиск одного документа. --- ({_id: new ObjectId(id) }) правильный синтаксис для поиска id в Mongodb
    },
    
//Найти блог или выбросить ошибку    
    async findByIdOrFail(id: string): Promise<WithId<Blog>> { //Вызывает findById
        const res = await blogCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new NotFoundException('Blog not exist');
        }
        return res;
    },
    
}

//✅ Для ВСЕХ ЭНДПОИНТОВ из БД в формат ответа клиенту.(view-model для ответа API)
// _id (ObjectId) -> строковый id, плюс отдаём только нужные клиенту поля.
export function mapToBlogOutput(blog: WithId<Blog>): BlogOutput {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    };
}

//Это маппер для пагинированного ответа со списком блогов.
//Преобразует сырые данные из БД в формат BlogListPaginatedOutput с помощью универсальной функции.

export function mapToBlogListPaginatedOutput(
    blogs: WithId<Blog>[],  //Принимает сырые данные из БД (массив блогов)
    meta: { pageNumber: number; pageSize: number; totalCount: number }, // Принимает метаданные пагинации (страница, размер, всего)
): BlogListPaginatedOutput {  //универсальная функция
    return mapToPaginatedOutputUniversal(blogs, meta, mapToBlogOutput);  //Вызывает универсальный маппер
}
