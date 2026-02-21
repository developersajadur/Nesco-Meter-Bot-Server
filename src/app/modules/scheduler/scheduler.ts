/* eslint-disable @typescript-eslint/no-explicit-any */
import cron from 'node-cron';
import { sendTelegramMessage } from '../telegram/telegram';
import config from '../../config';
import { getBalance } from '../scraper/puppeteer';
import { createMessage } from '../../shared/message';
import { retry } from '../../helpers/retry';

export const startScheduler = (): void => {
  const scheduleTime = '10 0 * * *'; // 12:10 AM BD time

  cron.schedule(
    scheduleTime,
    async () => {
      console.log('[CRON] Daily balance check started');

      try {
        const FIVE_MINUTES = 5 * 60 * 1000;
        const result = await retry(() => getBalance(config.meter_number!), 3, FIVE_MINUTES);

        const message = createMessage(
          result.balance ?? 0,
          result.time ?? '',
          result.fetchedAt ?? new Date()
        );

        await sendTelegramMessage(message);

        console.log('[CRON] Balance message sent successfully');
      } catch (error: any) {
        console.error('[CRON ERROR]', error);

        // Notify yourself
        await sendTelegramMessage(`
❌ NESCo Bot Error

Time: ${new Date().toLocaleString()}
Message: ${error.message}
        `);
      }
    },
    {
      timezone: 'Asia/Dhaka'
    }
  );
};
