import { GameObject, PhysicsEngine } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import James from "../common/james/James";
import JamesSprite from "./sprites/JamesSprite";
import StarwatchSprite from "./StarwatchSprite";

export default class SpriteFactory {
  prototypes = new Map<any, new (sprite: GameObject<StarwatchGameEngine, PhysicsEngine>) => StarwatchSprite>();

  constructor() {
    this.prototypes.set(James.prototype, JamesSprite);
  }

  createSprite(
    sprite: GameObject<StarwatchGameEngine, PhysicsEngine>
  ): StarwatchSprite {
    for (const [prototype, Constructor] of this.prototypes) {
      if (prototype == Object.getPrototypeOf(sprite)) {
        return new Constructor(sprite);
      }
    }
    throw new Error(`No sprite for ${Object.getPrototypeOf(sprite)}`);
  }
}