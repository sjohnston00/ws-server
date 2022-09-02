import { WebSocketServer, WebSocket } from "ws"
import ip from "ip"
import { v4 as uuid } from "uuid"

const PORT = 8080
const IP_ADDRESS = ip.address()
const wss = new WebSocketServer({ port: PORT })
const lobbies = new Map()

wss.on("connection", function connection(ws, req) {
  const ip = req.socket.remoteAddress
  console.log("connection from", ip)
  ws.on("message", function message(d) {
    const data = parseMsgData(d)
    if (!data) return

    if (data.type === "create-lobby") {
      createLobby(ws, ip)
      console.log(lobbies)
    }
    if (data.type === "join-lobby") {
      joinLobby(data.data.lobbyId, ws, ip)
    }

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  })
})

wss.on("listening", function connection(ws, req) {
  console.log(
    `web socket server listening on ws://localhost:${PORT} ws://${IP_ADDRESS}:${PORT}`
  )
})

function createLobby(ws, ip) {
  //Check the user is not already part of a lobby
  if (isPlayerInALobby(ip)) {
    console.warn("You are already part of a lobby, exit that one first")
    return
  }

  const newLobbyId = makeid()
  if (lobbies.has(newLobbyId)) {
    createLobby()
    return
  }

  lobbies.set(newLobbyId, {
    player1: ip,
    player2: null,
  })
  ws.send(
    JSON.stringify({
      type: "create-lobby",
      message: "Lobby was created successfully",
      data: { lobbyId: newLobbyId, player1: ip },
    })
  )
}
function joinLobby(lobbyId, ws, ip) {
  if (!lobbies.has(lobbyId)) {
    console.log(`This lobby does not exist`)
    return
  }

  const prev = lobbies.get(lobbyId)

  if (prev.player1 && prev.player2) {
    const msg = "This lobby is full"
    console.warn(msg)
    ws.send(
      JSON.stringify({
        type: "join-lobby",
        message: msg,
        data: null,
      })
    )
    return
  }

  lobbies.set(lobbyId, {
    ...prev,
    player2: ip,
  })

  const current = lobbies.get(lobbyId)
  console.log(lobbyId, current)
  ws.send(
    JSON.stringify({
      type: "join-lobby",
      message: `Lobby ${lobbyId} was joined`,
      data: { lobby: current, lobbyId },
    })
  )
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

function makeid(length = 5) {
  var result = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function isPlayerInALobby(playerIp) {
  return (
    [...lobbies.values()].filter(
      ({ player1, player2 }) => player1 === playerIp || player2 === playerIp
    ).length > 0
  )
}
