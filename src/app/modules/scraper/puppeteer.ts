import puppeteer, { Browser, Page } from 'puppeteer-core';
import config from '../../config';

interface BalanceResult {
  balance: string | null;
  time: string | null;
  fetchedAt: Date;
}

export const getBalance = async (meterNumber: string): Promise<BalanceResult> => {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      executablePath: config.chrome_path,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page: Page = await browser.newPage();

    await page.goto('https://customer.nesco.gov.bd/pre/panel/', {
      waitUntil: 'domcontentloaded'
    });

    await page.waitForSelector('#cust_no', { visible: true });

    await page.type('#cust_no', meterNumber);

    // Click and wait for network to settle
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.click('#recharge_hist_button')
    ]);

    // Now directly wait for the balance input field that contains value
    const balanceInputSelector = 'input.form-control[disabled][value]';

    await page.waitForSelector(balanceInputSelector, {
      timeout: 20000
    });

    const result = await page.evaluate(() => {
      const disabledInputs = Array.from(document.querySelectorAll('input.form-control[disabled]'));

      let balance: string | null = null;

      if (disabledInputs.length >= 2) {
        balance = disabledInputs[14].getAttribute('value')?.trim() ?? null;
      }

      const timeSpan = document.querySelector('small span') as HTMLElement | null;

      const time = timeSpan?.innerText.trim() ?? null;

      return { balance, time };
    });

    return {
      balance: result.balance,
      time: result.time,
      fetchedAt: new Date()
    };
  } finally {
    if (browser) await browser.close();
  }
};
