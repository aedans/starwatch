import Entity from "../Entity";

export default class James extends Entity {
  speed: number = 10;

  syncTo(other: any): void {
    super.syncTo(other);
  }
}
