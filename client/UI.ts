import { Container, Point, Texture } from "pixi.js";
import FullscreenButton from "./ui/FullscreenButton";
import { clientEngine, gameEngine, viewport } from ".";
import Minimap from "./ui/Minimap";
import HotkeyPanel from "./ui/HotkeyPanel";
import BoxSelect from "./ui/BoxSelect";
import StarwatchMap from "./StarwatchMap";
import MapNavmesh from "./MapNavmesh";
import { TMXMap, TSXTileset } from "../common/TMXLoader";
import Vector2 from "navmesh/src/math/vector-2";
import StarwatchSprite from "./StarwatchSprite";
import { Input } from "../common/StarwatchGameEngine";
import { AbilityKey, ActionTarget } from "../common/Ability";

export default class UI extends Container {
  sprites = new Map<number, StarwatchSprite>();
  minimap = new Minimap();
  hotkeyPanel = new HotkeyPanel();
  boxSelect = new BoxSelect();
  controlGroups = new Map<string, number[]>();
  mapNavmesh: MapNavmesh;
  hovered: number | null = null;
  clientX = 0;
  clientY = 0;

  constructor(
    public map: TMXMap["map"],
    public tileset: TSXTileset["tileset"],
    public worldWidth: number,
    public worldHeight: number
  ) {
    super();

    window.addEventListener("mousemove", (e) => {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    });

    document.body.addEventListener("contextmenu", (e) => {
      this.ability("m");
      e.preventDefault();
    });

    document.body.addEventListener("keydown", (e) => {
      if (e.repeat) {
        return;
      }

      if (e.key.toLowerCase() == "f2") {
        this.select(
          gameEngine
            .getEntities()
            .filter(
              (x) =>
                !x.isDecorative && x.playerId.toString() == gameEngine.playerId
            )
            .map((x) => x.id),
          false,
          true
        );
      }

      if ("qwerasdfzxcvm".includes(e.key)) {
        this.ability(e.key as AbilityKey);
      }

      if (e.key == "s") {
        const input: Input = {
          type: "clear",
          selected: ui.selected,
        };
        clientEngine.sendInput(JSON.stringify([input]), {});
      }

      if ("1234567890".includes(e.key)) {
        if (e.ctrlKey) {
          this.controlGroups.set(e.key, ui.selected);
        } else if (this.controlGroups.has(e.key)) {
          ui.select(this.controlGroups.get(e.key) ?? [], e.shiftKey, true);
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

  toWorld(x: number, y: number) {
    if (this.minimap.getBounds().contains(x, y)) {
      return this.minimap.toLocal(new Point(x, y));
    } else {
      return viewport.toWorld(x, y);
    }
  }

  selected: number[] = [];

  resize() {
    this.minimap.x = 0;
    this.minimap.y = window.innerHeight - this.minimap.height;

    this.hotkeyPanel.x = window.innerWidth - 200;
    this.hotkeyPanel.y = window.innerHeight - 200;
  }

  draw() {
    this.minimap.draw();
    this.hotkeyPanel.draw();
  }

  ability(ability: AbilityKey) {
    const inputs: Input[] = [];
    for (const selected of this.selected) {
      const entity = gameEngine.getEntity(selected);
      const path: { x: number; y: number }[] = [];
      let end: { x: number; y: number } = this.toWorld(
        this.clientX,
        this.clientY
      );
      let start: { x: number; y: number } = entity.position;

      if (!this.mapNavmesh.navmesh.isPointInMesh(end)) {
        end = this.mapNavmesh.navmesh.findClosestMeshPoint(
          new Vector2(end.x, end.y)
        ).point!;
      }

      if (!this.mapNavmesh.navmesh.isPointInMesh(start)) {
        start = this.mapNavmesh.navmesh.findClosestMeshPoint(
          new Vector2(start.x, start.y)
        ).point!;
        path.unshift(new Vector2(start.x, start.y));
      }

      path.push(...(this.mapNavmesh.navmesh.findPath(start, end) ?? [end]));

      inputs.push({ type: "clear", selected: [selected] });
      for (const entry of path.slice(1, -1)) {
        inputs.push({
          type: "add",
          ability: ability == "a" ? "a" : "m",
          target: {
            type: "point",
            x: entry.x,
            y: entry.y,
          },
          group: this.selected.length,
          selected,
        });
      }

      const target: ActionTarget = this.hovered
        ? { type: "unit", id: this.hovered }
        : {
            type: "point",
            x: path[path.length - 1].x,
            y: path[path.length - 1].y,
          };

      inputs.push({
        type: "add",
        ability,
        target,
        group: this.selected.length,
        selected,
      });
    }
    clientEngine.sendInput(JSON.stringify(inputs), {});
  }

  addSprite(id: number, sprite: StarwatchSprite) {
    this.sprites.set(id, sprite);

    this.minimap.addSprite(id, sprite);
    this.boxSelect.addSprite(id, sprite);
  }

  select(ids: number[], append: boolean, follow: boolean) {
    if (
      follow &&
      !append &&
      ids.length > 0 &&
      this.selected.length > 0 &&
      JSON.stringify(ids) == JSON.stringify(this.selected)
    ) {
      const entities = gameEngine
        .getEntities()
        .filter((x) => !x.isDecorative && ids.includes(x.id));
      const entity = entities[Math.floor(Math.random() * entities.length)];
      viewport.moveCenter(entity.position.x, entity.position.y);
    }

    if (!append) {
      for (const selected of this.selected) {
        this.sprites.get(selected)!.setSelected(false);
      }
    }

    for (const id of ids) {
      this.sprites.get(id)!.setSelected(true);
    }

    if (append) {
      this.selected.push(...ids.filter((x) => !this.selected.includes(x)));
    } else {
      this.selected = ids;
    }
  }
}
