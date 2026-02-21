import { Request, Response } from 'express';
import config from '../../config';
import status from 'http-status';
import { getBalance } from '../scraper/puppeteer';
import { sendTelegramMessage } from '../telegram/telegram';
import { createMessage } from '../../shared/message';
import AppError from '../../helpers/AppError';
import sendResponse from '../../helpers/sendResponse';

export const manualApiTrigger = async (req: Request, res: Response) => {
  try {
    const meterNumber = (req.query.meterNumber as string) || config.meter_number;

    if (!meterNumber) {
      throw new AppError(status.BAD_REQUEST, 'Meter number is required');
    }

    const result = await getBalance(meterNumber);

    const message = createMessage(result.balance ?? 0, result.time ?? '', result.fetchedAt ?? '');
    // console.log(message);

    await sendTelegramMessage(message);

    return sendResponse(res, {
      statusCode: status.OK,
      success: true,
      data: result
    })
  } catch (error) {
    // console.log(error);
   throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to fetch balance and send message', (error as Error).stack);
  }
};
