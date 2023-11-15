import { AbilityMap } from "../Ability";
import AttackMoveAbility from "../AttackMoveAbility";
import Entity from "../Entity";
import MoveAbility from "../MoveAbility";

export default class JamesEntity extends Entity {
  abilities: AbilityMap<JamesEntity> = {
    m: new MoveAbility({ speed: 50 }),
    a: new AttackMoveAbility(() => this.abilities.m, {
      range: 15,
    }),
  };

  syncTo(other: any): void {
    super.syncTo(other);
  }
}
