import {
  GameEngine,
  GameEngineOptions,
  InputData,
  Serializer,
  TwoVector,
} from "lance-gg";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";
import James from "./james/James";
import Entity, { AbilityKey } from "./Entity";

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
          object.setAction({ ability: input.ability, x: input.x, y: input.y });
        }
      }
    }
  }

  postStep() {
    for (const entity of this.world.queryObjects({}) as Entity[]) {
      entity.postStep(this);
      entity.refreshFromPhysics();
    }
  }

  serverInit() {
    for (let i = 0; i < 10; i++) {
      this.addObjectToWorld(
        new James(this, {
          playerId: 0,
          position: new TwoVector(10 * i, 10),
        })
      );
    }
  }
}
