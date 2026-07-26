//Desenvolvido por GzeeScriptsDev</>
//Todos os direitos reservados Gzee Studio Crew © & Zyron-MD Productions © 2026

const os = require('os');
const axios = require('axios');

module.exports = (bot) => {

  // 📌 /start
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, '👋 Bem-vindo ao Zyron-MD Telegram!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 Abrir Menu', callback_data: 'open_menu' }]
        ]
      }
    });
  });

  // 📌 /menu
  bot.onText(/\/menu/, (msg) => {
    bot.sendMessage(msg.chat.id, '📋 Use /start para abrir o menu com botões.');
  });

  // 📌 /dono
  bot.onText(/\/dono/, (msg) => {
    bot.sendMessage(msg.chat.id,
`👑 DONO DO BOT

👤 Desenvolvedor: GzeeScriptsDev

📱 Contato:
https://wa.me/5519995729970

📩 Suporte disponível.`);
  });

  // 📌 /info
  bot.onText(/\/info/, (msg) => {
    bot.sendMessage(msg.chat.id,
`🤖 ZYRON-MD TELEGRAM

⚡ Node.js Bot
📡 Telegram Bot API
🚀 Sistema de automação`);
  });

  // 📌 /id
  bot.onText(/\/id/, (msg) => {
    bot.sendMessage(msg.chat.id,
`🆔 DADOS

Nome: ${msg.from.first_name}
ID: ${msg.from.id}
Chat: ${msg.chat.id}
User: @${msg.from.username || 'sem username'}`);
  });

  // 📌 /user
  bot.onText(/\/user/, (msg) => {
    bot.sendMessage(msg.chat.id,
`👤 PERFIL

Nome: ${msg.from.first_name}
ID: ${msg.from.id}
Username: @${msg.from.username || 'sem username'}`);
  });

  // 📌 /hora
  bot.onText(/\/hora/, (msg) => {
    const now = new Date();
    bot.sendMessage(msg.chat.id, `🕒 ${now.toLocaleString('pt-BR')}`);
  });

  // 📌 /uptime
  bot.onText(/\/uptime/, (msg) => {
    const uptime = process.uptime();

    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    bot.sendMessage(msg.chat.id, `⏱ ${h}h ${m}m ${s}s`);
  });

  // 📌 /ajuda
  bot.onText(/\/ajuda/, (msg) => {
    bot.sendMessage(msg.chat.id,
`📖 COMANDOS

/start
/menu
/status
/dono
/info
/id
/user
/hora
/uptime
/formula`);
  });

  // 📌 /status
  bot.onText(/\/status/, async (msg) => {

    const start = Date.now();
    const sent = await bot.sendMessage(msg.chat.id, '📊 Calculando...');

    const ping = Date.now() - start;

    const totalMem = os.totalmem() / 1024 / 1024;
    const freeMem = os.freemem() / 1024 / 1024;
    const usedMem = totalMem - freeMem;

    const mem = process.memoryUsage();

    const text =
`📊 STATUS

⚡ Ping: ${ping}ms

🧠 RAM
Total: ${totalMem.toFixed(2)} MB
Livre: ${freeMem.toFixed(2)} MB
Usada: ${usedMem.toFixed(2)} MB

🤖 BOT
RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB
Heap: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`;

    bot.editMessageText(text, {
      chat_id: msg.chat.id,
      message_id: sent.message_id
    });
  });

  // 📌 /formula
  bot.onText(/\/formula (.+)/, async (msg, match) => {

    const chatId = msg.chat.id;
    const pergunta = match[1];

    const sent = await bot.sendMessage(chatId, '🔎 Buscando fórmula...');

    try {

      const prompt = `
Você é especialista em matemática, física e química.

Pergunta: ${pergunta}

Responda SOMENTE JSON:
{
 "titulo": "",
 "area": "",
 "formula_latex": "",
 "explicacao": "",
 "variaveis": [["",""]],
 "exemplo": "",
 "aplicacoes": "",
 "curiosidade": ""
}
`;

      const apiKey = process.env.GROQ_API_KEY || "API_GROQ";

      const { data } = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Responda apenas JSON válido." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      let text = data.choices[0].message.content;

      text = text.replace(/```json/g, "").replace(/```/g, "");

      const json = JSON.parse(text);

      const resposta =
`🧮 ${json.titulo}

📚 Área: ${json.area}

📌 Fórmula:
${json.formula_latex}

📘 ${json.explicacao}

🧪 Exemplo:
${json.exemplo}

🧠 Curiosidade:
${json.curiosidade}`;

      bot.editMessageText(resposta, {
        chat_id: chatId,
        message_id: sent.message_id
      });

    } catch (e) {
      bot.editMessageText('❌ Erro ao buscar fórmula.', {
        chat_id: chatId,
        message_id: sent.message_id
      });
    }
  });
  
  // 📌 /github <termo>
