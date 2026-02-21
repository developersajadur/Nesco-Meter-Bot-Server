import express, { Application, Request, Response } from 'express';
import status from 'http-status';
import { manualApiTrigger } from './app/modules/manualApi/manualApiTrigger';
import { notFoundHandler } from './app/middlewares/notFound';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import sendResponse from './app/helpers/sendResponse';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  return sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Welcome to Nesco Meter Bot API',
    data: null
  });
});

app.get('/api/balance', manualApiTrigger);

// middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
