import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { blogsQueryRepository, mapToBlogOutput } from "../../repositories/blogs.query-repository";

export async function getIdBlogHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id //Берёт ID из URL

        const blog = await blogsQueryRepository.findByIdOrFail(id); //Ищет блог в БД

     
        const blogOutput = mapToBlogOutput(blog); //Преобразует в формат для ответа
        
        res.status(HttpStatus.Ok).send(blogOutput)

     } catch (e: unknown) {
    errorsHandler(e, res);
  }
}