bot.onText(/\/github (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const query = match[1];

  try {

    const sent = await bot.sendMessage(chatId, '🔎 Buscando repositórios...');

    const { data } = await axios.get(
      "https://api.github.com/search/repositories",
      {
        params: {
          q: query,
          sort: "stars",
          order: "desc",
          per_page: 5
        },
        headers: {
          "User-Agent": "Zyron-MD"
        }
      }
    );

    if (!data.items.length) {
      return bot.editMessageText('❌ Nenhum repositório encontrado.', {
        chat_id: chatId,
        message_id: sent.message_id
      });
    }

    let text = `📚 RESULTADOS PARA: ${query}\n\n`;

    data.items.forEach((repo, i) => {
      text +=
`#${i + 1}
📦 ${repo.full_name}
⭐ ${repo.stargazers_count}
📝 ${repo.description || "Sem descrição"}
🔗 ${repo.html_url}

`;
    });

    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: sent.message_id
    });

  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, '❌ Erro ao buscar GitHub.');
  }
});

// 📌 /repo owner/name
bot.onText(/\/repo (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  let repoName = match[1].replace(/\s+/g, '');

  try {

    const sent = await bot.sendMessage(chatId, '📦 Buscando repositório...');

    const { data } = await axios.get(
      `https://api.github.com/repos/${repoName}`,
      {
        headers: {
          "User-Agent": "Zyron-MD"
        }
      }
    );

    const text =
`📦 ${data.full_name}

📝 ${data.description || "Sem descrição"}
👤 Autor: ${data.owner.login}
⭐ Stars: ${data.stargazers_count}
🍴 Forks: ${data.forks_count}
👀 Watchers: ${data.watchers_count}
🐛 Issues: ${data.open_issues_count}
💻 Linguagem: ${data.language || "N/A"}

🔗 ${data.html_url}`;

    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: sent.message_id
    });

  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, '❌ Repositório não encontrado.');
  }
});

const QRCode = require('qrcode');

// 📌 /qr <texto>
bot.onText(/\/(qr|qrcode|qrgenerator)(?: (.+))?/, async (msg, match) => {

  const chatId = msg.chat.id;
  let text = match[2];

  try {

    if (!text) {
      return bot.sendMessage(chatId,
`📱 QR CODE GENERATOR

Use:
/qr https://google.com
/qr texto qualquer`);
    }

    await bot.sendMessage(chatId, '⏳ Gerando QR Code...');

    const buffer = await QRCode.toBuffer(text, {
      width: 800,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });

    await bot.sendPhoto(chatId, buffer, {
      caption:
`📱 QR CODE GERADO

🔗 Conteúdo:
${text.length > 80 ? text.slice(0, 80) + "..." : text}`
    });

  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, '❌ Erro ao gerar QR Code.');
  }
});

const axios = require("axios");
const cheerio = require("cheerio");

// 📌 /google <termo>
bot.onText(/\/(google|pesquisar) (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const query = match[2];

  try {

    await bot.sendMessage(chatId, "🔎 Pesquisando...");

    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data, { xmlMode: true });

    let resultados = [];

    $("item").each((i, el) => {
      if (resultados.length >= 5) return false;

      const titulo = $(el).find("title").text();
      const link = $(el).find("link").text();
      const desc = $(el).find("description").text().replace(/<[^>]*>/g, "");

      resultados.push({ titulo, link, desc });
    });

    if (!resultados.length) {
      return bot.sendMessage(chatId, "❌ Nenhum resultado encontrado.");
    }

    global.googleSearch = global.googleSearch || {};
    global.googleSearch[chatId] = resultados;

    let text = `🔎 RESULTADOS: ${query}\n\n`;

    resultados.forEach((r, i) => {
      text +=
`#${i + 1}
📌 ${r.titulo}
🔗 /gopen ${i + 1}

`;
    });

    bot.sendMessage(chatId, text);

  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, "❌ Erro na pesquisa.");
  }
});

