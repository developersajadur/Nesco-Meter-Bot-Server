import config from '../config';

export const launchBrowser = async () => {
  if (config.node_env === 'production') {
    const puppeteerCore = await import('puppeteer-core');

    return puppeteerCore.default.launch({
      executablePath: config.chrome_path,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  // Development
  const puppeteer = await import('puppeteer');

  return puppeteer.default.launch({
    headless: true
  });
};
