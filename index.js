import { WebSocketServer, WebSocket } from "ws";
import ip from "ip";
import { v4 as uuid } from "uuid";

const PORT = 8080;
const IP_ADDRESS = ip.address();
const wss = new WebSocketServer({ port: PORT });
const lobbies = new Set();

wss.on("connection", function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log("connection from", ip);
  ws.on("message", function message(data) {
    if (data.toString() === "create-lobby") {
      createLobby();
      console.log(lobbies);
    }

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

wss.on("listening", function connection(ws, req) {
  console.log(
    `web socket server listening on ws://localhost:${PORT} ws://${IP_ADDRESS}:${PORT}`
  );
});

function createLobby() {
  const newLobbyId = makeid();
  if (lobbies.has(newLobbyId)) {
    createLobby();
    return;
  }
  lobbies.add(newLobbyId);
}

function makeid(length = 5) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
