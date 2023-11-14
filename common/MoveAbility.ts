import { TwoVector } from "lance-gg";
import Ability, { Action } from "./Ability";
import Entity from "./Entity";
import StarwatchGameEngine from "./StarwatchGameEngine";

export default class MoveAbility<T extends Entity> extends Ability<T> {
  update(
    engine: StarwatchGameEngine,
    entity: T,
    action: Action
  ): boolean | undefined {
    const { x, y } =
      action.target.type == "point"
        ? action.target
        : engine.getEntity(action.target.id).position;

    const dx = x - entity.position.x;
    const dy = y - entity.position.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const targetDistance =
      action.target.type == "point"
        ? Math.sqrt((action.group * 8) / Math.PI)
        : 5;

    if (distance < targetDistance) {
      entity.velocity = new TwoVector(0, 0);
      entity.refreshToPhysics();
      return action.target.type == "unit";
    }

    const angle = Math.atan2(dy, dx);
    entity.angle = angle;
    const speed = Math.min(entity.speed, entity.speed * (distance / 2));
    entity.velocity = new TwoVector(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );
    entity.refreshToPhysics();

    return true;
  }
}
