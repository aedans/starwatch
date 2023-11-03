import { Container } from "pixi.js";
import FullscreenButton from "./ui/FullscreenButton";
import { GlowFilter } from "@pixi/filter-glow";
import StarwatchSprite from "./StarwatchSprite";

export default class UI extends Container {
  glowFilters = new Map<number, GlowFilter>();

  constructor() {
    super();

    this.addChild(new FullscreenButton());
  }

  private selected: number | null = null;

  addSelectableSprite(id: number, sprite: StarwatchSprite) {
    const glowFilter = new GlowFilter({ quality: 1 });
    glowFilter.enabled = false;
    this.glowFilters.set(id, glowFilter);

    sprite.interactive = true;

    if (!sprite.filters) {
      sprite.filters = [];
    }

    sprite.filters!.push(glowFilter);
  }

  select(id: number) {
    if (this.selected) {
      this.glowFilters.get(this.selected)!.enabled = false;
    }

    this.glowFilters.get(id)!.enabled = true;
    console.log(this.glowFilters.get(id)!.enabled);
    this.selected = id;
  }
}
