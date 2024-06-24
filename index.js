const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {

    console.log("Incoming Connection")

});


setInterval(() => {

    // 0-14 random number
    const random_number = Math.floor(Math.random() * 14);
    wss.clients.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
            
            ws.send(random_number)

        }
    })
}, 7000)

