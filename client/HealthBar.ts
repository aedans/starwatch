import { Container, Sprite, Texture } from "pixi.js";
import StarwatchSprite from "./StarwatchSprite";
import { gameEngine, viewport } from ".";

export default class HealthBar extends Container {
  private background: Sprite;
  private foreground: Sprite;

  constructor(public sprite: StarwatchSprite) {
    super();

    this.background = new Sprite(Texture.WHITE);
    this.background.tint = 0x000000;
    this.background.width = 50;
    this.background.height = 4;
    this.background.x = -this.background.width / 2;
    this.background.y = -30;
    this.addChild(this.background);

    this.foreground = new Sprite(Texture.WHITE);
    this.foreground.width = this.background.width;
    this.foreground.height = this.background.height;
    this.foreground.x = this.background.x;
    this.foreground.y = this.background.y;
    this.addChild(this.foreground);

    this.draw();
  }

  draw() {
    if (this.sprite.destroyed) {
      this.destroy();
      return;
    }

    const point = viewport.toGlobal(this.sprite);
    this.x = point.x;
    this.y = point.y;

    this.foreground.tint =
      this.sprite.entity.playerId.toString() == gameEngine.playerId
        ? 0x00ff00
        : 0xff0000;

    this.foreground.width =
      this.background.width *
      (this.sprite.entity.health / this.sprite.entity.settings.maxHealth);

    this.visible =
      this.sprite.entity.health != this.sprite.entity.settings.maxHealth;
  }
}
