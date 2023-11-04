import { ClientEngineInputOptions, GameEngineOptions, Lib } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchClientEngine from "./StarwatchClientEngine";
import {
  Application,
  SCALE_MODES,
  Texture,
  Ticker,
  UPDATE_PRIORITY,
} from "pixi.js";
import StarwatchViewport from "./StarwatchViewport";
import UI from "./UI";
import { addStats } from "pixi-stats";
import StarwatchMap from "./Map";

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

if (localStorage.getItem("debug") == "true") {
  const stats = addStats(document, app);
  (stats as any).stats.showPanel(1);
  Ticker.shared.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);
}

const { map, tileset } = await StarwatchMap.load("1v1");

const worldWidth = Number.parseInt(map.width) * 10;
const worldHeight = Number.parseInt(map.height) * 10;
export const viewport = app.stage.addChild(
  new StarwatchViewport(app, worldWidth, worldHeight)
);
export const ui = app.stage.addChild(new UI(worldWidth, worldHeight));

const mapTexture = Texture.from(`/images/${tileset.image.source}`);
mapTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
Texture.removeFromCache(mapTexture);
const minimapTexture = Texture.from(`/images/${tileset.image.source}`);

viewport.addChild(new StarwatchMap(map, tileset, mapTexture));
ui.minimap.addChild(new StarwatchMap(map, tileset, minimapTexture));

clientEngine.start();
