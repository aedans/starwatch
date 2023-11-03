import { Texture } from "pixi.js";
import StarwatchSprite from "../StarwatchSprite";

export default class JamesSprite extends StarwatchSprite {
  constructor() {
    super(Texture.WHITE);
    this.tint = 0xffffff;
    this.width = this.height = 4;
  }
}
