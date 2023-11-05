import { ServerEngine } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default class StarwatchServerEngine extends ServerEngine {
  constructor(io: Server, gameEngine: StarwatchGameEngine) {
    super(io, gameEngine, {
      debug: {},
      stepRate: 60,
      updateRate: 6,
    });
  }

  nextPlayerIds = ["1", "0"];

  getPlayerId(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): void | string {
    return this.nextPlayerIds[this.nextPlayerIds.length - 1];
  }

  onPlayerConnected(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): void {
    super.onPlayerConnected(socket);
    this.nextPlayerIds.pop();
  }

  onPlayerDisconnected(socketId: string, playerId: string): void {
    this.nextPlayerIds.push(playerId);
  }
}
