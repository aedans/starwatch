import { GameObject, PhysicsEngine, Renderer } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchClientEngine from "./StarwatchClientEngine";
import SpriteFactory from "./SpriteFactory";
import { ui, viewport } from ".";
import Entity from "../common/Entity";
import StarwatchSprite from "./StarwatchSprite";

export default class StarwatchRenderer extends Renderer<
  StarwatchGameEngine,
  StarwatchClientEngine
> {
  sprites = new Map<number, StarwatchSprite>();
  spriteFactory = new SpriteFactory();

  draw(t: number, dt?: number | undefined): void {
    super.draw(t, dt);

    for (const [id, sprite] of this.sprites.entries()) {
      const object = this.gameEngine.world.queryObject({
        id,
      }) as Entity;

      if (object != null) {
        sprite.rotation = object.angle;
        sprite.x = object.position.x;
        sprite.y = object.position.y;
      }
    }

    ui.draw();
  }

  addObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    const sprite = this.spriteFactory.createSprite(obj);
    viewport.addChild(sprite);
    this.sprites.set(obj.id, sprite);

    ui.addSprite(obj.id, sprite);
    sprite.on("click", () => {
      ui.select(obj.id);
    });
  }

  removeObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    this.sprites.get(obj.id)?.destroy();
    this.sprites.delete(obj.id);
  }
}
