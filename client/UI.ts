import { Container, Texture } from "pixi.js";
import FullscreenButton from "./ui/FullscreenButton";
import { GlowFilter } from "@pixi/filter-glow";
import StarwatchSprite from "./StarwatchSprite";
import { clientEngine, gameEngine, viewport } from ".";
import { StarwatchInput } from "../common/StarwatchGameEngine";
import Minimap from "./ui/Minimap";
import HotkeyPanel from "./ui/HotkeyPanel";
import BoxSelect from "./ui/BoxSelect";
import Entity from "../common/Entity";
import StarwatchMap, { TMXMap, TSXTileset } from "./StarwatchMap";
import MapNavmesh from "./MapNavmesh";

export default class UI extends Container {
  glowFilters = new Map<number, GlowFilter>();
  minimap = new Minimap();
  hotkeyPanel = new HotkeyPanel();
  boxSelect = new BoxSelect();
  controlGroups = new Map<string, number[]>();
  mapNavmesh: MapNavmesh;

  constructor(
    public map: TMXMap["map"],
    public tileset: TSXTileset["tileset"],
    public worldWidth: number,
    public worldHeight: number
  ) {
    super();

    document.body.addEventListener("contextmenu", (e) => {
      for (const selected of ui.selected) {
        const entity = gameEngine.world.queryObject({ id: selected }) as Entity;
        const world = viewport.toWorld(e.clientX, e.clientY);
        const path = this.mapNavmesh.navmesh.findPath(entity.position, world);
        const input: StarwatchInput = { type: "clear", selected: [selected] };
        clientEngine.sendInput(JSON.stringify(input), {});
        for (const entry of path ?? []) {
          const input: StarwatchInput = {
            type: "add",
            ability: "m",
            x: entry.x,
            y: entry.y,
            group: ui.selected.length,
            selected,
          };
          clientEngine.sendInput(JSON.stringify(input), {});
        }
      }
      e.preventDefault();
    });

    document.body.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() == "f2") {
        this.select(
          (gameEngine.world.queryObjects({}) as Entity[]).map((x) => x.id),
          false
        );
      }

      if (ui.selected != null) {
        if (e.key == "s") {
          const input: StarwatchInput = {
            type: "clear",
            selected: ui.selected,
          };
          clientEngine.sendInput(JSON.stringify(input), {});
        }

        if ("1234567890".includes(e.key)) {
          if (e.ctrlKey) {
            this.controlGroups.set(e.key, ui.selected);
          } else if (this.controlGroups.has(e.key)) {
            ui.select(this.controlGroups.get(e.key) ?? [], e.shiftKey);
          }
        }
      }
    });

    this.addChild(this.minimap);
    this.addChild(this.hotkeyPanel);
    this.addChild(this.boxSelect);
    this.addChild(new FullscreenButton());

    this.mapNavmesh = new MapNavmesh(map);

    this.minimap.addChild(
      new StarwatchMap(
        map,
        tileset,
        Texture.from(`/images/${tileset.image.source}`)
      )
    );

    this.minimap.addChild(this.mapNavmesh);

    const ui = this;
    window.addEventListener("resize", () => ui.resize());

    this.resize();
  }

  selected: number[] = [];

  resize() {
    this.minimap.x = 0;
    this.minimap.y = window.innerHeight - this.worldHeight;

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

  select(ids: number[], append: boolean) {
    if (this.selected && !append) {
      for (const selected of this.selected) {
        this.glowFilters.get(selected)!.enabled = false;
      }
    }

    for (const id of ids) {
      this.glowFilters.get(id)!.enabled = true;
    }

    if (append) {
      this.selected.push(...ids.filter((x) => !this.selected.includes(x)));
    } else {
      this.selected = ids;
    }
  }
}
