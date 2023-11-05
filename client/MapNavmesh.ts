import { Container, Graphics, Point } from "pixi.js";
import { NavMesh, PolyPoints } from "navmesh";
import { TMXMap } from "../common/TMXLoader";

export default class MapNavmesh extends Container {
  navmesh: NavMesh;

  constructor(tmxmap: TMXMap["map"]) {
    super();

    const polygons: PolyPoints[] = [];
    const objectgroup = tmxmap.objectgroup.find((x) => x.name == "navmesh")!;
    for (const object of objectgroup.object.filter((o) => o.polygon)) {
      const points = object.polygon.points
        .split(" ")
        .map((p) => p.split(","))
        .map(([x, y]) => ({ x: Number.parseInt(x), y: Number.parseInt(y) }));

      const sprite = new Graphics();
      sprite.beginFill(Math.random() * 0xffffff);
      sprite.drawPolygon(points.map((p) => new Point(p.x, p.y)));
      sprite.x = Number.parseInt(object.x);
      sprite.y = Number.parseInt(object.y);
      sprite.alpha = 0.5;
      this.addChild(sprite);

      polygons.push(
        points.map((p) => ({ x: p.x + sprite.x, y: p.y + sprite.y }))
      );
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
