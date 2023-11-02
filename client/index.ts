import { ClientEngineInputOptions, GameEngineOptions, Lib } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchClientEngine from "./StarwatchClientEngine";

const options: GameEngineOptions & ClientEngineInputOptions = {
  traceLevel: Lib.Trace.TRACE_NONE,
  scheduler: "render-schedule",
  syncOptions: {
    sync: "extrapolate",
    localObjBending: 0.2,
    remoteObjBending: 0.5,
  },
  serverURL: window.location.toString().replace("5173", "8080"),
} as const;

const gameEngine = new StarwatchGameEngine(options);
const clientEngine = new StarwatchClientEngine(gameEngine, options);

clientEngine.start();
