import { Container } from "pixi.js";
import FullscreenButton from "./ui/FullscreenButton";
import { GlowFilter } from "@pixi/filter-glow";
import StarwatchSprite from "./StarwatchSprite";
import { clientEngine, ui, viewport } from ".";
import { StarwatchInput } from "../common/StarwatchGameEngine";
import Minimap from "./ui/Minimap";

export default class UI extends Container {
  glowFilters = new Map<number, GlowFilter>();
  minimap = new Minimap();

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

    this.minimap = this.addChild(new Minimap());
    this.addChild(new FullscreenButton());

    const ui = this;
    window.addEventListener("resize", () => ui.resize());

    this.resize();
  }

  private selected: number | null = null;

  resize() {
    this.minimap.x = 0;
    this.minimap.y = window.innerHeight - 200;
  }

  draw() {
    this.minimap.draw();
  }

  addSprite(id: number, sprite: StarwatchSprite) {
    const glowFilter = new GlowFilter({ quality: 1 });
    glowFilter.enabled = false;
    this.glowFilters.set(id, glowFilter);

    sprite.interactive = true;

    if (!sprite.filters) {
      sprite.filters = [];
    }

    sprite.filters!.push(glowFilter);

    this.minimap.addSprite(id, sprite);
  }

  select(id: number) {
    if (this.selected) {
      this.glowFilters.get(this.selected)!.enabled = false;
    }

    this.glowFilters.get(id)!.enabled = true;
    this.selected = id;
  }
}
