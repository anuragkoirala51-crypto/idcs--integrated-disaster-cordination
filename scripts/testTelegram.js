const TelegramBot = require('node-telegram-bot-api');

const token = '8506019851:AAHDaDedcRGGmG0KdTWJAxWbzykv7jGG0dk';
const bot = new TelegramBot(token, { polling: true });

// 1322233465 was the chat ID caught in the logs
const chatId = 1322233465;

const alertText = "🚨 FLOOD ALERT 🚨\nAnil Nagar: Severe waterlogging reported; residents are advised to move valuables to upper floors immediately.";

console.log("Forcing alert to: " + chatId);

bot.sendMessage(chatId, alertText).then(() => {
    console.log("Success!");
    process.exit(0);
}).catch(err => {
    console.error("Error sending message:", err);
    process.exit(1);
});
