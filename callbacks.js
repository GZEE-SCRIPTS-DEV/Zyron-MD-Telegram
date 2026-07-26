//Desenvolvido por GzeeScriptsDev</>
//Todos os direitos reservados Gzee Studio Crew © & Zyron-MD Productions © 2026

module.exports = (bot) => {

  bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = msg.chat.id;

    try {

      // 🏓 Ping
      if (data === 'ping') {
        await bot.sendMessage(chatId, '🏓 Pong!');
      }


      // ℹ️ Sobre
      else if (data === 'about') {
        await bot.sendMessage(
          chatId,
`🤖 *Zyron-MD Telegram*

⚡ Node.js Bot
📡 Telegram API

👨‍💻 Dev: GzeeScriptsDev`,
          { parse_mode: 'Markdown' }
        );
      }


      // 📋 MENU PRINCIPAL
      else if (data === 'open_menu') {
        await bot.editMessageText(
`📋 *MENU PRINCIPAL*

Escolha uma categoria:`,
        {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown',
          reply_markup: {
  inline_keyboard: [
    [{ text: '📄 Informações', callback_data: 'menu:1' }],
    [{ text: '⚙️ Diagnóstico', callback_data: 'menu:2' }],
    [{ text: '🧩 Utilidades', callback_data: 'menu:3' }],
    [{ text: '🔎 Consultas', callback_data: 'consulta' }],
    [{ text: '🎭 Jogos', callback_data: 'jogos' }]
        ]
        }
        });
      }


      // 📄 MENU 1
      else if (data === 'menu:1') {
        await bot.editMessageText(
`📄 *INFORMAÇÕES*

👑 /dono
📊 /status
ℹ️ /info
🆔 /id
👤 /user`,
        {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '⬅️ Voltar', callback_data: 'open_menu' },
                { text: '➡️', callback_data: 'menu:2' }
              ]
            ]
          }
        });
      }


      // ⚙️ MENU 2
      else if (data === 'menu:2') {
        await bot.editMessageText(
`⚙️ *DIAGNÓSTICO*

⏱ /uptime
🕒 /hora
📖 /ajuda`,
        {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '⬅️', callback_data: 'menu:1' },
                { text: '🏠', callback_data: 'open_menu' },
                { text: '➡️', callback_data: 'menu:3' }
              ]
            ]
          }
        });
      }


      // 👑 MENU 3
      else if (data === 'menu:3') {
        await bot.editMessageText(
`🧩 *UTILIDADES*
🎧 /play
🎬 /pdoc
🎮 /vdb
🍻 /eununca
🏆 /rank
🔎 /google
📦 /github
📱 /qr
🧮 /formula`,
        {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '⬅️', callback_data: 'menu:2' },
                { text: '🏠', callback_data: 'open_menu' }
              ]
            ]
          }
        });
      }

