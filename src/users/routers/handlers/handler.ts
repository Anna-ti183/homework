import { Request, Response } from "express";
import { UserAttributes } from "../../application/dtos/user-attributes";
import { mapToUserListPaginatedOutput, mapToUserOutput, UsersQueryRepository } from "../../repositories/users.query-repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors.handler";
import { UserQueryInput } from "../input/user-query.input";
import { UsersService } from "../../application/users.service";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {
    constructor(@inject(UsersService) protected usersService: UsersService,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ){}
    async createUser(req: Request<{}, {}, UserAttributes>, res: Response,) { //  Дженерики -  P   ResBody ReqBody
        try {
            // 1. Создаем - (получаем ID)
            const createdUserId = await this.usersService.create(req.body);

            // 2. Находим по ID
            const createdUser = await this.usersQueryRepository.findById(createdUserId);

            // ✅ Проверяем, что пользователь найден
            if (!createdUser) {
                throw new Error('User not found after creation');
            }

            // 3. Маппим в формат для ответа клиенту
            const userOutput = mapToUserOutput(createdUser);

            // 4. Отдаем клиенту
            res.status(HttpStatus.Created).send(userOutput)


        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async getUsers(req: Request, res: Response,){
        try {
                // 1. Берём query-параметры из запроса
                const queryInput = req.query as unknown as UserQueryInput ;
        
                // 2. Вызываем сервис, получаем данные
                const { items, totalCount } = await this.usersQueryRepository.findMany(queryInput);
        
                // 3. Форматируем ответ с пагинацией
                const usersListOutput = mapToUserListPaginatedOutput(items, {
                    pageNumber: queryInput.pageNumber,
                    pageSize: queryInput.pageSize,
                    totalCount, //totalCount — общее количество блогов (без пагинации)
                });
        
                // 4. Отправляем ответ
                res.send(usersListOutput);
        
            } catch (e: unknown) {
                errorsHandler(e, res);
            }
    }

    async deleteUser(req: Request<{id: string}>, res: Response){
        try{
                // 1. Получаем ID из параметров URL
                const id = req.params.id;
        
                // 2. Вызываем сервис для удаления
                await this.usersService.delete(id);
        
                // 3. Возвращаем 204 No Content (успешно, ничего не возвращаем)
                res.sendStatus(HttpStatus.NoContent);
        
            } catch (e: unknown){
                // 4. Любую ошибку передаем в централизованный обработчик
                errorsHandler(e, res);
            }
    }

    
}