const TelegramBot = require('node-telegram-bot-api');
const token = '7557410285:AAGkA9662osPXoRcNZWhjF73NPbG6O2U6QQ';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = `New visitor logged:\n${JSON.stringify(msg, null, 2)}`;
  bot.sendMessage(chatId, text);
});
