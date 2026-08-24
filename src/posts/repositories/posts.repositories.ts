import { Post } from '../domain/posts'
import { ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../db/collections';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { PostAttributes } from '../application/dtos/post-attributes';

export const postsRepository = {
   

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