bot.onText(/\/gopen (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const num = parseInt(match[1]);

  const resultados = global.googleSearch?.[chatId];

  if (!resultados || !resultados[num - 1]) {
    return bot.sendMessage(chatId, "❌ Resultado não encontrado.");
  }

  const r = resultados[num - 1];

  bot.sendMessage(chatId,
`🔗 RESULTADO ${num}

📌 ${r.titulo}

🌐 ${r.link}`);
});

bot.onText(/\/glista/, (msg) => {

  const chatId = msg.chat.id;

  const resultados = global.googleSearch?.[chatId];

  if (!resultados) {
    return bot.sendMessage(chatId, "❌ Nenhuma pesquisa salva.");
  }

  let text = "📚 RESULTADOS SALVOS\n\n";

  resultados.forEach((r, i) => {
    text += `${i + 1}. ${r.titulo}\n🔗 ${r.link}\n\n`;
  });

  bot.sendMessage(chatId, text);
});

const ytSearch = require("yt-search");

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// 📌 /play
bot.onText(/\/play (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const query = match[1];

  try {

    const sent = await bot.sendMessage(chatId, "🎧 Procurando música...");

    const search = await ytSearch(query);

    if (!search.videos.length) {
      return bot.editMessageText("❌ Nenhum resultado encontrado.", {
        chat_id: chatId,
        message_id: sent.message_id
      });
    }


    const videos = search.videos.slice(0, 5);

    global.ytSearch = global.ytSearch || {};
    global.ytSearch[chatId] = videos;


    const video = videos[0];


    let buttons = videos.map((v, i) => [
      {
        text: `🎵 ${v.title.slice(0, 35)}`,
        callback_data: `play:${i}`
      }
    ]);


    await bot.deleteMessage(chatId, sent.message_id);


    await bot.sendPhoto(chatId, video.thumbnail, {

      caption:
`🎧 *ZYRON PLAY*

🔎 Pesquisa:
${query}

🎵 Resultado:
${video.title}

👤 Canal:
${video.author?.name || "Desconhecido"}

👇 Escolha uma música:`,

      parse_mode: "Markdown",

      reply_markup: {
        inline_keyboard: buttons
      }

    });


  } catch (e) {

    console.log("[PLAY ERROR]", e);

    bot.sendMessage(
      chatId,
      "❌ Erro ao pesquisar música."
    );

  }

});

bot.onText(/\/playdl (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const num = parseInt(match[1]);

  const videos = global.ytSearch?.[chatId];

  if (!videos || !videos[num - 1]) {
    return bot.sendMessage(chatId, "❌ Resultado não encontrado. Use /play primeiro.");
  }

  const video = videos[num - 1];

  try {

    await bot.sendMessage(chatId, "🎧 Baixando áudio...");

    const file = `audio_${Date.now()}.mp3`;
    const output = path.join("./temp", file);

    if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

    const cmd = `yt-dlp -x --audio-format mp3 -o "${output}" "${video.url}"`;

    exec(cmd, async (err) => {

      if (err || !fs.existsSync(output)) {
        return bot.sendMessage(chatId, "❌ Erro ao baixar áudio.");
      }

      await bot.sendAudio(chatId, fs.readFileSync(output), {
        caption: `🎵 ${video.title}`
      });

      fs.unlinkSync(output);
    });

  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, "❌ Erro no download.");
  }
});

bot.onText(/\/pdoc (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const num = parseInt(match[1]);

  const videos = global.ytSearch?.[chatId];

  if (!videos || !videos[num - 1]) {
    return bot.sendMessage(chatId, "❌ Resultado não encontrado.");
  }

  const video = videos[num - 1];

  try {

    await bot.sendMessage(chatId, "🎬 Baixando vídeo...");

    const file = `video_${Date.now()}.mp4`;
    const output = path.join("./temp", file);

    if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

    const cmd = `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4" -o "${output}" "${video.url}"`;

    exec(cmd, async (err) => {

      if (err || !fs.existsSync(output)) {
        return bot.sendMessage(chatId, "❌ Erro ao baixar vídeo.");
      }

      await bot.sendVideo(chatId, fs.readFileSync(output), {
        caption: `🎬 ${video.title}`
      });

      fs.unlinkSync(output);
    });

  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, "❌ Erro no download.");
  }
});

