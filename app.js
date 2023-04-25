const {
  Client,
  Location,
  List,
  Buttons,
  LocalAuth,
} = require("whatsapp-web.js");

// const client = new Client();
const qrcode = require("qrcode-terminal");
const { validate } = require("uuid");

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "bot-bkk",
  password: "smkbisa",
  database: "database_loker",
});

const client = new Client({
  authStrategy: new LocalAuth(),
  // proxyAuthentication: { username: 'username', password: 'password' },
  puppeteer: {
    // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
    headless: false,
  },
});

client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
  console.log(qrcode.generator(qr));
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

// fungsi sambut
function sambut(val1) {
  if ((val1 = true)) {
    const par1 = "*_Selamat Datang_*";
    let par2 =
      "\n\n di Obrolan ini nanti kakak bisa bertanya seputar BKK SMK Muhammadiyah Lemahabang";
    let par3 =
      "\n\n Silahkan ucapkan salam, atau bisa langsung klik tombol dibawah ini :";
    return par1 + par2 + par3;
  }
}
// fungsi tombol
let firstTime = true;

//membuat array kemungkinan inputan
const salamUser = [
  "assalamu'alaikum",
  "Assalamu'alaikum",
  "Assalamu'Alaikum",
  "ass",
  "ASS",
  "Asw",
  "ASW",
  "Ass",
  "asw",
  "punten",
  "bu",
  "pak",
  "mas",
  "teh",
  "kang",
  "kak",
  "Kak",
  "Kang",
  "Bu",
  "Pak",
  "ibu",
  "Ibu",
  "Bapak",
  "bapak",
  "slm",
  "pa",
  "bu",
  ".",
  ",",
  ":",
  "Slm",
  "salam",
  "SALAM",
  "Salam",
  "ASSALAMU'ALAIKUM",
];
// program utama
// scan QR Code
client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr);
});
// ketika client siap
client.on("ready", () => {
  console.log("Client is ready!");

  //   client.reply(NomorPengirim, sambut(true));
});
// ketika client memberikan pesan

client.on("message", async (msg) => {
  const chats = await msg.getChat();

  // const viaJapri = msg.chat.type === "chat";
  // pengujian apakah bot berhasil
  /**
   *  khusus menangani Grup
   *
   *
   *
   *
   *
   **/

  if (chats.isGroup) {
    // Mengecek dengan ping
    if (msg.body == "!ping") {
      msg.reply("pong");
    }
    // emot reaksi
    else if (msg.body == "!reaction") {
      msg.react("👍");
    }
    // operasi dalam grup
    else if (msg.body === "!pribadi?") {
      msg.reply("bukan bos.. ini fitur di Grup");
    }
    // menangani keterangan grup
    else if (msg.body === "!grupinfo" || msg.body === "!grup") {
      let chat = await msg.getChat();
      if (chat.isGroup) {
        msg.reply(`
           *Selamat Datang di\n\n ${chat.name}*
            *Nama Grup*:${chat.name}
            *Deskripsi Grup*: ${chat.description}
            *Devoloped By*: Brother In Network
            *Member urut*: ${chat.participants.length}
        `);
        // program salam
        for (let i = 0; i < salamUser.length; i++) {
          if (msg.body.includes(salamUser[i])) {
            const NomorPengirim = chat.from.split("@")[0];
            const contactId = msg.author;
            const contact = await msg.client.getContactById(contactId);
            const nickname =
              contact.pushname || contact.verifiedName || contact.formattedName;
            msg.reply(`Pesan dari:@${nickname}`);

            //   msg.reply("");
            msg.reply(
              `Wa'alaikumsalam Kak.., ada yang bisa kami bantu? \n\n kak ${NomorPengirim} \n\n *[=== LIST MENU ===]* \n\n !daftar\n !infoloker\n !ppdb \n\n*BOT BKK SMKMLA*`
            );

            //   msg.reply('\n\n*BOT BKK SMKMLA*');
            break;
          }
        }
      }
    } else if (
      msg.body.toUpperCase() === "DAFTAR" ||
      msg.body.toUpperCase() === "REGISTER"
    ) {
      let chat = await msg.getChat();
      const phoneNumber = msg.author.split("@")[0];
      // menyimpan nomor telepon pengguna ke dalam database atau file
      console.log(
        `Pengguna dengan nomor telepon ${phoneNumber} telah didaftarkan.`
      );
      // membalas pesan konfirmasi pendaftaran
      await msg.reply(
        `Terima kasih sudah mendaftar! dengan nomor ${phoneNumber}`
      );
    }
  }

  // mengecek dengan ping

  /**
   *  Khusus Untuk Chatt pribadi
   *
   *
   *
   *
   *
   */
  else {
    if (msg.body == "!ping") {
      msg.reply("pong");
    } else if (msg.body == "!pribadi?") {
      msg.reply("oke bos.. ini fitur di chat pribadi");
    }
    // emot reaksi
    else if (msg.body == "!reaction") {
      msg.react("👍");
    } else if (
      msg.body.toUpperCase() === "DAFTAR" ||
      msg.body.toUpperCase() === "REGISTER"
    ) {
      let chat = await msg.getChat();
      const phoneNumber = msg.from.split("@")[0];
      // menyimpan nomor telepon pengguna ke dalam database atau file
      console.log(
        `Pengguna dengan nomor telepon ${phoneNumber} telah didaftarkan.`
      );
      // membalas pesan konfirmasi pendaftaran
      await msg.reply(
        `Terima kasih sudah mendaftar! dengan nomor ${phoneNumber}`
      );
    }
    // ketika user mengucapkan salam
    for (let i = 0; i < salamUser.length; i++) {
      if (msg.body.includes(salamUser[i])) {
        const NomorPengirim = msg.from.split("@")[0];
        //   msg.reply("");
        msg.reply(
          `Wa'alaikumsalam Kak.., ada yang bisa kami bantu? \n\n kak ${NomorPengirim} \n\n *[=== LIST MENU ===]* \n\n !daftar\n !infoloker\n !ppdb \n\n*BOT BKK SMKMLA*`
        );

        //   msg.reply('\n\n*BOT BKK SMKMLA*');
      }
    }
  }
  // jika pengguna mengucapkan salam
  //
  // penutup salam
});
