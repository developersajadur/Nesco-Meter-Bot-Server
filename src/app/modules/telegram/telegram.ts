import axios from 'axios';
import config from '../../config';

export const sendTelegramMessage = async (message: string): Promise<void> => {
  const token = config.telegram_bot_token;
  const chatId = config.telegram_chat_id;

  if (!token || !chatId) {
    throw new Error('Telegram config missing');
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await axios.post(url, {
    chat_id: chatId,
    text: message
  });
};