const verdades = [
'Qual foi a maior mentira que você já contou?',
'Você já gostou de alguém em segredo?',
'Qual é seu maior medo?',
'Já chorou por alguém?',
'Qual foi a coisa mais vergonhosa que já fez?',
'Você já colou em uma prova?',
'Qual foi seu pior fora?',
'Já fingiu gostar de algo só para impressionar alguém?',
'Quem foi sua última paixão?',
'Qual segredo ninguém sabe sobre você?'
];

const desafios = [
'Envie um emoji aleatório para 5 contatos.',
'Grave um áudio cantando uma música.',
'Mande uma mensagem engraçada em um grupo.',
'Troque sua foto de perfil por 10 minutos.',
'Fale o alfabeto ao contrário.',
'Envie um áudio imitando um robô.',
'Escreva uma frase sem usar a letra A.',
'Taque seu celular no chão (de brincadeira 😅)',
'Envie apenas emojis na próxima mensagem.',
'Faça uma declaração para alguém do grupo.'
];

// 📌 /vdb
bot.onText(/\/vdb/, (msg) => {

  const chatId = msg.chat.id;

  const tipo = Math.random() < 0.5 ? 'verdade' : 'desafio';

  const resultado = tipo === 'verdade'
    ? verdades[Math.floor(Math.random() * verdades.length)]
    : desafios[Math.floor(Math.random() * desafios.length)];

  const text =
`🎭 VERDADE OU DESAFIO

🎲 Sorteado: ${tipo.toUpperCase()}

${tipo === 'verdade' ? '❓' : '🔥'} ${resultado}`;

  bot.sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎲 Sortear de novo', callback_data: 'vdb' }]
      ]
    }
  });
});

