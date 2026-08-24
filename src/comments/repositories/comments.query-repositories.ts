import { ObjectId, WithId } from "mongodb";
import { CommentQueryInput } from "../router/input/comment.query.input";
import { Comment } from "../domain/comment";
import { commentCollection } from "../../db/collections";
import { CommentOutput } from "../output/comment.output";
import { mapToPaginatedOutputUniversal } from "../../core/mappers/map-to-paginated-output-universal";
import { CommentListPaginatedOutput } from "../router/output/comments-list-paginated.output";
import { NotFoundException } from "../../core/exceptions/not-found.exception";

export const commentsQueryRepository = {
    async findMany(
        queryDto: CommentQueryInput,
        postId: string,
    ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc',
        } = queryDto;

        // 📐 Сколько записей нужно пропустить для текущей страницы
        const skip = (pageNumber - 1) * pageSize;

        // 🧹 Фильтр для MongoDB получаем комментарии для конкретного поста
        const filter = { postId };

        // 2️⃣ СОРТИРОВКА.  // Создаём объект для MongoDB: { поле:  -1 (desc) }
        const sortOptions: any = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;

        //3️⃣ ЗАПРОС К БД (с пагинацией)
        const items = await commentCollection
            .find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize)
            .toArray();

        // 4️⃣ ОБЩЕЕ КОЛИЧЕСТВО (без учёта пагинации)
        // Нужно для правильного вычисления pagesCount
        const totalCount = await commentCollection.countDocuments(filter);

        //4️⃣ Возврат. Возвращаем данные + общее количество для клиента
        return {
            items,
            totalCount
        };
    },

    //Найти комментарий по ID
    async findById(id: string): Promise<WithId<Comment> | null> {
        return commentCollection.findOne({ _id: new ObjectId(id) });
    },

    //Найти комментарий или выбросить ошибку 
    async findByIdOrFail(id: string): Promise<WithId<Comment>> {
        const res = await commentCollection.findOne({ _id: new ObjectId(id) });
        if (!res) {
            throw new NotFoundException('Comment not exist');
        }
        return res;
    }
}

// для 1 коментария 
export function mapToCommentOutput(comment: WithId<Comment>): CommentOutput {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.userId,
            userLogin: comment.userLogin,
        },
        createdAt: comment.createdAt,
    };
}

export function mapToCommentListPaginatedOutput(
    comments: WithId<Comment>[],  //Принимает сырые данные из БД 
    meta: { pageNumber: number; pageSize: number; totalCount: number }, // Принимает метаданные пагинации (страница, размер, всего)
): CommentListPaginatedOutput {
    return mapToPaginatedOutputUniversal(comments, meta, mapToCommentOutput);
}
