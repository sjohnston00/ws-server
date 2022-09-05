export class Lobby {
  id
  players = []
  created = new Date()
  lastUpdated = new Date()
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
