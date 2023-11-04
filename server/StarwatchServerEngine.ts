import { ServerEngine } from "lance-gg"
import StarwatchGameEngine from "../common/StarwatchGameEngine"
import { Server } from "socket.io"

export default class StarwatchServerEngine extends ServerEngine {
  constructor(io: Server, gameEngine: StarwatchGameEngine) {
    super(io, gameEngine, {
      debug: {},
      stepRate: 60,
      updateRate: 6,
    })
  }
}