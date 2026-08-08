// Репозиторий отвечает ТОЛЬКО за работу с БД. 
// Он выполняет CRUD-операции и ничего не знает про HTTP, бизнес-логику или хэндлеры.

import { Blog } from "../domain/blogs";
import { ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../db/collections";
import { BlogQueryInput } from "../routers/input/blog-query.input";
import { NotFoundException } from "../../core/exceptions/not-found.exception";
import { BlogAttributes } from "../application/dtos/blog-attributes";


export const blogsRepository = {

    //Получить список блогов с фильтрацией, пагинацией и сортировкой
    async findMany(
        queryDto: BlogQueryInput,
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            searchBlogNameTerm,
        } = queryDto;

        // 📐 Сколько записей нужно пропустить для текущей страницы
        const skip = (pageNumber - 1) * pageSize;

        // 🧹 Фильтр для MongoDB (пустой — значит ищем все записи)
        const filter: any = {};

        // 1️⃣ ФИЛЬТР (ПОИСК ПО ИМЕНИ). Если передан поисковый термин — добавляем условие в фильтр
        if (searchBlogNameTerm) {
            filter.name = {
                $regex: searchBlogNameTerm,  // регулярное выражение для частичного совпадения
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

//Сохранить новый блог в БД

    async create(newBlog: Blog): Promise<string> { //newBlog: Blog — принимает объект блога (с уже добавленными createdAt и isMembership), 
        const insertResult = await blogCollection.insertOne(newBlog); //blogCollection.insertOne(newBlog)	Вставляет новый документ в коллекцию MongoDB

        return insertResult.insertedId.toString();  //insertResult.insertedId	Содержит сгенерированный MongoDB ObjectId
    },

//Обновить существующий блог
    async update(
        id: string,   //принимает id
        dto: BlogAttributes  //принимает данные для обновления (тип)
    ): Promise<void> {         //Ничего не возвращает (только обновляет)
        const updateResult = await blogCollection.updateOne( //blogCollection.updateOne()	Обновляет один документ в MongoDB
            {
                _id: new ObjectId(id), //Фильтр — ищем блог по _id
            },
            {
                $set: {  //Обновляем только указанные поля - $set — это оператор MongoDB, который говорит базе данных, какие поля обновить. Это НЕ дублирование, а инструкция для БД.
                    name: dto.name,
                    description: dto.description,
                    websiteUrl: dto.websiteUrl
                }
            }
        );

        if (updateResult.matchedCount < 1) { //Количество документов, подходящих под фильтр
            throw new NotFoundException('Blog not exist');
        }

        return; //Успешное завершение (ничего не возвращаем
    },

// Удалить блог
     async delete(id: string): Promise<void> {
         const deleteResult = await blogCollection.deleteOne({ // deleteOne() — удаление одного документа.
             _id: new ObjectId(id),
         });

        if(deleteResult.deletedCount < 1){
             throw new NotFoundException('Blog not exist');
        }

         return;
     },

};


