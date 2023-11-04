import type { AbilityKey } from "./Ability";

export default class Action {
  constructor(public ability: AbilityKey, public x: number, public y: number) {
  }
}
