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

export type StarwatchInput =
  | {
      type: "add";
      ability: AbilityKey;
      x: number;
      y: number;
      group: number;
      selected: number;
    }
  | {
      type: "clear";
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
    if (input.type == "add") {
      const object = this.world.queryObject({ id: input.selected }) as Entity;
      if (object != null) {
        object.addAction({
          ability: input.ability,
          x: input.x,
          y: input.y,
          group: input.group,
        });
      }
    } else if (input.type == "clear") {
      for (const id of input.selected) {
        const object = this.world.queryObject({ id }) as Entity;
        if (object != null) {
          object.clearActions();
        }
      }
    }
  }

  postStep() {
    for (const entity of this.world.queryObjects({}) as Entity[]) {
      entity.refreshFromPhysics();
      entity.velocity = new TwoVector(0, 0);
      entity.angularVelocity = 0;
      entity.refreshToPhysics();
      entity.postStep(this);
    }
  }

  serverInit() {
    for (let x = 1; x <= 2; x++) {
      for (let y = 1; y <= 2; y++) {
        this.addObjectToWorld(
          new James(this, {
            playerId: 0,
            position: new TwoVector(100 + x, 100 + y),
          })
        );
      }
    }
  }
}
