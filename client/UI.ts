import { Container } from "pixi.js";
import FullscreenButton from "./ui/FullscreenButton";
import { GlowFilter } from "@pixi/filter-glow";
import StarwatchSprite from "./StarwatchSprite";
import { clientEngine, ui, viewport } from ".";
import { StarwatchInput } from "../common/StarwatchGameEngine";

export default class UI extends Container {
  glowFilters = new Map<number, GlowFilter>();

  constructor() {
    super();

    document.body.addEventListener("contextmenu", (e) => {
      if (ui.selected != null) {
        const world = viewport.toWorld(e.clientX, e.clientY);
        const input: StarwatchInput = {
          type: "move",
          x: world.x,
          y: world.y,
          selected: ui.selected,
        };
        clientEngine.sendInput(JSON.stringify(input), {});
      }
    });

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
    this.selected = id;
  }
}
