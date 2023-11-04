import Entity from "../Entity";

export default class James extends Entity {
  speed: number = 50;

  syncTo(other: any): void {
    super.syncTo(other);
  }
}
