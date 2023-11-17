import { GameObject, PhysicsEngine, Renderer } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchClientEngine from "./StarwatchClientEngine";
import SpriteFactory from "./SpriteFactory";
import { ui, viewport } from ".";
import Entity from "../common/Entity";

export default class StarwatchRenderer extends Renderer<
  StarwatchGameEngine,
  StarwatchClientEngine
> {
  spriteFactory = new SpriteFactory();

  draw(t: number, dt?: number | undefined): void {
    super.draw(t, dt);

    for (const sprite of ui.sprites.values()) {
      sprite.draw();
    }

    ui.draw();
  }

  addObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    const entity = obj as Entity;
    const sprite = this.spriteFactory.createSprite(entity);
    if (sprite != undefined) {
      viewport.addChild(sprite);
      ui.sprites.set(obj.id, sprite);

      if (!entity.isDecorative) {
        ui.addSprite(obj.id, sprite);
      }
    }
  }

  removeObject(obj: GameObject<StarwatchGameEngine, PhysicsEngine>): void {
    ui.sprites.get(obj.id)?.destroy();
    ui.sprites.delete(obj.id);
    ui.selected = ui.selected.filter(x => x != obj.id);
  }
}
