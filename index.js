const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ port: 8080 });

// mock database. 
let users = {};
let last_roll = -2991234;
let pool = 0;
wss.on('connection', (ws) => {

    console.log('🛜 New Client Connected...');

    ws.on('message', (data) => {
        const messageObject = JSON.parse(data.toString());

        // allow only admin to roll.
        if (messageObject.name === "admin") {
            // 0-14 random number
            const random_number = Math.floor(Math.random() * 14);
            last_roll = random_number;
            wss.clients.forEach((ws) => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(random_number)
                }
            })
        } else if (messageObject.name === "login" && messageObject.username && messageObject.username !== 'admin') {
            // all users start with 100 coins.
            users[messageObject.username] = { coins: 100 };
            sendUsers();

        } else if (messageObject.name === "updateScores") {
            console.log('updating scoreboard');

            // calculate who won, deduct from other users and give to winner.
            for (key in users) {
                console.log(`${key}:`, users[key]);
                if (Number(users[key].bet) === last_roll) {
                    console.log(`${key} wins`);
                    users[key].coins += pool;
                    pool = 0;
                }
            }

            sendUsers();


        } else if (messageObject.name === 'bet') {

            if (users[messageObject.username].coins) {
                users[messageObject.username].coins -= messageObject.amount
                pool += messageObject.amount
            } else {
                console.log(`insuficient funds for ${messageObject.username}`);
            }

            users[messageObject.username]['bet'] = messageObject.bet
            sendUsers();
        }

    });

    ws.send(JSON.stringify(users))

});

// update table for all clients
function sendUsers() {

    wss.clients.forEach(ws => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(users))
        }
    })

}