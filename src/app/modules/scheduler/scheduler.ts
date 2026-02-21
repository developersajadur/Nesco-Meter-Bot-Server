import cron from 'node-cron';
import { sendTelegramMessage } from '../telegram/telegram';
import config from '../../config';
import { getBalance } from '../scraper/puppeteer';
import { createMessage } from '../../shared/message';
import AppError from '../../helpers/AppError';
import status from 'http-status';

export const startScheduler = (): void => {
  cron.schedule('0 8 * * *', async () => {
    try {
      const result = await getBalance(config.meter_number!);

      const message = createMessage(result.balance ?? 0, result.time ?? '', result.fetchedAt ?? '');
      await sendTelegramMessage(message);
    } catch (error) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        'Failed to fetch balance in scheduler',
        (error as Error).stack
      );
    }
  });
};
