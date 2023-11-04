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

export type Ability = (
  engine: StarwatchGameEngine,
  entity: Entity,
  x: number,
  y: number
) => void;
