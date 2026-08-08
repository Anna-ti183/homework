// Превращает документ блога из БД (WithId<Blog>) во view-model для ответа API:
// _id (ObjectId) -> строковый id, плюс отдаём только нужные клиенту поля.

//Это мапперы для преобразования блога из БД в формат ответа клиенту.

import { WithId } from "mongodb";
import { Blog } from "../../domain/blogs";
import { BlogOutput } from "../../output/blog.output";


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