// 📌 /eununca
bot.onText(/\/eununca/, async (msg) => {

  const frases = [
    'Eu nunca beijei alguém.',
'Eu nunca menti para meus pais.',
'Eu nunca colei em uma prova.',
'Eu nunca passei vergonha em público.',
'Eu nunca chorei assistindo um filme.',
'Eu nunca escondi uma nota ruim.',
'Eu nunca mandei mensagem para a pessoa errada.',
'Eu nunca fui pego mentindo.',
'Eu nunca ri em um momento sério.',
'Eu nunca me arrependi de uma mensagem enviada.',
'Eu nunca fui parar na diretoria.',
'Eu nunca me apaixonei por um amigo.',
'Eu nunca fingi dormir para evitar conversar.',
'Eu nunca apaguei uma mensagem e fiquei com medo da reação.',
'Eu nunca derrubei comida na roupa em público.',
'Eu nunca fiquei preso no banheiro.',
'Eu nunca mandei mensagem para o contato errado.',
'Eu nunca me arrependi de um corte de cabelo.',
'Eu nunca fui ignorado por alguém que eu gostava.',
'Eu nunca perdi o ônibus por distração.',
'Eu nunca fiquei rindo sozinho lembrando de algo.',
'Eu nunca fui pego mexendo no celular escondido.',
'Eu nunca inventei uma desculpa para sair de casa.',
'Eu nunca fingi estar ocupado.',
'Eu nunca cantei errado uma música por anos.',
'Eu nunca esqueci minha própria idade por um instante.',
'Eu nunca me perdi em um lugar que conhecia.',
'Eu nunca chorei de tanto rir.',
'Eu nunca tive vergonha de pedir ajuda.',
'Eu nunca fiquei nervoso para falar com alguém.',
'Eu nunca derrubei o celular na água.',
'Eu nunca salvei alguém com um apelido estranho.',
'Eu nunca stalkeei alguém por mais de uma hora.',
'Eu nunca tirei print de uma conversa.',
'Eu nunca fui bloqueado por alguém.',
'Eu nunca bloqueei alguém por raiva.',
'Eu nunca menti minha idade na internet.',
'Eu nunca fiquei mais de 5 horas seguidas no celular.',
'Eu nunca passei vergonha tentando impressionar alguém.',
'Eu nunca me assustei com minha própria sombra.',
'Eu nunca ri em uma situação séria.',
'Eu nunca fui o último a entender uma piada.',
'Eu nunca tive um crush em personagem de filme ou série.',
'Eu nunca falei sozinho em voz alta.',
'Eu nunca tropecei andando em linha reta.',
'Eu nunca perdi uma aposta.',
'Eu nunca escondi comida para comer depois.',
'Eu nunca fiquei com ciúmes de um amigo.',
'Eu nunca dormi durante uma chamada.',
'Eu nunca me atrasei por esquecer a hora.',
'Eu nunca fiquei sem internet e não soube o que fazer.',
'Eu nunca enviei um áudio sem querer.',
'Eu nunca tive medo de assistir um filme de terror sozinho.',
'Eu nunca fingi gostar de uma música.',
'Eu nunca passei um dia inteiro de pijama.',
'Eu nunca fui confundido com outra pessoa.',
'Eu nunca me arrependi de uma postagem.',
'Eu nunca deixei uma mensagem no vácuo de propósito.',
'Eu nunca fiquei acordado até o amanhecer.',
'Eu nunca inventei uma história que saiu do controle.',
'Eu nunca fiquei com o(a) ex de um amigo.',
'Eu nunca me apaixonei por alguém comprometido.',
'Eu nunca menti para esconder com quem estava.',
'Eu nunca traí a confiança de alguém importante.',
'Eu nunca voltei para alguém que me fez sofrer.',
'Eu nunca fui o motivo do término de um casal.',
'Eu nunca fiquei com alguém apenas por aparência.',
'Eu nunca tive uma paixão secreta por um amigo.',
'Eu nunca mandei mensagem para alguém só porque estava carente.',
'Eu nunca fingi não gostar de alguém quando gostava.',
'Eu nunca tive ciúmes sem ter nada com a pessoa.',
'Eu nunca fui rejeitado e fingi que não me importei.',
'Eu nunca me arrependi de uma declaração de amor.',
'Eu nunca escondi um relacionamento.',
'Eu nunca fiquei com alguém que meus amigos desaprovavam.',
'Eu nunca fui bloqueado por alguém que eu gostava.',
'Eu nunca bloqueei alguém por raiva.',
'Eu nunca voltei a falar com alguém que jurei esquecer.',
'Eu nunca fiquei obcecado por alguém.',
'Eu nunca estraguei uma amizade por sentimentos.',
'Eu nunca me humilhei por alguém.',
'Eu nunca mandei uma mensagem e me arrependi imediatamente.',
'Eu nunca senti falta de alguém que não merecia.',
'Eu nunca tentei causar ciúmes em alguém.',
'Eu nunca perdoei algo que disse que nunca perdoaria.',
'Eu nunca fui iludido e continuei insistindo.',
'Eu nunca tive um segredo que ninguém do grupo imagina.',
'Eu nunca menti sobre meus sentimentos.',
'Eu nunca me arrependi de não ter dito algo para alguém.',
  ];

  const frase = frases[Math.floor(Math.random() * frases.length)];

  await bot.sendMessage(msg.chat.id,
`🍻 *EU NUNCA*

${frase}

Responda:
✅ Eu já
❌ Eu nunca`,
  {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Eu já', callback_data: 'eununca_yes' },
          { text: '❌ Eu nunca', callback_data: 'eununca_no' }
        ],
        [
          { text: '🎲 Outra frase', callback_data: 'eununca_new' }
        ]
      ]
    }
  });

});

