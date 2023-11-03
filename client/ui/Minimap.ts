import { Container, Sprite, Texture } from "pixi.js";
import StarwatchSprite from "../StarwatchSprite";
import StarwatchDynamicObject from "../../common/StarwatchDynamicObject";
import { gameEngine, viewport } from "..";

export default class Minimap extends Container {
  icons = new Map<number, Sprite>();
  viewportSprite = new Sprite(Texture.WHITE);

  constructor() {
    super();

    this.scale.x = this.scale.y = 0.2;

    const map = this.addChild(new Sprite(Texture.WHITE));
    map.tint = 0x222222;
    map.width = map.height = 1000;

    this.viewportSprite.tint = 0x444444;
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
      }) as StarwatchDynamicObject;

      if (object != null) {
        sprite.x = object.position.x;
        sprite.y = object.position.y;
      }
    }
  }

  addSprite(id: number, sprite: StarwatchSprite) {
    const icon = this.addChild(new Sprite(Texture.WHITE));
    icon.tint = 0xffffff;
    icon.x = sprite.x;
    icon.y = sprite.y;
    this.icons.set(id, icon);
  }
}
