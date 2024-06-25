const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ port: 8080 });

// mock database. 
let users = {}

wss.on('connection', (ws) => {

    console.log('🛜 New Client Connected...');

    ws.on('message', (data) => {
        const messageObject = JSON.parse(data.toString());

        // allow only admin to roll.
        if (messageObject.name === "admin") {
            // 0-14 random number
            const random_number = Math.floor(Math.random() * 14);
            wss.clients.forEach((ws) => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(random_number)
                }
            })
        } else if (messageObject.name === "login" && messageObject.username && messageObject.username !== 'admin') {
            // all users start with 100 coins.
            users[messageObject.username] = { coins: 100 };
            sendUsers(messageObject);

        } else if (messageObject.name === "updateScores") {
            console.log('updating scoreboard');

            // calculate who won, deduct from other users and give to winner.
            for (key in users) {
                console.log(`${key}:`, users[key]);
            }

        } else if (messageObject.name === 'bet') {
            sendUsers(messageObject);
        }

    });

    ws.send(JSON.stringify(users))

});

// update table for all clients
function sendUsers(messageObject) {
    users[messageObject.username]['bet'] = messageObject.bet

    wss.clients.forEach(ws => {
        ws.send(JSON.stringify(users))
    })

}