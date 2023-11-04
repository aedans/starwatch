import { ClientEngineInputOptions, GameEngineOptions, Lib } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchClientEngine from "./StarwatchClientEngine";
import { Application, Ticker, UPDATE_PRIORITY } from "pixi.js";
import StarwatchViewport from "./StarwatchViewport";
import UI from "./UI";
import { addStats } from "pixi-stats";

document.body.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

const options: GameEngineOptions & ClientEngineInputOptions = {
  traceLevel: Lib.Trace.TRACE_NONE,
  delayInputCount: 5,
  scheduler: "render-schedule",
  syncOptions: {
    sync: "extrapolate",
    localObjBending: 0.8,
    remoteObjBending: 1.0,
  },
  serverURL: window.location.toString().replace("5173", "8080"),
} as const;

export const gameEngine = new StarwatchGameEngine(options);
export const clientEngine = new StarwatchClientEngine(gameEngine, options);

const app = new Application<HTMLCanvasElement>({
  resizeTo: window,
});

document.body.appendChild(app.view);

document.body.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

if (localStorage.getItem("debug") == "true") {
  const stats = addStats(document, app);
  (stats as any).stats.showPanel(1);
  Ticker.shared.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);
}

export const viewport = app.stage.addChild(new StarwatchViewport(app));
export const ui = app.stage.addChild(new UI());

clientEngine.start();
