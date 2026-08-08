import { Request, Response } from 'express';
import { getAllCollections } from '../../../db/collections';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function truncateDbHandler(req: Request, res: Response) {
  try {
    // Полностью очищаем все коллекции (используется в тестах).
    await Promise.all(
      getAllCollections().map((collection) => collection.deleteMany()),
    );

    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}