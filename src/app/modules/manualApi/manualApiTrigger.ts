import { Request, Response } from 'express';
import config from '../../config';
import status from 'http-status';
import { getBalance } from '../scraper/puppeteer';
import { sendTelegramMessage } from '../telegram/telegram';
import { createMessage } from '../../shared/message';

export const manualApiTrigger = async (req: Request, res: Response) => {
  try {
    const meterNumber = (req.query.meterNumber as string) || config.meter_number;

    if (!meterNumber) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: 'Meter number is required'
      });
    }

    const result = await getBalance(meterNumber);

    const message = createMessage(result.balance ?? 0, result.time ?? '', result.fetchedAt ?? '');
    console.log(message);

    await sendTelegramMessage(message);

    return res.status(status.OK).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch balance'
    });
  }
};
