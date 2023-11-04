import { Sprite, Texture } from "pixi.js";

export default class StarwatchSprite extends Sprite {
  constructor(texture: Texture) {
    super(texture);
    this.anchor.set(.5, .5);
  }
}
