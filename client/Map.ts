import { XMLParser } from "fast-xml-parser";
import { SCALE_MODES, Spritesheet, Texture } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  alwaysCreateTextNode: false,
  textNodeName: "text",
});

export interface TMXMap {
  "?xml": XML;
  map: Map;
}

export interface XML {
  version: string;
  encoding: string;
}

export interface Map {
  editorsettings: Editorsettings;
  tileset: TilesetRef;
  layer: Layer;
  version: string;
  tiledversion: string;
  orientation: string;
  renderorder: string;
  width: string;
  height: string;
  tilewidth: string;
  tileheight: string;
  infinite: string;
  nextlayerid: string;
  nextobjectid: string;
}

export interface Editorsettings {
  export: Export;
}

export interface Export {
  target: string;
  format: string;
}

export interface Layer {
  data: Data;
  id: string;
  name: string;
  width: string;
  height: string;
}

export interface Data {
  text: string;
  encoding: string;
}

export interface TilesetRef {
  firstgid: string;
  source: string;
}

export interface TSXTileset {
  "?xml": XML;
  tileset: Tileset;
}

export interface XML {
  version: string;
  encoding: string;
}

export interface Tileset {
  image: Image;
  version: string;
  tiledversion: string;
  name: string;
  tilewidth: string;
  tileheight: string;
  tilecount: string;
  columns: string;
}

export interface Image {
  source: string;
  width: string;
  height: string;
}

export default class StarwatchMap extends CompositeTilemap {
  constructor(
    public tsxmap: TMXMap["map"],
    public tsxtileset: TSXTileset["tileset"],
    texture: Texture
  ) {
    super();

    for (const [string, row] of tsxmap.layer.data.text
      .split("\n")
      .map((a, i) => [a, i] as const)) {
      for (const [id, col] of string
        .split(",")
        .filter((x) => x != "")
        .map(
          (x, i) =>
            [
              Number.parseInt(x) - Number.parseInt(tsxmap.tileset.firstgid),
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

  static async load(name: string) {
    const { map } = parser.parse(
      await (await fetch(`/assets/${name}.tmx`)).text()
    ) as TMXMap;
    const { tileset } = parser.parse(
      await (await fetch(`/assets/${map.tileset.source}`)).text()
    ) as TSXTileset;
    return { map, tileset };
  }
}
