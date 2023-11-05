import { Graphics, Point } from "pixi.js";
import { GameObject, PhysicsEngine } from "lance-gg";
import StarwatchGameEngine from "../../common/StarwatchGameEngine";
import CollisionEntity from "../../common/CollisionEntity";

export default class CollisionSprite extends Graphics {
  constructor(object: GameObject<StarwatchGameEngine, PhysicsEngine>) {
    super();

    const entity = object as CollisionEntity;

    this.beginFill(Math.random() * 0xffffff);
    this.drawPolygon(entity.path.map((p) => new Point(p[0], p[1])));

    document.body.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() == "m") {
        this.visible = !this.visible;
      }
    });

    this.visible = false;
  }
}
