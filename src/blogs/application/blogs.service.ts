import { BlogsRepository } from "../repositories/blogs.repository";
import { Blog } from "../domain/blogs";
import { BlogAttributes } from "./dtos/blog-attributes";
import { BlogsQueryRepository } from "../repositories/blogs.query-repository";
import { inject, injectable } from "inversify";


// BLL модуля блогов. Подход обработки ошибок — throw + custom exceptions,
// которые на уровне хендлера ловит errorsHandler. Хендлеры остаются презентационным слоем.

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository ) { }
    
    //Создать новый блог
    async create(dto: BlogAttributes): Promise<string> {  // функция принимает dto — данные от клиента (только name, description, websiteUrl),  Promise<string> — вернет ID созданного блога (строка)
        const newBlog: Blog ={
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }; 

        return this.blogsRepository.create(newBlog); //Репозиторий сохраняет в БД,  БД генерирует id ,Репозиторий возвращает id как строку, Сервис пробрасывает этот id дальше
    }

    //Обновить существующий блог
    async update( id: string, dto: BlogAttributes ): Promise<void> {
        await this.blogsRepository.update(id, dto);
        return;
    }

    //Удалить блог
    async delete(id: string): Promise<void> { //Принимает id для удаления
      
         await this.blogsRepository.delete(id) //передает его в репозиторий --- Возвращает результат (точнее, ничего не возвращает, т.к. Promise<void>)
    }

}

