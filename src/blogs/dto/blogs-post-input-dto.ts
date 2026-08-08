// Это DTO для создания поста в контексте блога.  - DTO для blogs/{blogId}/posts

/*Описывает структуру тела запроса при создании поста через блог
Клиент присылает только title, shortDescription, content
blogId передаётся в URL (в параметрах пути), а не в теле*/


export type BlogPostInputDto= {
    title: string;
    shortDescription: string;
    content: string;
};

