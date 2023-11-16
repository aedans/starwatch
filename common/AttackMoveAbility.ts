import { Circle, Point } from "js-quadtree";
import Ability, { Action } from "./Ability";
import Entity from "./Entity";
import StarwatchGameEngine from "./StarwatchGameEngine";

export default class AttackMoveAbility<T extends Entity> extends Ability<T> {
  constructor(
    public move: () => Ability<T> | undefined,
    public settings: { range: number; damage: number }
  ) {
    super();
  }

  update(
    engine: StarwatchGameEngine,
    entity: T,
    action: Action
  ): boolean | undefined {
    if (action.target.type == "point") {
      const near = engine.quadtree.query(
        new Circle(entity.position.x, entity.position.y, this.settings.range)
      );

      let nearest: Point | null = null;
      let nearestDistance = Infinity;
      for (const point of near.filter(
        (p) => (p.data as Entity).playerId != entity.playerId
      )) {
        const dx = point.x - entity.position.x;
        const dy = point.y - entity.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = point;
        }
      }

      if (nearest != null) {
        nearest.data.health -= this.settings.damage;
        return true;
      } else {
        return this.move()?.update(engine, entity, action);
      }
    } else {
      const targetEntity = engine.getEntity(action.target.id);
      const dx = entity.position.x - targetEntity.position.x;
      const dy = entity.position.y - targetEntity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.settings.range) {
        targetEntity.health -= this.settings.damage;
        return targetEntity.health > 0;
      } else {
        return this.move()?.update(engine, entity, action);
      }
    }
  }
}
