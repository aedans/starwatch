import {
  GameEngine,
  GameEngineOptions,
  InputData,
  Serializer,
  TwoVector,
} from "lance-gg";
import StarwatchPhysicsEngine from "./StarwatchPhysicsEngine";
import JamesEntity from "./james/JamesEntity";
import Entity from "./Entity";
import CollisionEntity from "./CollisionEntity";
import fs from "fs";
import { TMXMap, parser } from "./TMXLoader";
import { Action } from "./Ability";

export type Input =
  | (Action & {
      type: "add";
      selected: number;
    })
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
    serializer.registerClass(CollisionEntity);
    serializer.registerClass(JamesEntity);
  }

  processInput(inputDesc: InputData, playerId: number): void {
    const inputs = JSON.parse(inputDesc.input) as Input[];
    for (const input of inputs) {
      if (input.type == "add") {
        const object = this.getEntity(input.selected);
        if (object != null && object.playerId == playerId) {
          object.addAction(input);
        }
      } else if (input.type == "clear") {
        for (const id of input.selected) {
          const object = this.getEntity(id);
          if (object != null && object.playerId == playerId) {
            object.clearActions();
          }
        }
      }
    }
  }

  postStep() {
    for (const entity of this.getEntities()) {
      entity.refreshFromPhysics();
      entity.velocity = new TwoVector(0, 0);
      entity.angularVelocity = 0;
      entity.refreshToPhysics();
      entity.postStep(this);
    }
  }

  getEntities() {
    return this.world.queryObjects({}) as Entity[];
  }

  getEntity(id: number) {
    return this.world.queryObject({ id }) as Entity;
  }

  serverInit() {
    const { map } = parser.parse(
      fs.readFileSync(`./public/assets/1v1.tmx`).toString()
    ) as TMXMap;

    const objectgroup = map.objectgroup.find((x) => x.name == "collisions")!;

    for (const object of objectgroup.object) {
      const points = object.polygon.points
        .split(" ")
        .map((p) => p.split(",").map((x) => Number.parseInt(x)));

      this.addObjectToWorld(
        new CollisionEntity(
          this,
          {
            playerId: -1,
            position: new TwoVector(
              Number.parseInt(object.x),
              Number.parseInt(object.y)
            ),
          },
          points
        )
      );
    }

    for (let id = 0; id <= 1; id++) {
      for (let x = 1; x <= 2; x++) {
        for (let y = 1; y <= 2; y++) {
          this.addObjectToWorld(
            new JamesEntity(this, {
              playerId: id,
              position: new TwoVector(100 + 50 * id + x, 100 + y),
            })
          );
        }
      }
    }
  }
}
