const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({port: 8080});

wss.on('connection', (ws) => {

    console.log("Incoming Connection")

});

