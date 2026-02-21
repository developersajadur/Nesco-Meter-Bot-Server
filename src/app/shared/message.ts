import config from '../config';

export const createMessage = (balance: number | string, time: string, fetchedAt: Date): string => {
  return `
🔋 NESCo Balance Update For: ${config.meter_number} Meter
💰 Remaining Balance: ${balance} Tk
🕒 Portal Time: ${time}
📅 Checked At: ${fetchedAt.toLocaleString()}
`;
};