// 🏆 /rank ou /ranking tipo
bot.onText(/\/(rank|ranking)(?: (.+))?/, async (msg, match) => {

  const chatId = msg.chat.id;
  const tipo = match[2]?.toLowerCase().trim();

  const tipos = {
    gay: '🌈 TOP 5 MAIS GAYS',
    chato: '🙄 TOP 5 MAIS CHATOS',
    corno: '🐂 TOP 5 MAIS CORNOS',
    feio: '🤢 TOP 5 MAIS FEIOS',
    burro: '🐴 TOP 5 MAIS BURROS',
    lindo: '😎 TOP 5 MAIS LINDOS',
    invejoso: '😒 TOP 5 MAIS INVEJOSOS',
    vesgo: '👀 TOP 5 MAIS VESGOS'
  };


  if (!tipos[tipo]) {
    return bot.sendMessage(chatId,
`🏆 *RANKINGS DISPONÍVEIS*

/rank gay
/rank chato
/rank corno
/rank feio
/rank burro
/rank lindo
/rank vesgo
/rank invejoso`,
    {
      parse_mode: "Markdown"
    });
  }


  try {

    const membros = [];

    // pega membros recentes do chat (Telegram não libera lista completa de membros)
    const admins = await bot.getChatAdministrators(chatId);

    admins.forEach(a => {
      if (!a.user.is_bot) {
        membros.push(a.user);
      }
    });


    if (!membros.length) {
      return bot.sendMessage(chatId, "❌ Não encontrei usuários.");
    }


    membros.sort(() => Math.random() - 0.5);

    const ranking = membros.slice(0,5).map(user => ({
      user,
      porcentagem: Math.floor(Math.random() * 100) + 1
    }));


    ranking.sort((a,b)=> b.porcentagem - a.porcentagem);


    let texto = `🏆 *${tipos[tipo]}*\n\n`;

    ranking.forEach((r,i)=>{

      const medalha =
        i === 0 ? "🥇" :
        i === 1 ? "🥈" :
        i === 2 ? "🥉" :
        "🏅";

      const nome = r.user.first_name || "Usuário";

      texto += `${medalha} ${nome} ➜ ${r.porcentagem}%\n`;

    });


    bot.sendMessage(chatId,texto,{
      parse_mode:"Markdown"
    });

const math = require("mathjs");

module.exports = (bot) => {

bot.onText(/\/(calc|calcular|matematica) (.+)/, async (msg, match) => {

const chatId = msg.chat.id;
const entrada = match[2].trim();

try {

let resultado = "";
let tipo = "Conta numérica";
let explicacao = "";
let curiosidade = "";

function limparConta(txt) {
return txt
.replace(/÷/g, "/")
.replace(/×/g, "*")
.replace(/,/g, ".")
.replace(/π/g, "pi")
.replace(/√\s*\(?([0-9.]+)\)?/gi, "sqrt($1)")
.replace(/(\d+(?:\.\d+)?)\s*%\s*de\s*(\d+(?:\.\d+)?)/gi,
"($1/100)*($2)");
}


let expr = limparConta(entrada);


if (/^derivada\s+/i.test(expr)) {

tipo = "Derivada";

expr = expr.replace(/^derivada\s+/i,"");

resultado = math.derivative(expr,"x").toString();

explicacao =
`A derivada mostra a variação da função em relação a x.

Função:
${expr}

Derivada:
${resultado}`;

curiosidade =
"Derivadas são usadas em física, engenharia e inteligência artificial.";


}


else if (/^simplificar\s+/i.test(expr)) {

tipo = "Simplificação";

expr = expr.replace(/^simplificar\s+/i,"");

resultado = math.simplify(expr).toString();

explicacao =
`Expressão original:
${expr}

Simplificada:
${resultado}`;

curiosidade =
"Simplificação deixa expressões matemáticas mais fáceis de resolver.";

}


else if (/^resolver\s+/i.test(expr)) {

tipo = "Equação";

expr = expr.replace(/^resolver\s+/i,"");

let eq = expr.includes("=") ? expr : `${expr}=0`;

resultado = "Use uma equação mais simples.";

explicacao =
`Equação recebida:
${eq}`;

curiosidade =
"Equações procuram valores que tornam a igualdade verdadeira.";

}


else {

resultado = math.format(
math.evaluate(expr),
{precision:14}
);

explicacao =
`A conta foi resolvida seguindo a ordem matemática.

Expressão:
${expr}`;

curiosidade =
"Math.js suporta operações, raízes, potências e funções matemáticas.";

}



await bot.sendMessage(chatId,

`🧮 *CÁLCULO MATEMÁTICO*

👤 Usuário: ${msg.from.first_name}

🔎 Entrada:
${entrada}

📚 Tipo:
${tipo}


✅ *Resultado*

${resultado}


🧠 Explicação:

${explicacao}


💡 Curiosidade:

${curiosidade}


📌 Exemplos:

/calc 2+2*5
/calc sqrt(144)
/calc 10% de 250
/calc derivada x^2
/calc simplificar 2x+3x`,
{
parse_mode:"Markdown"
});


} catch(e){

console.log("ERRO CALC:",e);

bot.sendMessage(chatId,
"❌ Erro ao calcular. Verifique a conta.");

}

});


};

  } catch(e){

    console.log("Erro rank:",e);

    bot.sendMessage(chatId,
    "❌ Erro ao criar ranking.");

  }

});

};