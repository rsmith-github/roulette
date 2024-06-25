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
        } else if (messageObject.name === "login" && messageObject.username) {
            // all users start with 100 coins.
            users[messageObject.username] = 100;
        } else if (messageObject.name === "updateScores") {
            console.log('updating scoreboard');
            // calculate who won, deduct form other users and give to winner.

        }

    });

    ws.send(JSON.stringify(users))

});
