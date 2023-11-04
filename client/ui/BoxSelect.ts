import { Sprite, Texture } from "pixi.js";
import StarwatchSprite from "../StarwatchSprite";
import { ui } from "..";

export default class thisSelect extends Sprite {
  sprites = new Map<number, StarwatchSprite>();

  constructor() {
    super(Texture.WHITE);
    this.tint = 0x00ff00;
    this.alpha = 0.5;
    this.visible = false;

    document.body.addEventListener("mousedown", (e) => {
      if (e.button == 0) {
        this.x = e.clientX;
        this.y = e.clientY;
        this.width = 0;
        this.height = 0;
        this.visible = true;
      }
    });

    document.body.addEventListener("mousemove", (e) => {
      const dx = e.clientX - this.x;
      const dy = e.clientY - this.y;
      this.width = Math.abs(dx);
      this.height = Math.abs(dy);
      this.anchor.set(dx < 0 ? 1 : 0, dy < 0 ? 1 : 0);
    });

    document.body.addEventListener("mouseup", (e) => {
      this.visible = false;

      if (e.button == 0) {
        const ids: number[] = [];
        for (const [id, sprite] of this.sprites) {
          if (sprite.getBounds().intersects(this.getBounds().pad(.1, .1))) {
            ids.push(id);
          }
        }

        ui.select(ids);
      }
    });
  }

  addSprite(id: number, sprite: StarwatchSprite) {
    this.sprites.set(id, sprite);
  }
}