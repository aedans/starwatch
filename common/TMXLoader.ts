import { XMLParser } from "fast-xml-parser";

export const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  alwaysCreateTextNode: false,
  textNodeName: "text",
});

export interface TMXMap {
  map: Map;
}

interface Map {
  tileset: TilesetRef;
  layer: Layer;
  objectgroup: ObjectGroup[];
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

interface Layer {
  data: Data;
  id: string;
  name: string;
  width: string;
  height: string;
}

interface ObjectGroup {
  id: string;
  name: string;
  object: Object[];
}

interface Object {
  id: string;
  x: string;
  y: string;
  polygon: Polygon;
}

interface Polygon {
  points: string;
}

interface Data {
  text: string;
  encoding: string;
}

interface TilesetRef {
  firstgid: string;
  source: string;
}

export interface TSXTileset {
  tileset: Tileset;
}

interface Tileset {
  image: Image;
  version: string;
  tiledversion: string;
  name: string;
  tilewidth: string;
  tileheight: string;
  tilecount: string;
  columns: string;
}

interface Image {
  source: string;
  width: string;
  height: string;
}

export async function loadTMX(
  name: string,
  read: (name: string) => Promise<string>
) {
  const { map } = parser.parse(await read(`/assets/${name}.tmx`)) as TMXMap;
  const { tileset } = parser.parse(
    await read(`/assets/${map.tileset.source}`)
  ) as TSXTileset;
  return { map, tileset };
}
