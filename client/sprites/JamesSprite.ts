import { Texture } from "pixi.js";
import StarwatchSprite from "../StarwatchSprite";

export default class JamesSprite extends StarwatchSprite {
  constructor() {
    super(Texture.WHITE);
    this.tint = 0xffffff;
    this.width = this.height = 100;
    this.position.set(10, 10);
  }
}
