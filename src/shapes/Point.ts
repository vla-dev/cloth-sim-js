import { Vector as Vec2 } from "vector2d";
import { DOT_COLORS, GRAVITY_FACTOR } from "../utils/constants";
import CanvasClickable from "../core/CanvasClickable";
import Stick from "./Stick";

class Point extends CanvasClickable {
  prevPosition!: Vec2;
  color: string = DOT_COLORS.NORMAL;

  isSelected: boolean = false;
  dummyPoint: Point | null = null;
  dummyStick: Stick | null = null;

  constructor(
    public position: Vec2,
    public locked: boolean = false,
    public radius: number = 10
  ) {
    super();
  }

  onMouseDown({ x, y }: Vec2): void {
    const dx = x - this.position.x;
    const dy = y - this.position.y;

    const isClicked = Math.sqrt(dx * dx + dy * dy) <= this.radius;

    if (isClicked) {
      this.setColor(DOT_COLORS.CLICKED);
      this.isSelected = true;

      this.dummyPoint = new Point(new Vec2(x, y));
      this.dummyStick = new Stick(this, this.dummyPoint);
    }
  }

  onMouseUp(): void {
    if (this.isSelected) {
      this.setColor(DOT_COLORS.NORMAL);

      this.dummyPoint?.dispose();
      this.dummyPoint = null;
      this.dummyStick = null;
      this.isSelected = false;
    }
  }

  onMouseMove({ x, y }: Vec2) {
    const dx = x - this.position.x;
    const dy = y - this.position.y;

    const isHoverOver = Math.sqrt(dx * dx + dy * dy) <= this.radius;
    const selectedColor = this.isSelected
      ? DOT_COLORS.CLICKED
      : DOT_COLORS.NORMAL;

    const hoverColor = isHoverOver ? DOT_COLORS.HOVER : selectedColor;

    this.setColor(hoverColor);

    if (this.dummyPoint) this.dummyPoint.position = new Vec2(x, y);
  }

  setColor(color: string) {
    this.color = color;
  }

  update(_dt: number) {
    if (this.locked) return;

    const positionBeforeUpdate = this.position.clone() as Vec2;

    if (this.prevPosition) {
      this.position.add(this.position.clone().subtract(this.prevPosition));
    }

    this.position.add(new Vec2(0, -1).multiplyByScalar(GRAVITY_FACTOR));

    this.prevPosition = positionBeforeUpdate;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.locked ? DOT_COLORS.STATIC : this.color;
    ctx.fill();
    ctx.stroke();

    if (this.dummyPoint) this.dummyPoint.draw(ctx);
    if (this.dummyStick) this.dummyStick.draw(ctx);
  }
}

export default Point;
