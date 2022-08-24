import { WebSocketServer } from "ws";
import ip from "ip";

const PORT = 8080;
const IP_ADDRESS = ip.address();
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log("connection from", ip);
  ws.on("message", function message(data) {
    ws.send(data);
  });
});

wss.on("listening", function connection(ws, req) {
  console.log(
    `web socket server listening on ws://localhost:${PORT} ws://${IP_ADDRESS}:${PORT}`
  );
});
