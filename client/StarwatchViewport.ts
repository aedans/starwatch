import { Viewport } from "pixi-viewport";
import { Application, Ticker } from "pixi.js";

export default class StarwatchViewport extends Viewport {
  constructor(app: Application) {
    super({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000,
      events: app.renderer.events,
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
        clientX < 200 ||
        clientY < 200 ||
        clientX > window.innerWidth - 200 ||
        clientY > window.innerHeight - 200
      ) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const theta = Math.atan2(clientX - centerX, clientY - centerY);
        const dx = Math.sin(theta);
        const dy = Math.cos(theta);
        viewport.moveCenter(
          viewport.center.x + dx * delta * 10,
          viewport.center.y + dy * delta * 10
        );
      }
    });
  }
}
