import {
  GameEngine,
  GameEngineOptions,
  InputData,
  Serializer,
  TwoVector,
} from "lance-gg";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";
import JamesObject from "./james/JamesObject";
import StarwatchDynamicObject from "./StarwatchDynamicObject";

export type StarwatchInput = {
  type: "move";
  x: number;
  y: number;
  selected: number;
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
    super.registerClasses(serializer);
    serializer.registerClass(JamesObject);
  }

  processInput(inputDesc: InputData, playerId: number): void {
    const input = JSON.parse(inputDesc.input) as StarwatchInput;
    if (input.type == "move") {
      const object = this.world.queryObject({ id: input.selected }) as StarwatchDynamicObject;
      if (object != null) {
        object.position.x = input.x;
        object.position.y = input.y;
      }
    }
  }

  postStep() {}

  serverInit() {
    this.addObjectToWorld(
      new JamesObject(this, null, {
        playerID: 0,
        position: new TwoVector(0, 0),
      })
    );
  }
}
