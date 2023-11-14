import { Texture } from "pixi.js";
import StarwatchSprite from "../StarwatchSprite";
import JamesEntity from "../../common/james/JamesEntity";

export default class JamesSprite extends StarwatchSprite<JamesEntity> {
  constructor(entity: JamesEntity) {
    super(entity);

    const sprite = this.addSprite(Texture.WHITE);
    sprite.tint = 0xffffff;
    sprite.width = this.height = 4;
  }
}
