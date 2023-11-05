import { Viewport } from "pixi-viewport";
import { Application, Ticker } from "pixi.js";

export default class StarwatchViewport extends Viewport {
  constructor(app: Application, worldWidth: number, worldHeight: number) {
    super({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth,
      worldHeight,
      events: app.renderer.events,
    });

    this.setZoom(10);
    this.clamp({
      left: 0,
      top: 0,
      right: worldWidth * 2,
      bottom: worldHeight * 2,
    });

    const viewport = this;
    window.addEventListener("resize", () => {
      viewport.resize(
        window.innerWidth,
        window.innerHeight,
        viewport.worldWidth,
        viewport.worldHeight
      );
    });

    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    window.addEventListener("mousemove", (e) => {
      clientX = e.clientX;
      clientY = e.clientY;
    });

    Ticker.shared.add((delta) => {
      if (
        clientX < 10 ||
        clientY < 10 ||
        clientX > window.innerWidth - 10 ||
        clientY > window.innerHeight - 10
      ) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const theta = Math.atan2(clientX - centerX, clientY - centerY);
        const dx = Math.sin(theta);
        const dy = Math.cos(theta);
        viewport.moveCenter(
          viewport.center.x + dx * delta * 2,
          viewport.center.y + dy * delta * 2
        );
      }
    });
  }
}