// 🔎 MENU CONSULTAS
else if (data === 'consulta') {

await bot.editMessageText(
`🔎 *MENU CONSULTAS*

Escolha uma consulta:

📱 Consultar ID
👤 Consultar usuário
🌐 Consultar IP
📦 Consultar CEP
🎵 Consultar música`,
{
chat_id: chatId,
message_id: msg.message_id,
parse_mode:'Markdown',
reply_markup:{
inline_keyboard:[
[
{text:'🆔 ID', callback_data:'cons_id'},
{text:'👤 Usuário', callback_data:'cons_user'}
],
[
{text:'🌐 IP', callback_data:'cons_ip'},
{text:'📦 CEP', callback_data:'cons_cep'}
],
[
{text:'🏪 CNPJ', callback_data:'cons_cnpj'}
],
[
{text:'🪧 Placa', callback_data:'cons_placa'}
],
[
{text:'🏠 Menu', callback_data:'open_menu'}
],

]
}
});

}

      // 🎮 MENU JOGOS
      else if (data === 'jogos') {
        await bot.editMessageText(
`🎮 *JOGOS*

🎭 Verdade ou Desafio
🍻 Eu Nunca

Escolha:`,
        {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎭 Verdade ou Desafio', callback_data: 'vdb' }],
              [{ text: '🍻 Eu Nunca', callback_data: 'eununca_new' }],
              [{ text: '🏠 Menu', callback_data: 'open_menu' }]
            ]
          }
        });
      }


      // 🎭 VERDADE OU DESAFIO
      else if (data === 'vdb') {

        const verdades = [
          'Qual foi sua maior vergonha?',
          'Você já gostou de alguém escondido?',
          'Qual seu maior medo?',
          'Já mentiu para alguém importante?'
        ];

        const desafios = [
          'Envie um áudio cantando.',
          'Faça uma imitação engraçada.',
          'Mande um emoji aleatório.'
        ];

        const tipo = Math.random() < 0.5 ? 'verdade' : 'desafio';

        const resultado = tipo === 'verdade'
        ? verdades[Math.floor(Math.random()*verdades.length)]
        : desafios[Math.floor(Math.random()*desafios.length)];


        await bot.editMessageText(
`🎭 *VERDADE OU DESAFIO*

🎲 Sorteado: *${tipo.toUpperCase()}*

${tipo === 'verdade' ? '❓' : '🔥'} ${resultado}`,
        {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown',
          reply_markup:{
            inline_keyboard:[
              [{text:'🎲 Novo',callback_data:'vdb'}],
              [{text:'🏠 Menu',callback_data:'open_menu'}]
            ]
          }
        });
      }


      // 🍻 EU NUNCA
      else if (data === 'eununca_new') {

        const frases = [
          'Eu nunca menti para meus pais.',
          'Eu nunca colei em uma prova.',
          'Eu nunca passei vergonha em público.',
          'Eu nunca mandei mensagem para a pessoa errada.'
        ];

        const frase = frases[Math.floor(Math.random()*frases.length)];


        await bot.editMessageText(
`🍻 *EU NUNCA*

${frase}`,
        {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode:'Markdown',
          reply_markup:{
            inline_keyboard:[
              [
                {text:'✅ Eu já',callback_data:'eununca_yes'},
                {text:'❌ Eu nunca',callback_data:'eununca_no'}
              ],
              [
                {text:'🎲 Outra',callback_data:'eununca_new'}
              ]
            ]
          }
        });
      }


      else if (data === 'eununca_yes') {
        await bot.answerCallbackQuery(callbackQuery.id,{
          text:'🔥 Você já fez!'
        });
      }


      else if (data === 'eununca_no') {
        await bot.answerCallbackQuery(callbackQuery.id,{
          text:'😇 Você nunca fez!'
        });
      }

      // 🎧 PLAY DOWNLOAD
      else if (data.startsWith('play:')) {

        const index = Number(data.split(':')[1]);

        const videos = global.ytSearch?.[chatId];

        if (!videos || !videos[index]) {
          return bot.answerCallbackQuery(callbackQuery.id, {
            text: "❌ Música não encontrada",
            show_alert: true
          });
        }

        const video = videos[index];

        await bot.answerCallbackQuery(callbackQuery.id, {
          text: "🎧 Baixando..."
        });


        const fs = require("fs");
        const path = require("path");
        const { exec } = require("child_process");


        if (!fs.existsSync("./temp")) {
          fs.mkdirSync("./temp");
        }


        const file = `audio_${Date.now()}.mp3`;
        const output = path.join("./temp", file);


        const cmd =
        `yt-dlp --no-playlist -x --audio-format mp3 --audio-quality 0 -o "${output}" "${video.url}"`;


        exec(cmd, async (err) => {

          if (err) {
            console.log("[YTDLP ERROR]", err);
            return bot.sendMessage(chatId,
              "❌ Erro ao baixar música."
            );
          }


          if (!fs.existsSync(output)) {
            return bot.sendMessage(chatId,
              "❌ Arquivo não foi criado."
            );
          }


          await bot.sendAudio(chatId,
            fs.readFileSync(output),
            {
              caption:
`🎵 ${video.title}

👤 ${video.author?.name || "Desconhecido"}`
            }
          );


          fs.unlinkSync(output);

        });

      }

    } catch(e) {
      console.log('Erro callback:', e);
      bot.sendMessage(chatId,'❌ Erro no sistema.');
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });

};