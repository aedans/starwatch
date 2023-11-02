import { Application, Sprite, Texture, Ticker, UPDATE_PRIORITY } from "pixi.js";
import { GameObject, PhysicsEngine, Renderer } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchClientEngine from "./StarwatchClientEngine";
import FullscreenButton from "./FullscreenButton";
import StarwatchViewport from "./StarwatchViewport";
import { addStats } from "pixi-stats";

const app = new Application<HTMLCanvasElement>({
  resizeTo: window,
});

document.body.appendChild(app.view);

const viewport = app.stage.addChild(new StarwatchViewport(app));
app.stage.addChild(new FullscreenButton());

if (localStorage.getItem("debug") == "true") {
  const stats = addStats(document, app);
  (stats as any).stats.showPanel(1);
  Ticker.shared.add(stats.update, stats, UPDATE_PRIORITY.UTILITY)
}

export default class StarwatchRenderer extends Renderer<
  StarwatchGameEngine,
  StarwatchClientEngine
> {
  addObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    const sprite = viewport.addChild(new Sprite(Texture.WHITE));
    sprite.tint = 0xffffff;
    sprite.width = sprite.height = 100;
    sprite.position.set(10, 10);
    console.log(obj);
  }

  removeObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    console.log(obj);
  }
}
