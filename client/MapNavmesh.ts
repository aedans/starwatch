import { Container, Sprite, Texture } from "pixi.js";
import { TMXMap } from "./StarwatchMap";
import { NavMesh, PolyPoints } from "navmesh";

export default class MapNavmesh extends Container {
  navmesh: NavMesh;

  constructor(tmxmap: TMXMap["map"]) {
    super();

    const polygons: PolyPoints[] = [];
    for (const object of tmxmap.objectgroup.object.filter(
      (x) => x.width && x.height
    )) {
      const sprite = new Sprite(Texture.WHITE);
      sprite.tint = Math.random() * 0xffffff;
      sprite.x = Number.parseInt(object.x);
      sprite.y = Number.parseInt(object.y);
      sprite.width = Number.parseInt(object.width);
      sprite.height = Number.parseInt(object.height);
      this.addChild(sprite);

      polygons.push([
        { x: sprite.x, y: sprite.y },
        { x: sprite.x + sprite.width, y: sprite.y },
        { x: sprite.x + sprite.width, y: sprite.y + sprite.height },
        { x: sprite.x, y: sprite.y + sprite.height },
      ]);
    }

    this.navmesh = new NavMesh(polygons);
    this.visible = false;

    document.body.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() == "m") {
        this.visible = !this.visible;
      }
    });
  }
}
