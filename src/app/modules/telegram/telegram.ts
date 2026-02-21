import axios from 'axios';
import config from '../../config';
import AppError from '../../helpers/appError';
import status from 'http-status';

export const sendTelegramMessage = async (message: string): Promise<void> => {
  const token = config.telegram_bot_token;
  const chatId = config.telegram_chat_id;

  if (!token || !chatId) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Telegram bot token and chat ID must be provided in the configuration'
    );
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await axios.post(url, {
    chat_id: chatId,
    text: message
  });
};
