

import { blogsRepository } from "../repositories/blogs.repository";
import { WithId } from "mongodb";
import { BlogQueryInput } from "../routers/input/blog-query.input";
import { Blog } from "../domain/blogs";
import { BlogAttributes } from "./dtos/blog-attributes";



// BLL модуля блогов. Подход обработки ошибок — throw + custom exceptions,
// которые на уровне хендлера ловит errorsHandler. Хендлеры остаются презентационным слоем.

export const blogsService = {

//Получить список блогов с пагинацией и сортировкой
    async findMany(
        queryDto: BlogQueryInput,   // DTO  для фильтрации/пагинации/сортировки.
    ): Promise<{ items :WithId<Blog>[]; totalCount: number }> {  //{ items: ..., totalCount: ... }	Объект с двумя полями--- items: WithId<Driver>[]	Массив блогов с обязательным полем id ---  totalCount: number	Общее количество записей (без учета пагинации)
        return blogsRepository.findMany(queryDto);
    },
// Найти блог по ID или выбросить ошибку
    async findByIdOrFail(id: string): Promise<WithId<Blog>> { 
        return blogsRepository.findByIdOrFail(id);
    },

//Создать новый блог
    async create(dto: BlogAttributes): Promise<string> {  // функция принимает dto — данные от клиента (только name, description, websiteUrl),  Promise<string> — вернет ID созданного блога (строка)
        const newBlog: Blog ={
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }; 

        return blogsRepository.create(newBlog); //Репозиторий сохраняет в БД,  БД генерирует id ,Репозиторий возвращает id как строку, Сервис пробрасывает этот id дальше
    },

//Обновить существующий блог
    async update( id: string, dto: BlogAttributes ): Promise<void> {
        await blogsRepository.update(id, dto);
        return;
    },

//Удалить блог
    async delete(id: string): Promise<void> { //Принимает id для удаления
      
         await blogsRepository.delete(id) //передает его в репозиторий --- Возвращает результат (точнее, ничего не возвращает, т.к. Promise<void>)
    },

};