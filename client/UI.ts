import { Container } from "pixi.js";
import FullscreenButton from "./ui/FullscreenButton";
import { GlowFilter } from "@pixi/filter-glow";
import StarwatchSprite from "./StarwatchSprite";
import { clientEngine, viewport } from ".";
import { StarwatchInput } from "../common/StarwatchGameEngine";
import Minimap from "./ui/Minimap";
import HotkeyPanel from "./ui/HotkeyPanel";
import BoxSelect from "./ui/BoxSelect";

export default class UI extends Container {
  glowFilters = new Map<number, GlowFilter>();
  minimap = new Minimap();
  hotkeyPanel = new HotkeyPanel();
  boxSelect = new BoxSelect();

  constructor() {
    super();

    document.body.addEventListener("contextmenu", (e) => {
      if (ui.selected != null) {
        const world = viewport.toWorld(e.clientX, e.clientY);
        const input: StarwatchInput = {
          type: "set",
          ability: "m",
          x: world.x,
          y: world.y,
          selected: ui.selected,
        };
        clientEngine.sendInput(JSON.stringify(input), {});
      }
    });

    document.body.addEventListener("keypress", (e) => {
      if (ui.selected != null) {
        if (e.key == "s") {
          const input: StarwatchInput = {
            type: "clear",
            selected: ui.selected,
          };
          clientEngine.sendInput(JSON.stringify(input), {});
        }
      }
    });

    this.addChild(this.minimap);
    this.addChild(this.hotkeyPanel);
    this.addChild(this.boxSelect);
    this.addChild(new FullscreenButton());

    const ui = this;
    window.addEventListener("resize", () => ui.resize());

    this.resize();
  }

  private selected: number[] = [];

  resize() {
    this.minimap.x = 0;
    this.minimap.y = window.innerHeight - 200;

    this.hotkeyPanel.x = window.innerWidth - 200;
    this.hotkeyPanel.y = window.innerHeight - 200;
  }

  draw() {
    this.minimap.draw();
    this.hotkeyPanel.draw();
  }

  addSprite(id: number, sprite: StarwatchSprite) {
    const glowFilter = new GlowFilter({ quality: 1, color: 0x00ff00 });
    glowFilter.enabled = false;
    this.glowFilters.set(id, glowFilter);

    sprite.interactive = true;

    if (!sprite.filters) {
      sprite.filters = [];
    }

    sprite.filters!.push(glowFilter);

    this.minimap.addSprite(id, sprite);
    this.boxSelect.addSprite(id, sprite);
  }

  select(ids: number[]) {
    if (this.selected) {
      for (const selected of this.selected) {
        this.glowFilters.get(selected)!.enabled = false;
      }
    }

    for (const id of ids) {
      this.glowFilters.get(id)!.enabled = true;
    }

    this.selected = ids;
  }
}
