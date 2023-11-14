import Entity from "./Entity";
import StarwatchGameEngine from "./StarwatchGameEngine";

export type AbilityKey =
  | "q"
  | "w"
  | "e"
  | "r"
  | "a"
  | "d"
  | "f"
  | "z"
  | "x"
  | "c"
  | "v"
  | "m";

export type ActionTarget =
  | {
      type: "point";
      x: number;
      y: number;
    }
  | {
      type: "unit";
      id: number;
    };

export type Action = {
  ability: AbilityKey;
  target: ActionTarget;
  group: number;
};

export type AbilityMap<T extends Entity> = { [key in AbilityKey]?: Ability<T> };

export default abstract class Ability<T extends Entity> {
  abstract update(
    engine: StarwatchGameEngine,
    entity: T,
    action: Action
  ): boolean | undefined;
}
