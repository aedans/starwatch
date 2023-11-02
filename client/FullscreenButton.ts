import { ColorMatrixFilter, Container, Sprite, Texture } from "pixi.js";

export default class FullscreenButton extends Container {
  constructor() {
    super();

    const filter = new ColorMatrixFilter();
    filter.negative(true);

    const button = new Sprite(Texture.from("/images/settings.png"));
    button.filters = [filter];
    button.width = button.height = 50;
    this.addChild(button);
    
    this.interactive = true;

    this.on("click", function () {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }
}
