import { Container, Sprite, Texture } from "pixi.js";
import Entity from "../common/Entity";
import { gameEngine, ui } from ".";
import { GlowFilter } from "@pixi/filter-glow";
import HealthStarwatchSprite from "./HealthBar";

export default class StarwatchSprite<
  T extends Entity = Entity
> extends Container {
  private selectFilter: GlowFilter;
  private selected = false;
  private hovered = false;

  constructor(public entity: T) {
    super();

    const color =
      gameEngine.getEntity(entity.id).playerId.toString() == gameEngine.playerId
        ? 0x00ff00
        : 0xff0000;

    this.interactive = true;

    this.selectFilter = new GlowFilter({ color });
    this.filters = [this.selectFilter];
    this.selectFilter.enabled = false;

    this.on("mouseenter", () => this.setHovered(true));
    this.on("mouseleave", () => this.setHovered(false));
  }

  draw() {
    this.rotation = this.entity.angle;
    this.x = this.entity.position.x;
    this.y = this.entity.position.y;
  }

  setSelected(selected: boolean) {
    this.selected = selected;
    this.selectFilter.enabled = this.selected || this.hovered;
  }

  setHovered(hovered: boolean) {
    this.hovered = hovered;
    this.selectFilter.enabled = this.selected || this.hovered;

    if (hovered) {
      ui.hovered = this.entity.id;
    } else {
      ui.hovered = null;
    }
  }

  addSprite(texture: Texture) {
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 0.5);
    return this.addChild(sprite);
  }
}
