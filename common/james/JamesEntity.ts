import { PhysicalObject2DProps } from "lance-gg";
import { AbilityMap } from "../Ability";
import AttackMoveAbility from "../AttackMoveAbility";
import Entity from "../Entity";
import MoveAbility from "../MoveAbility";
import StarwatchGameEngine from "../StarwatchGameEngine";

export default class JamesEntity extends Entity {
  constructor(gameEngine: StarwatchGameEngine, props: PhysicalObject2DProps) {
    super(gameEngine, props, { maxHealth: 100 });
  }

  abilities: AbilityMap<JamesEntity> = {
    m: new MoveAbility({ speed: 50 }),
    a: new AttackMoveAbility(() => this.abilities.m, {
      range: 15,
      damage: 1,
    }),
  };

  syncTo(other: any): void {
    super.syncTo(other);
  }
}
