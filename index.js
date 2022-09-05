import { WebSocketServer, WebSocket } from "ws"
import ip from "ip"
import { v4 as uuid } from "uuid"
import {
  createLobby,
  exitLobby,
  joinLobby,
  makeMove,
} from "./lobbyController.js"

const PORT = 8080
const IP_ADDRESS = ip.address()
const wss = new WebSocketServer({ port: PORT })
wss.on("connection", function connection(ws, req) {
  const ip = req.socket.remoteAddress
  ws.on("message", function message(d) {
    const data = parseMsgData(d)
    if (!data) return

    let lobby

    if (data.type === "create-lobby") {
      lobby = createLobby(ip)
      ws.send(
        JSON.stringify({
          type: "create-lobby",
          message: "Lobby was created successfully",
          data: { lobby },
        })
      )
      return
    }
    if (data.type === "join-lobby") {
      lobby = joinLobby(data.data.lobbyId, ip)
      broadcast(
        JSON.stringify({
          type: "join-lobby",
          message: "Lobby was created successfully",
          data: { lobby },
        }),
        ws
      )
      // return
    }
    if (data.type === "move") {
      const lobby = makeMove(data.data.lobbyId, data.data.move, ip)
      broadcast(
        JSON.stringify({
          type: "move",
          message: `Move was made by ${ip}`,
          data: { lobby },
        }),
        ws
      )
      // return
    }
    if (data.type === "exit-lobby") {
      const lobbyId = data.lobbyId
      const lobby = exitLobby(lobbyId, ip)
      ws.send(
        JSON.stringify({
          type: "exit-lobby",
          message: `Player ${ip} has left the lobby`,
          lobbyId,
          data: lobby,
        })
      )
      broadcast(
        JSON.stringify({
          type: "update",
          message: `Player ${ip} has left the lobby`,
          lobbyId,
          data: { lobby },
        })
      )
      // return
    }
  })
})

wss.on("listening", function connection(ws, req) {
  console.log(
    `web socket server listening on ws://localhost:${PORT} ws://${IP_ADDRESS}:${PORT}`
  )
})

function broadcast(data, ws) {
  wss.clients.forEach((client) => {
    //Send to all execpt the original sender
    // if (client !== ws && client.readyState === WebSocket.OPEN) {
    //   client.send(data)
    // }

    //Send to all that are open
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

function parseMsgData(data) {
  const msg = data.toString()
  let json
  try {
    json = JSON.parse(msg)
  } catch (error) {
    json = null
  }
  return json
}
