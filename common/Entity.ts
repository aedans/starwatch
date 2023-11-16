import { BaseTypes, PhysicalObject2D, PhysicalObject2DProps } from "lance-gg";
import StarwatchGameEngine from "./StarwatchGameEngine";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";
import { AbilityMap, Action } from "./Ability";

export default abstract class Entity extends PhysicalObject2D<
  StarwatchGameEngine,
  StarwatchPhysicsEngine
> {
  isDecorative = false;
  queue: string[] = [];
  health: number;

  abstract abilities: AbilityMap<Entity>;

  constructor(
    gameEngine: StarwatchGameEngine,
    props: PhysicalObject2DProps,
    public settings: { maxHealth: number }
  ) {
    super(gameEngine, undefined, props);
    this.health = settings.maxHealth;
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

  postStep(gameEngine: StarwatchGameEngine) {
    if (this.queue.length > 0) {
      const action = JSON.parse(this.queue[this.queue.length - 1]) as Action;

      if (action.target.type == "unit" && !gameEngine.getEntity(action.target.id)) {
        this.queue.pop();
        return;
      }

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
        health: { type: BaseTypes.TYPES.INT32 },
      },
      super.netScheme
    );
  }

  syncTo(other: any): void {
    super.syncTo(other);
    this.queue = other.queue;
    this.health = other.health;
  }
}
