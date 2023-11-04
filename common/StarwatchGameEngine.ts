import {
  GameEngine,
  GameEngineOptions,
  InputData,
  Serializer,
  TwoVector,
} from "lance-gg";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";
import James from "./james/James";
import Entity from "./Entity";
import Action from "./Action";
import { AbilityKey } from "./Ability";

export type StarwatchInput = {
  type: "set";
  ability: AbilityKey;
  x: number;
  y: number;
  selected: number[];
};

export default class StarwatchGameEngine extends GameEngine<StarwatchPhysicsEngine> {
  constructor(options: GameEngineOptions) {
    super(options);

    this.physicsEngine = new StarwatchPhysicsEngine({
      gameEngine: this,
      collisions: {
        type: "bruteForce",
      },
      gravity: new TwoVector(0, 0),
    });

    this.on("postStep", this.postStep.bind(this));
    this.on("server__init", this.serverInit.bind(this));
  }

  registerClasses(serializer: Serializer): void {
    serializer.registerClass(James);
  }

  processInput(inputDesc: InputData, playerId: number): void {
    const input = JSON.parse(inputDesc.input) as StarwatchInput;
    if (input.type == "set") {
      for (const id of input.selected) {
        const object = this.world.queryObject({ id }) as Entity;
        if (object != null) {
          object.abilities[input.ability]?.(this, object, input.x, input.y);
        }
      }
    }
  }

  postStep() {}

  serverInit() {
    this.addObjectToWorld(
      new James(this, null, {
        playerID: 0,
        position: new TwoVector(10, 10),
      })
    );
  }
}
