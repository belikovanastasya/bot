process.env["NTBA_FIX_319"] = 1;

/*var token = "503801800:AAFg6m9ysbkEU8-UdU6F-hjEPTabuQz0Txk"*/
const TelegramBot = require('node-telegram-bot-api');
const sqlite = require('sqlite-sync'); //requiring 
 
//Connecting - if the file does not exist it will be created 
sqlite.connect('library.db'); 
 
//Creating table - you can run any command 
sqlite.run("CREATE TABLE IF NOT EXISTS messages(ID  INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL unique, from_id integer NOT NULL, message_id integer NOT NULL)",function(res){
    if(res.error)
        throw res.error;
});

sqlite.insert("messages",{
	key:"Hello",
	from_id: 36530064,
	message_id: 23  

	 });
sqlite.insert("messages",{
	key:"test",
	from_id: 36530064,
	message_id: 25
	 
	 });
console.log(sqlite.run('SELECT * FROM messages'))

// replace the value below with the Telegram token you receive from @BotFather
const token = "503801800:AAFg6m9ysbkEU8-UdU6F-hjEPTabuQz0Txk";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/get (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const key = match[1]; // the captured "whatever"
    const message = getMessage(key)
    if (message.exists){
    	 bot.forwardMessage(chatId, message.from_id, message.message_id );
    }

    // send back the matched "whatever" to the chat
   
});

function isMessageExist(key){
	return sqlite.run("SELECT count(*) as cnt FROM messages WHERE `key` = ?", [key][0].cnt!=0)
}
function getMessage(key){
	const data =  sqlite.run("SELECT *  FROM messages WHERE `key` = ? LIMIT 1", [key]);
	if(data.length == 0 ){
		return {exists: false};
	}
	data[0].exists = true;
	return data[0];
}

// Listen for any kind of message. There are different kinds of
// messages.
/*bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, JSON.stringify(msg));
}); */