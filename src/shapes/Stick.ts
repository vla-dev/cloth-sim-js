import Point from "./Point";
import { Vector as Vec2 } from "vector2d";

class Stick {
  length: number;
  dead: boolean = false;
  color: string = "rgba(255, 255, 255, 0.2)";
  thickness: number = 1;

  constructor(public pointA: Point, public pointB: Point) {
    this.length = pointA.position.distance(pointB.position);
  }

  update(_dt: number) {
    if (this.dead) return;

    const stickCenter = this.pointA.position
      .clone()
      .add(this.pointB.position)
      .divideByScalar(2);

    const stickDir = this.pointA.position
      .clone()
      .subtract(this.pointB.position)
      .normalize();

    if (!this.pointA.locked) {
      this.pointA.position = stickCenter
        .clone()
        .add(
          stickDir.clone().multiplyByScalar(this.length).divideByScalar(2)
        ) as Vec2;
    }
    if (!this.pointB.locked) {
      this.pointB.position = stickCenter
        .clone()
        .subtract(
          stickDir.clone().multiplyByScalar(this.length).divideByScalar(2)
        ) as Vec2;
    }
  }

  setColor(color: string) {
    this.color = color;
  }

  setThickness(thickness: number) {
    this.thickness = thickness;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.dead) return;

    ctx.beginPath();
    ctx.moveTo(this.pointA.position.x, this.pointA.position.y);
    ctx.lineTo(this.pointB.position.x, this.pointB.position.y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    ctx.stroke();
  }
}

export default Stick;
