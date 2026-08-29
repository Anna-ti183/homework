import { ObjectId, WithId } from "mongodb";
import { UserQueryInput } from "../routers/input/user-query.input";
import { IUserDB } from "../domain/users";
import { userCollection } from "../../db/collections";
import { NotFoundException } from "../../core/exceptions/not-found.exception";
import { UserOutput } from "../routers/output/user.output";
import { UserListPaginatedOutput } from "../routers/output/user-list.paginated.output";
import { mapToPaginatedOutputUniversal } from "../../core/mappers/map-to-paginated-output-universal";

export const usersQueryRepository = {

    //Получить список пользователей  с фильтрацией, пагинацией и сортировкой
    async findMany(
        queryDto: UserQueryInput,
    ): Promise<{ items: WithId<IUserDB>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            searchLoginTerm,
            searchEmailTerm,
        } = queryDto;

        // 📐 Сколько записей нужно пропустить для текущей страницы
        const skip = (pageNumber - 1) * pageSize;

        // 🧹 Фильтр для MongoDB (пустой — значит ищем все записи)
        const filter: any = {};


         // 1️⃣ ФИЛЬТР (ПОИСК ПО логину или ПОИСК ПО емаил). Если передан поисковый термин — добавляем условие в фильтр
       if (searchLoginTerm || searchEmailTerm) {
            filter.$or = [];

            if (searchLoginTerm) {
                filter.$or.push({
                    login: {
                        $regex: searchLoginTerm,
                        $options: 'i',
                    },
                });
            }

            if (searchEmailTerm) {
                filter.$or.push({
                    email: {
                        $regex: searchEmailTerm,
                        $options: 'i',
                    },
                });
            }
        }

        // 2️⃣ СОРТИРОВКА.  // Создаём объект для MongoDB: { поле:  -1 (desc) }
        const sortOptions: any = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;

        //3️⃣ ЗАПРОС К БД (с пагинацией)
        const items = await userCollection
            .find(filter)
            .sort(sortOptions)  // ✅ используем готовый объект
            .skip(skip)
            .limit(pageSize)
            .toArray();

        // 4️⃣ ОБЩЕЕ КОЛИЧЕСТВО (без учёта пагинации)
        // Нужно для правильного вычисления pagesCount
        const totalCount = await userCollection.countDocuments(filter);


        //4️⃣ Возврат. Возвращаем данные + общее количество для клиента
        return {
            items,  // массив юзеров на текущей странице
            totalCount  // общее количество юзеров (всего в базе)
        };
    },

    //Найти пользователя  по ID
    async findById(id: string): Promise<WithId<IUserDB> | null> {
        return userCollection.findOne({ _id: new ObjectId(id) }); // правильный синтаксис для поиска id в Mongodb
    },

    //Найти пользователя  или выбросить ошибку
    async findByOrFail(id: string): Promise<WithId<IUserDB>> {

        if (!ObjectId.isValid(id)) { //проверка на валидность
            throw new NotFoundException('User not found');
        }

        const res = await userCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new NotFoundException('User not found')
        }
        return res;
    },

}

//✅ Для ВСЕХ ЭНДПОИНТОВ из БД в формат ответа клиенту.(view-model для ответа API)
export function mapToUserOutput(user: WithId<IUserDB>): UserOutput {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    };
}

//✅ Это маппер для пагинированного ответа со списком пользователей.
export function mapToUserListPaginatedOutput(
    users: WithId<IUserDB>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
): UserListPaginatedOutput {
    return mapToPaginatedOutputUniversal(users, meta, mapToUserOutput);
}


