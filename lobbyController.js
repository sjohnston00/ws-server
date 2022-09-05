import { Lobby } from "./lobby.js"

export const lobbies = new Map()

export function createLobby(ip) {
  //Check the user is not already part of a lobby
  // if (isPlayerInALobby(ip)) {
  //   console.warn("You are already part of a lobby, exit that one first")
  //   return
  // }

  const newLobbyId = makeid()
  if (lobbies.has(newLobbyId)) {
    createLobby()
    return
  }
  const lobby = new Lobby()
  lobby.id = newLobbyId
  lobby.players.push(ip)
  lobby.logEvent({
    type: "join-lobby",
    message: `player1 ${ip} has joined`,
  })

  lobbies.set(newLobbyId, lobby)
  return lobby
}
export function makeid(length = 5) {
  var result = ""
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// export function isPlayerInALobby(playerIp) {
//   console.log([...lobbies.values()])
//   return (
//     [...lobbies.values()].filter(
//       ({ player1, player2 }) => player1 === playerIp || player2 === playerIp
//     ).length > 0
//   )
// }

export function joinLobby(lobbyId, ip) {
  if (!lobbies.has(lobbyId)) {
    console.log(`This lobby does not exist`)
    return
  }

  const lobby = lobbies.get(lobbyId)
  lobby.lastUpdated = new Date()

  if (lobby.players.length >= 2) {
    lobby.logEvent({
      type: "join-lobby",
      message: `player ${ip} tried to join, but lobby is full`,
    })
    lobbies.set(lobbyId, lobby)
    return lobby
  }
  lobby.logEvent({
    type: "join-lobby",
    message: `player2 ${ip} has joined`,
  })

  lobby.players.push(ip)
  lobbies.set(lobbyId, lobby)
  return lobby
}

export function makeMove(lobbyId, data, ip) {
  if (!lobbies.has(lobbyId)) {
    console.log(`This lobby does not exist`)
    return
  }

  const lobby = lobbies.get(lobbyId)
  lobby.lastUpdated = new Date()
  lobby.logEvent({
    type: "move",
    data: { move: data, player: ip },
  })
  lobbies.set(lobbyId, lobby)
  return lobby
}
