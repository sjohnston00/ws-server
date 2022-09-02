export class Lobby {
  id
  players = []
  created = new Date()
  lastUpdate = new Date()
  events = [
    {
      type: "lobby-created",
      data: null,
      timestamp: new Date(),
    },
  ]

  logEvent(data) {
    this.events.push({
      ...data,
      timestamp: new Date(),
    })
  }
}
