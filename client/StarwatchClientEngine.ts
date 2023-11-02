import { ClientEngine, ClientEngineInputOptions } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchRenderer from "./StarwatchRenderer";

export default class StarwatchClientEngine extends ClientEngine<StarwatchGameEngine> {
  constructor(
    gameEngine: StarwatchGameEngine,
    options: ClientEngineInputOptions,
  ) {
    super(gameEngine, options, StarwatchRenderer);
  }
}
