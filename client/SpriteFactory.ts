import { GameObject, PhysicsEngine } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import James from "../common/james/James";
import JamesSprite from "./sprites/JamesSprite";
import CollisionEntity from "../common/CollisionEntity";
import CollisionSprite from "./sprites/CollisionSprite";
import { Container } from "pixi.js";

export default class SpriteFactory {
  prototypes = new Map<
    any,
    new (sprite: GameObject<StarwatchGameEngine, PhysicsEngine>) => Container
  >();

  constructor() {
    this.prototypes.set(James.prototype, JamesSprite);
    this.prototypes.set(CollisionEntity.prototype, CollisionSprite);
  }

  createSprite(
    object: GameObject<StarwatchGameEngine, PhysicsEngine>
  ): Container {
    for (const [prototype, Constructor] of this.prototypes) {
      if (prototype == Object.getPrototypeOf(object)) {
        return new Constructor(object);
      }
    }
    throw new Error(`No sprite for ${Object.getPrototypeOf(object)}`);
  }
}
