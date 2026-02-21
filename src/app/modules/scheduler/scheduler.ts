import cron from 'node-cron';
import { sendTelegramMessage } from '../telegram/telegram';
import config from '../../config';
import { getBalance } from '../scraper/puppeteer';
import { createMessage } from '../../shared/message';

export const startScheduler = (): void => {
  cron.schedule('0 8 * * *', async () => {
    try {
      const result = await getBalance(config.meter_number!);

      const message = createMessage(result.balance ?? 0, result.time ?? '', result.fetchedAt ?? '');
      await sendTelegramMessage(message);
    } catch (error) {
      console.error('Scheduler Error:', error);
    }
  });
};
