import { BaseTypes, PhysicalObject2DProps } from "lance-gg";
import StarwatchGameEngine from "./StarwatchGameEngine";
import Entity from "./Entity";
import { AbilityMap } from "./Ability";

export default class CollisionEntity extends Entity {
  pathStr: string;

  constructor(
    gameEngine: StarwatchGameEngine,
    props: PhysicalObject2DProps,
    path: number[][]
  ) {
    super(gameEngine, props, { maxHealth: 100 });
    this.pathStr = JSON.stringify(path);
  }

  isDecorative: boolean = true;

  abilities: AbilityMap<CollisionEntity> = {};

  get path(): number[][] {
    return JSON.parse(this.pathStr);
  }

  onAddToWorld(): void {
    this.physicsObj = new this.gameEngine.physicsEngine.p2.Body({
      mass: 0,
      position: [this.position.x, this.position.y],
    });

    const path = [...new Set(this.path.map((x) => JSON.stringify(x)))].map(
      (x) => JSON.parse(x)
    );
    const center = path.reduce(
      (acc, [x, y]) => {
        acc.x += x / path.length;
        acc.y += y / path.length;
        return acc;
      },
      { x: 0, y: 0 }
    );

    const angles = path.map(([x, y]) => {
      return {
        x,
        y,
        angle: (Math.atan2(y - center.y, x - center.x) * 180) / Math.PI,
      };
    });

    const vertices = angles
      .sort((a, b) => a.angle - b.angle)
      .map((x) => [x.x, x.y]);

    this.physicsObj.addShape(
      new this.gameEngine.physicsEngine.p2.Convex({
        vertices,
      })
    );

    this.gameEngine.physicsEngine.world.addBody(this.physicsObj);
  }

  static get netScheme() {
    return Object.assign(
      {
        pathStr: {
          type: BaseTypes.TYPES.STRING,
        },
      },
      super.netScheme
    );
  }

  syncTo(other: any): void {
    super.syncTo(other);
    this.pathStr = other.pathStr;
  }
}
