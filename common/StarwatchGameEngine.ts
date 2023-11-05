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
import CollisionEntity from "./CollisionEntity";
import fs from "fs";
import { TMXMap, loadTMX, parser } from "./TMXLoader";

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
    serializer.registerClass(CollisionEntity);
    serializer.registerClass(James);
  }

  processInput(inputDesc: InputData, playerId: number): void {
    console.log(playerId);
    const inputs = JSON.parse(inputDesc.input) as StarwatchInput[];
    for (const input of inputs) {
      if (input.type == "add") {
        const object = this.world.queryObject({ id: input.selected }) as Entity;
        if (object != null && object.playerId == playerId) {
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
          if (object != null && object.playerId == playerId) {
            object.clearActions();
          }
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
            new James(this, {
              playerId: id,
              position: new TwoVector(100 + (50 * id) + x, 100 + y),
            })
          );
        }
      }
    }
  }
}
