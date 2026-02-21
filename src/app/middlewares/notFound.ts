import { Request, Response } from 'express';
import status from 'http-status';
import sendResponse from '../helpers/sendResponse';

export const notFoundHandler = (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.NOT_FOUND,
    success: false,
    message: 'Route not found',
    data: null
  });
};
