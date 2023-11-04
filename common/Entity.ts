import { BaseTypes, DynamicObject } from "lance-gg";
import StarwatchGameEngine from "./StarwatchGameEngine";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";
import { Ability, AbilityKey } from "./Ability";
import Action from "./Action";

export type AbilityMap = { [key in AbilityKey]?: Ability };

export default abstract class Entity extends DynamicObject<
  StarwatchGameEngine,
  StarwatchPhysicsEngine
> {
  abilities: AbilityMap = {
    m: (engine, entity, x, y) => {
      entity.position.x = x;
      entity.position.y = y;
    },
  };

  queue: Action[] = [];

  syncTo(other: any): void {
    super.syncTo(other);
  }
}
