import {
  Application,
  Container,
  Sprite,
  Texture,
  Ticker,
  UPDATE_PRIORITY,
} from "pixi.js";
import { GameObject, PhysicsEngine, Renderer } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchClientEngine from "./StarwatchClientEngine";
import StarwatchViewport from "./StarwatchViewport";
import { addStats } from "pixi-stats";
import UI from "./UI";
import SpriteFactory from "./SpriteFactory";

const app = new Application<HTMLCanvasElement>({
  resizeTo: window,
});

document.body.appendChild(app.view);

document.body.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

const viewport = app.stage.addChild(new StarwatchViewport(app));
const ui = app.stage.addChild(new UI());

if (localStorage.getItem("debug") == "true") {
  const stats = addStats(document, app);
  (stats as any).stats.showPanel(1);
  Ticker.shared.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);
}

export default class StarwatchRenderer extends Renderer<
  StarwatchGameEngine,
  StarwatchClientEngine
> {
  sprites = new Map<number, Sprite>();
  spriteFactory = new SpriteFactory();

  addObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    const sprite = this.spriteFactory.createSprite(obj);
    viewport.addChild(sprite);
    this.sprites.set(obj.id, sprite);

    ui.addSelectableSprite(obj.id, sprite);
    sprite.on("click", () => {
      ui.select(obj.id);
    });
  }

  removeObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    this.sprites.get(obj.id)?.destroy();
    this.sprites.delete(obj.id);
  }
}
