import { Container, Sprite, Texture } from "pixi.js";

export default class HotkeyPanel extends Container {
  constructor() {
    super();

    const panel = this.addChild(new Sprite(Texture.WHITE));
    panel.tint = 0x222222;
    panel.width = panel.height = 200;
  }

  draw() {

  }
}