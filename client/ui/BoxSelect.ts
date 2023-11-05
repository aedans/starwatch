import { Container, Sprite, Texture } from "pixi.js";
import { gameEngine, ui, viewport } from "..";
import Entity from "../../common/Entity";
import { OutlineFilter } from "@pixi/filter-outline";

export default class thisSelect extends Sprite {
  sprites = new Map<number, Container>();

  constructor() {
    super(Texture.WHITE);

    this.tint = 0x00ff00;
    this.alpha = 0.5;
    this.visible = false;
    this.filters = [new OutlineFilter(1, 0x00ff00)];

    let isSelect = false;
    let isMouseDown = false;

    document.body.addEventListener("mousedown", (e) => {      
      if (e.button == 0) {
        isMouseDown = true;

        this.x = e.clientX;
        this.y = e.clientY;
        this.width = 0;
        this.height = 0;
        this.visible = true;

        if (ui.minimap.getBounds().contains(e.clientX, e.clientY)) {
          const world = ui.toWorld(e.clientX, e.clientY);
          viewport.moveCenter(world.x, world.y);
          isSelect = false;
        } else {
          isSelect = true;
        }
      }
    });

    document.body.addEventListener("mousemove", (e) => {
      if (!isSelect && isMouseDown) {
        const world = ui.toWorld(e.clientX, e.clientY);
        viewport.moveCenter(world.x, world.y);
      } else {
        const dx = e.clientX - this.x;
        const dy = e.clientY - this.y;
        this.width = Math.abs(dx);
        this.height = Math.abs(dy);
        this.anchor.set(dx < 0 ? 1 : 0, dy < 0 ? 1 : 0);
      }
    });

    document.body.addEventListener("mouseup", (e) => {
      this.visible = false;
      isSelect = false;

      if (e.button == 0) {
        isMouseDown = false;

        const ids: number[] = [];
        for (const [id, sprite] of this.sprites) {
          if (sprite.getBounds().intersects(this.getBounds().pad(0.1, 0.1))) {
            ids.push(id);
          }
        }

        if (
          ids.length > 0 &&
          ui.selected.length > 0 &&
          JSON.stringify(ids) == JSON.stringify(ui.selected)
        ) {
          const type = Object.getPrototypeOf(
            gameEngine.world.queryObject({ id: ids[0] })
          );
          const sameType = (
            gameEngine.world.queryObjects({}) as Entity[]
          ).filter((e) => Object.getPrototypeOf(e) == type);
          ui.select(
            sameType.map((x) => x.id),
            e.shiftKey
          );
        } else {
          ui.select(ids, e.shiftKey);
        }
      }
    });
  }

  addSprite(id: number, sprite: Container) {
    this.sprites.set(id, sprite);
  }
}
