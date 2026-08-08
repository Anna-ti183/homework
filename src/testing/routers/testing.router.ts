import { Router } from 'express';
import { truncateDbHandler } from './handlers/truncate-db.handler';
import { TESTING_ROUTES } from '../constants/testing.paths';

export const testingRouter = Router({});

testingRouter.delete(TESTING_ROUTES.ALL_DATA, truncateDbHandler);