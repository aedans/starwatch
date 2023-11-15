import { BaseTypes, PhysicalObject2D, PhysicalObject2DProps } from "lance-gg";
import StarwatchGameEngine from "./StarwatchGameEngine";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";
import { AbilityMap, Action } from "./Ability";

export default abstract class Entity extends PhysicalObject2D<
  StarwatchGameEngine,
  StarwatchPhysicsEngine
> {
  isDecorative = false;
  
  constructor(gameEngine: StarwatchGameEngine, props: PhysicalObject2DProps) {
    super(gameEngine, undefined, props);
  }

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

  abstract abilities: AbilityMap<Entity>;

  public queue: string[] = [];

  postStep(gameEngine: StarwatchGameEngine) {
    if (this.queue.length > 0) {
      const action = JSON.parse(this.queue[this.queue.length - 1]) as Action;
      if (!this.abilities[action.ability]?.update?.(gameEngine, this, action)) {
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
