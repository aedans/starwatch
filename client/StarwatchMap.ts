import { Texture } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import { TMXMap, TSXTileset } from "../common/TMXLoader";

export default class StarwatchMap extends CompositeTilemap {
  constructor(
    public tmxmap: TMXMap["map"],
    public tsxtileset: TSXTileset["tileset"],
    texture: Texture
  ) {
    super();

    this.zIndex = 1;
    for (const [string, row] of tmxmap.layer.data.text
      .split("\n")
      .map((a, i) => [a, i] as const)) {
      for (const [id, col] of string
        .split(",")
        .filter((x) => x != "")
        .map(
          (x, i) =>
            [
              Number.parseInt(x) - Number.parseInt(tmxmap.tileset.firstgid),
              i,
            ] as const
        )) {
        const columns = Number.parseInt(tsxtileset.columns);
        const tileRow = id % columns;
        const tileCol = Math.floor(id / columns);

        this.tile(texture, col * 20, row * 20, {
          u: tileRow * Number.parseInt(tsxtileset.tilewidth),
          v: tileCol * Number.parseInt(tsxtileset.tileheight),
          tileWidth: Number.parseInt(tsxtileset.tilewidth),
          tileHeight: Number.parseInt(tsxtileset.tileheight),
        });
      }
    }
  }
}
