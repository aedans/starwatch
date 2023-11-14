import Entity from "../Entity";

export default class JamesEntity extends Entity {
  speed: number = 50;

  syncTo(other: any): void {
    super.syncTo(other);
  }
}
