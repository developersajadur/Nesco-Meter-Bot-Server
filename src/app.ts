import express, { Application, Request, Response } from 'express';
import status from 'http-status';
import { manualApiTrigger } from './app/modules/manualApi/manualApiTrigger';
import { notFoundHandler } from './app/middlewares/notFound';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  return res.status(status.OK).json({
    success: true,
    message: 'NescoMeterBot is running...',
    statusCode: status.OK
  });
});

app.get('/api/balance', manualApiTrigger);

// middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
