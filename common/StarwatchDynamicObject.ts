import { DynamicObject } from "lance-gg";
import StarwatchGameEngine from "./StarwatchGameEngine";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";

export default class StarwatchDynamicObject extends DynamicObject<
  StarwatchGameEngine,
  StarwatchPhysicsEngine
> {}
