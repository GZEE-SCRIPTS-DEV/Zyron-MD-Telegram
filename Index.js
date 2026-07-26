//Desenvolvido por GzeeScriptsDev</>
//Todos os direitos reservados Gzee Studio Crew © & Zyron-MD Productions © 2026

const TelegramBot = require('node-telegram-bot-api').default;  

const token = 'TOKEN_AQUI';

const bot = new TelegramBot(token, {
  polling: true
});

console.log('🤖 Bot online!');

// importa comandos
require('./commands')(bot);
require('./callbacks')(bot);