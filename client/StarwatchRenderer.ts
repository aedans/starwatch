import { GameObject, PhysicsEngine, Renderer } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchClientEngine from "./StarwatchClientEngine";
import SpriteFactory from "./SpriteFactory";
import { ui, viewport } from ".";
import Entity from "../common/Entity";
import { Container } from "pixi.js";

export default class StarwatchRenderer extends Renderer<
  StarwatchGameEngine,
  StarwatchClientEngine
> {
  sprites = new Map<number, Container>();
  spriteFactory = new SpriteFactory();

  draw(t: number, dt?: number | undefined): void {
    super.draw(t, dt);

    for (const [id, sprite] of this.sprites.entries()) {
      const object = this.gameEngine.getEntity(id);

      if (object != null) {
        sprite.rotation = object.angle;
        sprite.x = object.position.x;
        sprite.y = object.position.y;
      }
    }

    ui.draw();
  }

  addObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    const entity = obj as Entity;
    const sprite = this.spriteFactory.createSprite(entity);
    viewport.addChild(sprite);
    this.sprites.set(obj.id, sprite);

    if (!entity.isDecorative) {
      ui.addSprite(obj.id, sprite);
    }
  }

  removeObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    this.sprites.get(obj.id)?.destroy();
    this.sprites.delete(obj.id);
  }
}
