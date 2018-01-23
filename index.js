process.env["NTBA_FIX_319"] = 1;

/*var token = "503801800:AAFg6m9ysbkEU8-UdU6F-hjEPTabuQz0Txk"*/
const TelegramBot = require("node-telegram-bot-api");
const sqlite = require("sqlite-sync"); //requiring

//Connecting - if the file does not exist it will be created
sqlite.connect("library.db");

//Creating table - you can run any command
sqlite.run(
  "CREATE TABLE IF NOT EXISTS crossfit(ID  INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL, time TEXT NOT NULL, workout TEXT NOT NULL, coach TEXT NOT NULl)",
  function(res) {
    if (res.error) throw res.error;
  }
);

sqlite.run(
  "CREATE TABLE IF NOT EXISTS fitness(ID  INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL, time TEXT NOT NULL, workout TEXT NOT NULL, coach TEXT NOT NULl)",
  function(res) {
    if (res.error) throw res.error;
  }
);

sqlite.insert("crossfit", {
  key: "понедельник",
  time: "16:30",
  workout: "crossfit",
  coach: "Богачева Елена"
});

sqlite.insert("crossfit", {
  key: "вторник",
  time: "8:30",
  workout: "crossfit",
  coach: "Богачева Елена"
});
sqlite.insert("crossfit", {
  key: "вторник",
  time: "9:30",
  workout: "fitness",
  coach: "Иванов Иван"
});
sqlite.insert("crossfit", {
  key: "вторник",
  time: "10:30",
  workout: "stretching",
  coach: "Петров Сергей"
});

sqlite.insert("fitness", {
  key: "понедельник",
  time: "16:30",
  workout: "yoga",
  coach: "Богачева Елена"
});

sqlite.insert("fitness", {
  key: "вторник",
  time: "8:30",
  workout: "zoomba",
  coach: "Богачева Елена"
});
sqlite.insert("fitness", {
  key: "вторник",
  time: "9:30",
  workout: "fitness",
  coach: "Иванов Иван"
});
sqlite.insert("fitness", {
  key: "вторник",
  time: "10:30",
  workout: "stretching",
  coach: "Петров Сергей"
});

/*console.log(sqlite.run('SELECT * FROM fitness'))*/

// replace the value below with the Telegram token you receive from @BotFather
const token = "503801800:AAFg6m9ysbkEU8-UdU6F-hjEPTabuQz0Txk";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

var options_training = {
   "parse_mode": "Markdown",
  "reply_markup": JSON.stringify({
    "keyboard": [
      [{ text: "Fitness" }],
      [{ text: "Kids" }],
      [{ text: "Crossfit" }],
      [{ text: "Fightzone" }],
    ],
    "one_time_keyboard": true
  })
};

  var options_dayly = {
    reply_markup: JSON.stringify({
      "parse_mode": "Markdown",
      "keyboard": [
        [{ text: "понедельник"}],
        [{ text: "вторник"}],
        [{ text: "среда"}],
        [{ text: "четверг"}],
        [{ text: "пятница"}],
        [{ text: "суббота"}],
        [{ text: "воскресенье"}]
      ],
      "one_time_keyboard": true
    })
  };

// Matches "/echo [whatever]"
bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Выберите тип тренировки", options_training);

}); 


bot.onText(/Fitness/, (msg, match) => {
 const chatId = msg.chat.id;
  bot.sendMessage(chatId,'Выберите день недели', options_dayly );
 
});



/*bot.onText(/\/start_test/, function (msg, match) {

 bot.sendMessage(chatId, 'Выберите любую кнопку:', options);

});*/

bot.onText(/понедельник|вторник|среда|четверг|пятница|суббота|воскресенье/, (msg, match) => {
 
  const chatId = msg.chat.id;
  const key = msg.text; // the captured "whatever"
  const message = getMessage(key);
  if (message.exists) {
    for (var i = 0; i < message.length; i++) {
      var answerArray = [];
      let answer =
        message[i].time +
        "   " +
        message[i].workout +
        "    " +
        message[i].coach;
      bot.sendMessage(chatId, answer);
    }
  }
});

function isMessageExist(key) {
  return sqlite.run(
    "SELECT count(*) as cnt FROM crossfit WHERE `key` = ?",
    [key][0].cnt != 0
  );
}

function showDaylyButton(id) {
  var options_dayly = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Понедельник", callback_data: "понедельник" }],
        [{ text: "Вторник", callback_data: "вторник" }],
        [{ text: "Среда", callback_data: "среда" }],
        [{ text: "Четверг", callback_data: "четверг" }],
        [{ text: "Пятница", callback_data: "пятница" }],
        [{ text: "Суббота", callback_data: "суббота" }],
        [{ text: "Воскресенье", callback_data: "воскресенье" }]
      ]
    })
  };
  var chatId = id;

  bot.sendMessage(chatId, "Выберите день недели", options_dayly);
  bot.on("callback_query", function(msg) {
    var key  = msg.data
  
      const message = getMessage(key);
  
if (message.exists) {
    for (var i = 0; i < message.length; i++) {
      var answerArray = [];
      let answer = message[i].time + "   " + message[i].workout + "    " + message[i].coach;
      bot.sendMessage(chatId, answer);
    }
  }
  })
}

function getMessage(key) {
  let data = sqlite.run("SELECT *  FROM crossfit WHERE `key` = ?", [key]);

  if (data.length == 0) {
    return { exists: false };
  }
  data.exists = true;
  return data;
}

// Listen for any kind of message. There are different kinds of
// messages.
/*bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, JSON.stringify(msg));
}); */
