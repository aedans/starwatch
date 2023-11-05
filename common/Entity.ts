import {
  BaseTypes,
  PhysicalObject2D,
  PhysicalObject2DProps,
  TwoVector,
} from "lance-gg";
import StarwatchGameEngine from "./StarwatchGameEngine";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";

export type AbilityKey =
  | "q"
  | "w"
  | "e"
  | "r"
  | "a"
  | "d"
  | "f"
  | "z"
  | "x"
  | "c"
  | "v"
  | "m";

export type Action = {
  ability: AbilityKey;
  x: number;
  y: number;
  group: number;
};

export type Ability = (
  engine: StarwatchGameEngine,
  entity: Entity,
  action: Action
) => boolean | undefined;

export type AbilityMap = { [key in AbilityKey]?: Ability };

export default abstract class Entity extends PhysicalObject2D<
  StarwatchGameEngine,
  StarwatchPhysicsEngine
> {
  constructor(gameEngine: StarwatchGameEngine, props: PhysicalObject2DProps) {
    super(gameEngine, undefined, props);
  }

  isDecorative = false;

  onAddToWorld(): void {
    this.physicsObj = new this.gameEngine.physicsEngine.p2.Body({
      mass: 1,
      position: [this.position.x, this.position.y],
      velocity: [this.velocity.x, this.velocity.y],
    });

    this.physicsObj.addShape(
      new this.gameEngine.physicsEngine.p2.Circle({
        radius: 2,
      })
    );

    this.gameEngine.physicsEngine.world.addBody(this.physicsObj);
  }

  onRemoveFromWorld(gameEngine: StarwatchGameEngine) {
    gameEngine.physicsEngine.world.removeBody(this.physicsObj);
  }

  speed: number = 0;

  abilities: AbilityMap = {
    m: (engine, entity, action) => {
      const dx = action.x - entity.position.x;
      const dy = action.y - entity.position.y;

      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < Math.sqrt((action.group * 8) / Math.PI)) {
        entity.velocity = new TwoVector(0, 0);
        entity.refreshToPhysics();
        return false;
      }

      const angle = Math.atan2(dy, dx);
      entity.angle = angle;
      const speed = Math.min(this.speed, this.speed * (distance / 2));
      entity.velocity = new TwoVector(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
      entity.refreshToPhysics();

      return true;
    },
  };

  public queue: string[] = [];

  postStep(gameEngine: StarwatchGameEngine) {
    if (this.queue.length > 0) {
      const action = JSON.parse(this.queue[this.queue.length - 1]) as Action;
      if (!this.abilities[action.ability]?.(gameEngine, this, action)) {
        this.queue.pop();
      }
    }
  }

  actionQueue() {
    return this.queue.map((x) => JSON.parse(x) as Action);
  }

  clearActions() {
    this.queue = [];
  }

  addAction(action: Action) {
    this.queue.unshift(JSON.stringify(action));
  }

  static get netScheme() {
    return Object.assign(
      {
        queue: {
          type: BaseTypes.TYPES.LIST,
          itemType: BaseTypes.TYPES.STRING,
        },
      },
      super.netScheme
    );
  }

  syncTo(other: any): void {
    super.syncTo(other);
    this.queue = other.queue;
  }
}
