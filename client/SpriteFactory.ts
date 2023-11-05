import James from "../common/james/James";
import JamesSprite from "./sprites/JamesSprite";
import CollisionEntity from "../common/CollisionEntity";
import CollisionSprite from "./sprites/CollisionSprite";
import { Container } from "pixi.js";
import Entity from "../common/Entity";

export default class SpriteFactory {
  prototypes = new Map<any, new (entity: Entity) => Container>();

  constructor() {
    this.prototypes.set(James.prototype, JamesSprite);
    this.prototypes.set(CollisionEntity.prototype, CollisionSprite);
  }

  createSprite(object: Entity): Container {
    for (const [prototype, Constructor] of this.prototypes) {
      if (prototype == Object.getPrototypeOf(object)) {
        return new Constructor(object);
      }
    }
    throw new Error(`No sprite for ${Object.getPrototypeOf(object)}`);
  }
}
