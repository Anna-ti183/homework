import { Request, Response } from "express";
import { usersRepository } from "../../../users/repositories/users.repository";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function meHandler(
    req:Request,
    res:Response
){
    const userId = req.userId;

    if(userId === null){
        return res.sendStatus(HttpStatus.Unauthorized)
    }
    const user = await usersRepository.findById(userId) 

    if(user === null){
        return res.sendStatus(HttpStatus.Unauthorized)
    }

   const userOutput = {
    email: user.email,
    login: user.login,
    userId: userId, //D пользователя, который мы достали из JWT, тип string
}
return res.status(HttpStatus.Ok).send(userOutput)
}