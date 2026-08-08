//Возвращает объект с правильными данными для создания блога.  -  Зачем: Чтобы в каждом тесте не писать руками


import { BlogAttributes } from "../../../src/blogs/application/dtos/blog-attributes";

export function getBlogDto(): BlogAttributes {
    return {
        name: 'Blabla',
        description: 'Test Description',
        websiteUrl: 'https://blabla.com'
    };
}