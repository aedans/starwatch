import JamesEntity from "../common/james/JamesEntity";
import JamesSprite from "./sprites/JamesSprite";
import Entity from "../common/Entity";
import StarwatchSprite from "./StarwatchSprite";

export default class SpriteFactory {
  createSprite(entity: Entity): StarwatchSprite | undefined {
    if (Object.getPrototypeOf(entity) == JamesEntity.prototype) {
      return new JamesSprite(entity as JamesEntity);
    }
  }
}
