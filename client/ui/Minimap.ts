import { Container, Sprite, Texture } from "pixi.js";
import StarwatchSprite from "../StarwatchSprite";
import Entity from "../../common/Entity";
import { gameEngine, viewport } from "..";

export default class Minimap extends Container {
  icons = new Map<number, Sprite>();
  viewportSprite = new Sprite(Texture.WHITE);

  constructor() {
    super();

    this.sortableChildren = true;

    this.viewportSprite.tint = 0x555555;
    this.viewportSprite.alpha = 0.5;
    this.viewportSprite.zIndex = 1;
    this.addChild(this.viewportSprite);
  }

  draw() {
    this.viewportSprite.x = viewport.left;
    this.viewportSprite.y = viewport.top;
    this.viewportSprite.width = viewport.worldScreenWidth;
    this.viewportSprite.height = viewport.worldScreenHeight;

    for (const [id, sprite] of this.icons.entries()) {
      const object = gameEngine.world.queryObject({
        id,
      }) as Entity;

      if (object != null) {
        sprite.x = object.position.x;
        sprite.y = object.position.y;
        sprite.rotation = object.angle;
      }
    }
  }

  addSprite(id: number, sprite: StarwatchSprite) {
    const icon = this.addChild(new Sprite(Texture.WHITE));
    icon.tint = 0xffffff;
    icon.x = sprite.x;
    icon.y = sprite.y;
    icon.anchor.set(.5, .5);
    icon.scale.set(.25, .25);
    this.icons.set(id, icon);
  }
}
