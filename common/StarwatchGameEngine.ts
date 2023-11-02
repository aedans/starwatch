import { GameEngine, GameEngineOptions, Serializer, TwoVector } from "lance-gg";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";
import JamesObject from "./james/JamesObject";

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

  postStep() {
    const objects = this.world.queryObjects({});
  }

  serverInit() {
    this.addObjectToWorld(
      new JamesObject(this, null, {
        playerID: 0,
        position: new TwoVector(0, 0),
      })
    );
  }
}
