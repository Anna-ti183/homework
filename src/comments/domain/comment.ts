
export type Comment = {
    content: string;
    postId: string; //нужен нам для поиска комментариев поста
    userId: string;
    userLogin: string;
    createdAt: string;
}