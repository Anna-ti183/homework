import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.service";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { mapToBlogOutput } from "../mappers/map-to-blog-output.util";

export async function getIdBlogHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id //Берёт ID из URL

        const blog = await blogsService.findByIdOrFail(id); //Ищет блог в БД

     
        const blogOutput = mapToBlogOutput(blog); //Преобразует в формат для ответа
        
        res.status(HttpStatus.Ok).send(blogOutput)

     } catch (e: unknown) {
    errorsHandler(e, res);
  }
}